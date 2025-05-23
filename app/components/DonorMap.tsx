"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Import the marker images as modules
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

interface Location {
    lat: number;
    lng: number;
}

interface Donor {
    firstName?: string;
    lastName?: string;
    organ: string;
    bloodGroup: string;
    location: Location | null;
    distance?: number;
}

interface MapComponentProps {
    recipient: Location | null;
    donors: Donor[];
}


const svgIcon = L.divIcon({
    className: "custom-svg-icon",
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41" fill="none">
          <path d="M12.5 0C5.6 0 0 5.6 0 12.5 0 23.9 12.5 41 12.5 41S25 23.9 25 12.5C25 5.6 19.4 0 12.5 0z" fill="#2C7A7B"/>
          <circle cx="12.5" cy="12.5" r="6.25" fill="white"/>
         </svg>`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

// Fix marker icon path issue by assigning imported URLs
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const MapComponent: React.FC<MapComponentProps> = ({ recipient, donors }) => {
    const center = recipient || { lat: 27.7172, lng: 85.3240 };

    return (
        <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow">
            <MapContainer
                center={center}
                zoom={10}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />

                {/* Recipient Marker with SVG icon */}
                {recipient && (
                    <Marker position={recipient} icon={svgIcon}>
                        <Popup>
                            <strong>Recipient</strong>
                            <br />
                            You are here
                        </Popup>
                    </Marker>
                )}

                {/* Donor Markers with default icon */}
                {donors.map((donor, idx) =>
                    donor.location ? (
                        <Marker key={idx} position={donor.location}>
                            <Popup>
                                <strong>
                                    {donor.firstName} {donor.lastName}
                                </strong>
                                <br />
                                Organ: {donor.organ}
                                <br />
                                Blood Group: {donor.bloodGroup}
                                <br />
                                Distance: {donor.distance?.toFixed(2)} km
                            </Popup>
                        </Marker>
                    ) : null
                )}
            </MapContainer>
        </div>
    );
};

export default MapComponent