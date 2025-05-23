"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Menu, X } from 'lucide-react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-white shadow-lg border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-3">
                        <div className="bg-teal-600 p-2 rounded-lg">
                            <Heart className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-gray-800">LifePatch</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link href="/search" className="text-gray-600 hover:text-teal-600 transition-colors font-medium">
                            Find Donors
                        </Link>
                        <Link href="/donate" className="text-gray-600 hover:text-teal-600 transition-colors font-medium">
                            Become a Donor
                        </Link>
                        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors font-medium">
                            Emergency
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-600 hover:text-teal-600 focus:outline-none"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-200">
                    <div className="px-4 pt-2 pb-4 space-y-1">
                        <Link
                            href="/search"
                            className="block text-gray-600 hover:text-teal-600 transition-colors font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            Find Donors
                        </Link>
                        <Link
                            href="/donate"
                            className="block text-gray-600 hover:text-teal-600 transition-colors font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            Become a Donor
                        </Link>
                        <button
                            className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            Emergency
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}
