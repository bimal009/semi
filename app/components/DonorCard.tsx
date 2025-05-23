"use client";
import { Heart, MapPin, User, Droplets, Phone, Mail, Star, CheckCircle } from 'lucide-react';

interface Location {
    lat: number;
    lng: number;
}

interface Donor {
    firstName?: string;
    lastName?: string;
    organ: string;
    bloodGroup: string;
    distance?: number;
    phone?: string;
    email?: string;
    location: Location;
    role: 'donor' | 'recipient';
}

interface DonorCardProps {
    donor: Donor;
    rank: number;
    isSelected: boolean;
    onSelect: (donor: Donor) => void;
    onContact?: (donor: Donor, type: 'phone' | 'email') => void;
}

export default function DonorCard({ donor, rank, isSelected, onSelect, onContact }: DonorCardProps) {
    const getRankColor = (rank: number) => {
        if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-500';
        if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-400';
        if (rank === 3) return 'bg-gradient-to-r from-orange-400 to-orange-500';
        return 'bg-gradient-to-r from-blue-400 to-blue-500';
    };

    const getRankIcon = (rank: number) => {
        if (rank <= 3) return <Star className="h-4 w-4 text-white" />;
        return <CheckCircle className="h-4 w-4 text-white" />;
    };

    const handleContact = (type: 'phone' | 'email') => {
        if (onContact) {
            onContact(donor, type);
        }
    };

    return (
        <div
            className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 ${isSelected ? 'border-teal-500 ring-4 ring-teal-100' : 'border-gray-100 hover:border-teal-200'
                }`}
            onClick={() => onSelect(donor)}
        >
            {/* Rank Badge */}
            <div className={`absolute -top-3 -right-3 ${getRankColor(rank)} rounded-full p-2 shadow-lg flex items-center space-x-1`}>
                {getRankIcon(rank)}
                <span className="text-white font-bold text-sm">#{rank}</span>
            </div>

            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="bg-teal-100 p-3 rounded-full">
                            <User className="h-6 w-6 text-teal-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">
                                {donor.firstName || "Unknown"} {donor.lastName || ""}
                            </h3>
                            <p className="text-gray-500 text-sm">Organ Donor</p>
                        </div>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Organ</p>
                            <p className="font-semibold text-gray-800">{donor.organ}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Droplets className="h-4 w-4 text-blue-500" />
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Blood Group</p>
                            <p className="font-semibold text-gray-800">{donor.bloodGroup}</p>
                        </div>
                    </div>
                </div>

                {/* Distance */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-600">Distance</span>
                    </div>
                    <span className="font-bold text-lg text-teal-600">
                        {donor.distance?.toFixed(2) || 'N/A'} km
                    </span>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 mt-4">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleContact('phone');
                        }}
                        className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                        <Phone className="h-4 w-4" />
                        <span className="text-sm font-medium">Contact</span>
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleContact('email');
                        }}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                        <Mail className="h-4 w-4" />
                        <span className="text-sm font-medium">Email</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

