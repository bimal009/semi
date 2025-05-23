"use client";
import React from 'react';
import { AlertCircle, Brain } from 'lucide-react';

interface AIResponseProps {
    response: string;
}

export default function AIResponse({ response }: AIResponseProps) {
    if (!response) return null;

    // Clean up the response by removing ** and * formatting
    const cleanResponse = response
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold formatting
        .replace(/\*([^*]+)\*/g, '$1')   // Remove italic formatting
        .trim();

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
                <div className="bg-purple-100 p-3 rounded-xl">
                    <Brain className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">AI Matching Analysis</h3>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                    Powered by AI
                </span>
            </div>

            <div className="space-y-4">
                <div className="bg-purple-50 rounded-xl p-4 border-l-4 border-purple-400">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {cleanResponse}
                    </p>
                </div>

                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <p className="text-sm text-yellow-800">
                        <strong>Important Note:</strong> This analysis is AI-generated and should be reviewed by medical professionals.
                        Final decisions must consider additional medical factors not included in this analysis.
                    </p>
                </div>
            </div>
        </div>
    );
}
