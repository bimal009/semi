"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { calculateDistances } from '@/lib/calculateDistances';
import { generatePrompt } from '@/lib/generatePrompt';
import { getUsers } from './components/api/data.actions';
import Navbar from './components/Navbar';
import SearchForm from './components/OrganSearchForm';
import LoadingSpinner from './components/LoadingSpinner';
import AIResponse from './components/AiResponse';
import DonorList from './components/DonorList';
import EmptyState from './components/EmptyState';
import dynamic from "next/dynamic";
const MapComponent = dynamic(() => import('./components/DonorMap'), { ssr: false });
interface Location {
  lat: number;
  lng: number;
}

interface User {
  firstName?: string;
  lastName?: string;
  organ: string;
  bloodGroup: string;
  location: Location;
  phone?: string;
  email?: string;
  role: 'donor' | 'recipient';
}

interface Donor extends User {
  distance?: number;
}

interface SearchParams {
  organ: string;
  bloodGroup: string;
  urgency: number;
}

function DonorSearchContent() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [recipient, setRecipient] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [locationError, setLocationError] = useState('');

  const urlSearchParams = useSearchParams();

  // Get user location on component mount
  useEffect(() => {
    const location = navigator.geolocation.getCurrentPosition(
      (position) => {
        setRecipient({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationError('');
      },
      (error) => {
        console.error('Location error:', error);
        setLocationError('Unable to detect your location. Using default location.');
        setRecipient({ lat: 27.7172, lng: 85.3240 }); // fallback
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

  }, []);

  // Parse URL parameters if they exist
  useEffect(() => {
    const organ = urlSearchParams.get('organ');
    const bloodGroup = urlSearchParams.get('bloodGroup');
    const urgency = urlSearchParams.get('urgency');

    if (organ && bloodGroup && urgency) {
      const params = {
        organ,
        bloodGroup,
        urgency: parseInt(urgency)
      };
      setSearchParams(params);
      handleSearch(params);
    }
  }, [urlSearchParams]);



  const handleSearch = async (params: SearchParams) => {
    if (!recipient) {
      alert('Please wait for location to be detected or try refreshing the page.');
      return;
    }

    setLoading(true);
    setSearchParams(params);

    try {
      // Update URL with search parameters
      const url = new URL(window.location.href);
      url.searchParams.set('organ', params.organ);
      url.searchParams.set('bloodGroup', params.bloodGroup);
      url.searchParams.set('urgency', params.urgency.toString());
      window.history.replaceState({}, '', url.toString());

      // Fetch all users from database
      const allUsers = await getUsers();

      if (!allUsers) {
        throw new Error('Failed to fetch users');
      }

      // Filter donors based on search criteria
      const matchingDonors = allUsers.filter((user: User) =>
        user.role === 'donor' &&
        user.organ.toLowerCase() === params.organ.toLowerCase() &&
        user.bloodGroup === params.bloodGroup
      );

      if (matchingDonors.length === 0) {
        setDonors([]);
        setAiResponse('');
        return;
      }

      // Calculate distances and sort by proximity
      const donorsWithDistance = await calculateDistances(recipient, matchingDonors);
      const sortedDonors = donorsWithDistance.map(donor => ({
        ...donor,
        organ: params.organ,
        bloodGroup: params.bloodGroup,
        role: 'donor' as const,
        distance: donor.distance
      })).sort((a, b) => (a.distance || 0) - (b.distance || 0));

      setDonors(sortedDonors);

      // Generate AI analysis
      const aiAnalysis = await generatePrompt(
        { ...recipient, ...params },
        sortedDonors.slice(0, 5)
      );

      setAiResponse(aiAnalysis);

    } catch (error) {
      console.error('Search error:', error);
      alert('An error occurred while searching. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleContactDonor = (donor: Donor, type: 'phone' | 'email') => {
    // You can implement custom contact logic here
    // For example, logging the contact attempt, showing a modal, etc.

    if (type === 'phone') {
      if (donor.phone) {
        window.open(`tel:${donor.phone}`);
      } else {
        alert('Phone number not available for this donor.');
      }
    } else if (type === 'email') {
      if (donor.email) {
        const subject = encodeURIComponent(`Organ Donation Inquiry - ${searchParams?.organ}`);
        const body = encodeURIComponent(
          `Hello ${donor.firstName || 'there'},\n\nI am interested in your organ donation listing for ${searchParams?.organ}.\n\nPlease let me know how we can proceed.\n\nThank you.`
        );
        window.open(`mailto:${donor.email}?subject=${subject}&body=${body}`);
      } else {
        alert('Email address not available for this donor.');
      }
    }
  };

  const getUrgencyColor = (urgency: number) => {
    switch (urgency) {
      case 1: return 'text-green-600 bg-green-50';
      case 2: return 'text-yellow-600 bg-yellow-50';
      case 3: return 'text-orange-600 bg-orange-50';
      case 4: return 'text-red-600 bg-red-50';
      case 5: return 'text-red-800 bg-red-100';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getUrgencyLabel = (urgency: number) => {
    switch (urgency) {
      case 1: return 'Low Priority';
      case 2: return 'Moderate';
      case 3: return 'High Priority';
      case 4: return 'Urgent';
      case 5: return 'Critical';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Find Compatible Organ Donors
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with verified organ donors in your area. Our AI-powered matching system
            prioritizes compatibility and proximity for the best outcomes.
          </p>

          {locationError && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-yellow-800 text-sm">{locationError}</p>
            </div>
          )}
        </div>

        {/* Search Form */}
        <div className="mb-8">
          <SearchForm onSearch={handleSearch} loading={loading} />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">
              Searching for compatible donors and calculating distances...
            </p>
          </div>
        )}
        <MapComponent recipient={recipient} donors={donors} />


        {/* Results */}
        {!loading && donors.length > 0 && (
          <div className="space-y-8">
            {/* Search Summary */}
            {searchParams && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Search Results Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-600 font-medium">Organ Type</p>
                    <p className="text-lg font-bold text-blue-800 capitalize">{searchParams.organ}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-green-600 font-medium">Blood Group</p>
                    <p className="text-lg font-bold text-green-800">{searchParams.bloodGroup}</p>
                  </div>
                  <div className={`rounded-lg p-4 ${getUrgencyColor(searchParams.urgency)}`}>
                    <p className="text-sm font-medium">Urgency Level</p>
                    <p className="text-lg font-bold">{getUrgencyLabel(searchParams.urgency)}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-sm text-purple-600 font-medium">Matches Found</p>
                    <p className="text-lg font-bold text-purple-800">{donors.length}</p>
                  </div>
                </div>
              </div>
            )}

            {/* AI Analysis */}
            {aiResponse && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
                <AIResponse response={aiResponse} />
              </div>
            )}

            {/* Donor List */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800">Available Donors</h3>
                <p className="text-gray-600 mt-1">
                  Sorted by proximity to your location
                </p>
              </div>
              <DonorList
                donors={donors}
                onContactDonor={handleContactDonor}
              />
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && donors.length === 0 && searchParams && (
          <div className="text-center py-16">
            <EmptyState
              title="No Donors Found"
              description={`No compatible donors found for ${searchParams.organ} with blood group ${searchParams.bloodGroup} in your area.`}
              actionButton={
                <button
                  onClick={() => {
                    setSearchParams(null);
                    setDonors([]);
                    setAiResponse('');
                    // Clear URL parameters
                    const url = new URL(window.location.href);
                    url.searchParams.delete('organ');
                    url.searchParams.delete('bloodGroup');
                    url.searchParams.delete('urgency');
                    window.history.replaceState({}, '', url.toString());
                  }}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                >
                  Try Different Search
                </button>
              }
            />
          </div>
        )}

        {/* Initial State */}
        {!loading && donors.length === 0 && !searchParams && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Start Your Search</h3>
              <p className="text-gray-600">
                Use the search form above to find compatible organ donors in your area.
              </p>
            </div>
          </div>
        )}

        {/* Footer Information */}
        <div className="mt-16 bg-blue-50 rounded-2xl p-8 border border-blue-100">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-blue-800 mb-4">
              Important Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Verified Donors</h4>
                <p className="text-sm text-gray-600">
                  All donors are verified and have consented to be contacted by recipients.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Privacy Protected</h4>
                <p className="text-sm text-gray-600">
                  Contact information is shared only when you initiate contact with a donor.
                </p>
              </div>
            </div>
            <div className="mt-6 text-sm text-blue-700">
              <p>
                <strong>Medical Advice:</strong> This platform facilitates connections between donors and recipients.
                Always consult with medical professionals before making any decisions about organ transplantation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DonorSearchPage() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" />}>
      <DonorSearchContent />
    </Suspense>
  );
}