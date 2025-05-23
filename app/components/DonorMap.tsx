"use client";
import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Location {
    lat: number;
    lng: number;
}

interface Donor {
    email: string;
    firstName?: string;
    lastName?: string;
    organ: string;
    bloodGroup: string;
    distance?: number;
    location: Location;
}

interface DonorMapProps {
    recipient: Location | null;
    donors: Donor[];
}

const DonorMap: React.FC<DonorMapProps> = ({ recipient, donors }) => {
    const mapRef = useRef<L.Map | null>(null);
    const markersRef = useRef<L.LayerGroup | null>(null);

    useEffect(() => {
        if (!recipient) return;

        // Initialize map once
        if (!mapRef.current) {
            mapRef.current = L.map("donor-map").setView([recipient.lat, recipient.lng], 9);

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "&copy; OpenStreetMap contributors",
            }).addTo(mapRef.current);

            markersRef.current = L.layerGroup().addTo(mapRef.current);
        } else {
            // Just pan to new recipient location if map exists
            mapRef.current.setView([recipient.lat, recipient.lng], 9);
        }

        // Clear previous markers
        markersRef.current?.clearLayers();

        // Add recipient marker
        const recipientIcon = L.divIcon({
            className: "custom-div-icon",
            html: `<div style="background-color: #ef4444; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
            iconSize: [12, 12],
            iconAnchor: [6, 6],
        });

        L.marker([recipient.lat, recipient.lng], { icon: recipientIcon })
            .addTo(markersRef.current!)
            .bindPopup("Your Location")
            .openPopup();

        // Add donor markers
        const donorIcon = L.divIcon({
            className: "custom-div-icon",
            html: `<div style="background-color: #22c55e; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
            iconSize: [12, 12],
            iconAnchor: [6, 6],
        });

        donors.forEach((donor) => {
            L.marker([donor.location.lat, donor.location.lng], { icon: donorIcon })
                .addTo(markersRef.current!)
                .bindPopup(
                    `<div class="p-2">
            <h3 class="font-bold">${donor.firstName ?? ""} ${donor.lastName ?? ""}</h3>
            <p>Organ: ${donor.organ}</p>
            <p>Blood Group: ${donor.bloodGroup}</p>
            <p>Distance: ${donor.distance?.toFixed(2) ?? "N/A"} km</p>
          </div>`
                );
        });

        return () => {
            // On unmount, remove map to cleanup
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
                markersRef.current = null;
            }
        };
    }, [recipient, donors]);

    return (
        <div
            id="donor-map"
            style={{ height: "500px" }}
            className="rounded-2xl shadow-lg border border-gray-100 bg-white"
        />
    );
};

export default DonorMap;
