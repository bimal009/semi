"use client";
import { useState } from "react";

export default function LocationButton({ onLocation }: { onLocation: (pos: { lat: number, lng: number }) => void }) {
    const [loading, setLoading] = useState(false);

    const getLocation = () => {
        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                onLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                setLoading(false);
            },
            () => {
                alert("Unable to fetch location.");
                setLoading(false);
            }
        );
    };

    return <button onClick={getLocation} disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded">
        {loading ? "Fetching..." : "Use My Location"}
    </button>;
}
