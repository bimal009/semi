"use client";
import React from 'react';
import { Search, Heart } from 'lucide-react';

interface EmptyStateProps {
    title?: string;
    description?: string;
    icon?: React.ReactNode;
    actionButton?: React.ReactNode;
}

export default function EmptyState({
    title = "No Donors Found",
    description = "Try adjusting your search criteria to find more matches",
    icon,
    actionButton
}: EmptyStateProps) {
    return (
        <div className="text-center py-16">
            <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-6">
                {icon || <Search className="h-12 w-12 text-gray-400 mx-auto" />}
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {title}
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {description}
            </p>
            {actionButton}
        </div>
    );
}