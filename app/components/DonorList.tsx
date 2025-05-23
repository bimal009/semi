"use client";
import React, { useState } from 'react';
import { User } from 'lucide-react';
import DonorCard from './DonorCard';

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

interface DonorListProps {
    donors: Donor[];
    onContactDonor?: (donor: Donor, type: 'phone' | 'email') => void;
}

export default function DonorList({ donors, onContactDonor }: DonorListProps) {
    const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);

    if (!donors || donors.length === 0) {
        return null;
    }

    const handleContact = (donor: Donor, type: 'phone' | 'email') => {
        if (onContactDonor) {
            onContactDonor(donor, type);
        } else {
            if (type === 'phone' && donor.phone) {
                window.open(`tel:${donor.phone}`);
            } else if (type === 'email' && donor.email) {
                window.open(`mailto:${donor.email}`);
            } else {
                alert(`Contact information not available for ${type}`);
            }
        }
    };

    const isSameDonor = (a: Donor, b: Donor) => {
        return (
            a.firstName === b.firstName &&
            a.lastName === b.lastName &&
            a.organ === b.organ &&
            a.bloodGroup === b.bloodGroup
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-3 rounded-xl">
                        <User className="h-6 w-6 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Compatible Donors Found
                    </h2>
                </div>
                <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                    {donors.length} {donors.length === 1 ? 'match' : 'matches'}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {donors.slice(0, 5).map((donor, index) => (
                    <DonorCard
                        key={index}
                        donor={donor}
                        rank={index + 1}
                        isSelected={selectedDonor ? isSameDonor(donor, selectedDonor) : false}
                        onSelect={(donor) => setSelectedDonor(donor)}
                        onContact={handleContact}
                    />
                ))}
            </div>

            {donors.length > 5 && (
                <div className="text-center">
                    <button className="bg-teal-100 hover:bg-teal-200 text-teal-700 px-6 py-3 rounded-lg transition-colors duration-200 font-medium">
                        View All {donors.length} Donors
                    </button>
                </div>
            )}
        </div>
    );
}
