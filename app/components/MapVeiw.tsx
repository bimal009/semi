"use client";
import { useEffect } from "react";
import L from "leaflet";

interface Location {
    lat: number;
    lng: number;
}

interface Donor {
    firstName?: string;
    lastName?: string;
    location: Location;
    organ: string;
    bloodGroup: string;
    distance?: number;
}

export default function MapView({
    recipient,
    donors,
}: {
    recipient: Location | null;
    donors: Donor[];
}) {
    useEffect(() => {
        if (!recipient || donors.length === 0) return;

        const map = L.map("map").setView([recipient.lat, recipient.lng], 9);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);

        // Add recipient marker
        L.marker([recipient.lat, recipient.lng])
            .addTo(map)
            .bindPopup("Recipient Location")
            .openPopup();

        // Add donor markers
        donors.forEach((donor) => {
            L.marker([donor.location.lat, donor.location.lng])
                .addTo(map)
                .bindPopup(
                    `<b>${donor.firstName ?? "Unknown"} ${donor.lastName ?? ""}</b><br/>
          Organ: ${donor.organ}<br/>
          Blood Group: ${donor.bloodGroup}<br/>
          Distance: ${donor.distance?.toFixed(2) ?? "N/A"} km`
                );
        });

        return () => map.remove();
    }, [recipient, donors]);

    return <div id="map" style={{ height: "400px", width: "100%" }} className="rounded shadow" />;
}
