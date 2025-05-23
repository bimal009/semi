"use client";

import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { getUsers } from "./api/data.actions";
import Navbar from "./Navbar";
import Footer from "./Footer";

const ORS_API_KEY = process.env.NEXT_PUBLIC_ORS_API_KEY;

interface Location {
    lat: number;
    lng: number;
}

type PlainUser = {
    clerkId: string;
    email: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    photo?: string;
    role: "donor" | "recipient";
    bloodGroup: string;
    organ: string;
    urgency?: number;
    location: Location;
    matchedUsers?: string[];
    createdAt: Date;
    updatedAt: Date;
};

interface DonorWithDistance extends PlainUser {
    distance?: number;
}

const DonorMap = ({ searchParams }: { searchParams: { organ: string; urgency: number; bloodGroup: string } }) => {
    const [recipient, setRecipient] = useState<{ lat: number; lng: number } | null>(null);
    const [donors, setDonors] = useState<DonorWithDistance[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedDonor, setSelectedDonor] = useState<DonorWithDistance | null>(null);

    useEffect(() => {
        async function fetchUsers() {
            const users = await getUsers();
            if (users) {
                const filteredDonors = users.filter(user =>
                    user.role === "donor" &&
                    user.organ.toLowerCase() === searchParams.organ.toLowerCase() &&
                    user.bloodGroup === searchParams.bloodGroup
                );
                setDonors(filteredDonors.map(donor => ({ ...donor, distance: undefined })));
            }
        }
        fetchUsers();

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setRecipient({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                () => setRecipient({ lat: 27.7172, lng: 85.3240 })
            );
        } else {
            setRecipient({ lat: 27.7172, lng: 85.3240 });
        }
    }, [searchParams]);

    useEffect(() => {
        if (!recipient || donors.length === 0) return;

        async function fetchDistances() {
            setLoading(true);
            try {
                const locations = [
                    [recipient.lng, recipient.lat],
                    ...donors.map((d) => [d.location.lng, d.location.lat]),
                ];

                const { data } = await axios.post(
                    "https://api.openrouteservice.org/v2/matrix/driving-car",
                    {
                        locations,
                        sources: [0],
                        destinations: donors.map((_, i) => i + 1),
                        metrics: ["distance"],
                        units: "km",
                    },
                    {
                        headers: { Authorization: ORS_API_KEY!, "Content-Type": "application/json" },
                    }
                );

                const distances = data.distances[0];
                const donorsWithDistance = donors.map((donor, i) => ({
                    ...donor,
                    distance: distances[i],
                }));

                donorsWithDistance.sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
                setDonors(donorsWithDistance);
            } catch (error) {
                console.error("ORS matrix error:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchDistances();
    }, [recipient, donors]);

    useEffect(() => {
        if (!recipient || donors.length === 0) return;

        const newMap = L.map("map").setView([recipient.lat, recipient.lng], 9);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
        }).addTo(newMap);

        const recipientIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: #ef4444; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
            iconSize: [12, 12],
            iconAnchor: [6, 6]
        });

        L.marker([recipient.lat, recipient.lng], { icon: recipientIcon })
            .addTo(newMap)
            .bindPopup("Your Location")
            .openPopup();

        const donorIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: #22c55e; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
            iconSize: [12, 12],
            iconAnchor: [6, 6]
        });

        donors.forEach((donor) => {
            L.marker([donor.location.lat, donor.location.lng], { icon: donorIcon })
                .addTo(newMap)
                .bindPopup(
                    `<div class="p-2">
                        <h3 class="font-bold">${donor.firstName} ${donor.lastName}</h3>
                        <p>Organ: ${donor.organ}</p>
                        <p>Blood Group: ${donor.bloodGroup}</p>
                        <p>Distance: ${donor.distance?.toFixed(2) ?? "N/A"} km</p>
                    </div>`
                );
        });

        return () => {
            newMap.remove();
        };
    }, [recipient, donors]);

    const topDonors = donors.slice(0, 5);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <main className="flex-grow">
                <div className="p-4 max-w-7xl mx-auto space-y-6">
                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-teal-500 transform transition-all duration-300 hover:shadow-lg">
                        <h1 className="text-3xl font-bold mb-2 text-teal-800">Organ Donor Matches</h1>
                        <p className="text-gray-600 mb-4">
                            Searching for {searchParams.organ} donors with blood group {searchParams.bloodGroup}
                        </p>
                        {!recipient && (
                            <div className="flex items-center text-yellow-600">
                                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Fetching your location...
                            </div>
                        )}
                        {loading && (
                            <div className="flex items-center text-blue-600">
                                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Calculating distances...
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <div id="map" style={{ height: "500px", width: "100%" }} className="rounded-lg shadow-md transform transition-all duration-300 hover:shadow-lg"></div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6 transform transition-all duration-300 hover:shadow-lg">
                            <h2 className="text-xl font-semibold mb-4 text-teal-800">Top 5 Closest Donors</h2>
                            <div className="space-y-4">
                                {topDonors.map((donor, index) => (
                                    <div
                                        key={donor.clerkId}
                                        className={`p-4 border rounded-lg transition-all duration-300 cursor-pointer
                                            ${selectedDonor?.clerkId === donor.clerkId
                                                ? 'bg-teal-50 border-teal-500 shadow-md'
                                                : 'hover:bg-teal-50 hover:border-teal-300'}`}
                                        onClick={() => setSelectedDonor(donor)}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-semibold text-lg text-teal-900">
                                                {donor.firstName} {donor.lastName}
                                            </h3>
                                            <span className="text-sm font-medium text-teal-600 bg-teal-100 px-2 py-1 rounded-full">
                                                #{index + 1}
                                            </span>
                                        </div>
                                        <div className="mt-2 space-y-2 text-sm text-gray-600">
                                            <p className="flex items-center">
                                                <svg className="w-4 h-4 mr-2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                                Organ: {donor.organ}
                                            </p>
                                            <p className="flex items-center">
                                                <svg className="w-4 h-4 mr-2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                </svg>
                                                Blood Group: {donor.bloodGroup}
                                            </p>
                                            <p className="flex items-center font-medium text-teal-600">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                Distance: {donor.distance?.toFixed(2) ?? "N/A"} km
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default DonorMap; 