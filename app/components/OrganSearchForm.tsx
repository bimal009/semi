"use client";
import React, { useState } from 'react';
import { Search, Heart, Droplets, AlertCircle } from 'lucide-react';

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const ORGANS = ["Heart", "Liver", "Kidney", "Lung", "Pancreas", "Small Intestine"];

interface SearchParams {
    organ: string;
    bloodGroup: string;
    urgency: number;
}

interface SearchFormProps {
    onSearch: (params: SearchParams) => void;
    loading?: boolean;
}

export default function SearchForm({ onSearch, loading = false }: SearchFormProps) {
    const [organ, setOrgan] = useState('');
    const [bloodGroup, setBloodGroup] = useState('');
    const [urgency, setUrgency] = useState(5);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (organ && bloodGroup) {
            onSearch({ organ, bloodGroup, urgency });
        }
    };

    const getUrgencyColor = (level: number) => {
        if (level <= 2) return 'text-green-600';
        if (level <= 3) return 'text-yellow-600';
        if (level <= 4) return 'text-orange-600';
        return 'text-red-600';
    };

    const getUrgencyText = (level: number) => {
        if (level <= 2) return 'Low';
        if (level <= 3) return 'Medium';
        if (level <= 4) return 'High';
        return 'Critical';
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
                <div className="bg-teal-100 p-3 rounded-xl">
                    <Search className="h-6 w-6 text-teal-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Search for Donors</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Organ Selection */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <Heart className="inline h-4 w-4 mr-1 text-red-500" />
                            Organ Type *
                        </label>
                        <select
                            value={organ}
                            onChange={(e) => setOrgan(e.target.value)}
                            required
                            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-100 focus:border-teal-500 transition-all duration-200"
                        >
                            <option value="">Select Organ</option>
                            {ORGANS.map(organType => (
                                <option key={organType} value={organType}>{organType}</option>
                            ))}
                        </select>
                    </div>

                    {/* Blood Group Selection */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <Droplets className="inline h-4 w-4 mr-1 text-blue-500" />
                            Blood Group *
                        </label>
                        <select
                            value={bloodGroup}
                            onChange={(e) => setBloodGroup(e.target.value)}
                            required
                            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-100 focus:border-teal-500 transition-all duration-200"
                        >
                            <option value="">Select Blood Group</option>
                            {BLOOD_GROUPS.map(group => (
                                <option key={group} value={group}>{group}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Urgency Level */}
                <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">
                        <AlertCircle className="inline h-4 w-4 mr-1 text-orange-500" />
                        Urgency Level
                    </label>
                    <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-gray-600">Level {urgency}</span>
                            <span className={`text-sm font-semibold ${getUrgencyColor(urgency)}`}>
                                {getUrgencyText(urgency)}
                            </span>
                        </div>
                        <input
                            type="range"
                            min={1}
                            max={5}
                            value={urgency}
                            onChange={(e) => setUrgency(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Low</span>
                            <span>Medium</span>
                            <span>High</span>
                            <span>Critical</span>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading || !organ || !bloodGroup}
                    className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white py-4 px-6 rounded-xl transition-colors duration-200 font-semibold text-lg flex items-center justify-center space-x-2"
                >
                    {loading ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                            <span>Searching...</span>
                        </>
                    ) : (
                        <>
                            <Search className="h-5 w-5" />
                            <span>Find Compatible Donors</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}

