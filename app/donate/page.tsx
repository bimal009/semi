"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { registerDonor } from "../components/api/user.actions";

type FormData = {
    email: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    bloodGroup: string;
    organ: string;
    lat: number;
    lng: number;
};

export default function DonorFormPage() {
    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<FormData>();

    const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const organs = ["Kidney", "Liver", "Heart", "Lung", "Pancreas", "Intestine"];

    useEffect(() => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setValue("lat", position.coords.latitude);
                setValue("lng", position.coords.longitude);
            },
            (error) => {
                alert("Unable to retrieve your location: " + error.message);
            }
        );

    }, [setValue]);

    const onSubmit = async (data: FormData) => {
        await registerDonor(data)
    };


    return (
        <main className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Become a Donor</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Email */}
                <div>
                    <label htmlFor="email" className="block mb-1 font-medium text-gray-700">
                        Email *
                    </label>
                    <input
                        id="email"
                        type="email"
                        {...register("email", { required: "Email is required" })}
                        className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors.email ? "border-red-500" : "border-gray-300"
                            }`}
                    />
                    {errors.email && (
                        <p className="text-red-600 mt-1 text-sm">{errors.email.message}</p>
                    )}
                </div>

                {/* Username */}
                <div>
                    <label htmlFor="username" className="block mb-1 font-medium text-gray-700">
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        {...register("username")}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                </div>

                {/* First Name */}
                <div>
                    <label htmlFor="firstName" className="block mb-1 font-medium text-gray-700">
                        First Name
                    </label>
                    <input
                        id="firstName"
                        type="text"
                        {...register("firstName")}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                </div>

                {/* Last Name */}
                <div>
                    <label htmlFor="lastName" className="block mb-1 font-medium text-gray-700">
                        Last Name
                    </label>
                    <input
                        id="lastName"
                        type="text"
                        {...register("lastName")}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                </div>

                {/* Blood Group */}
                <div>
                    <label htmlFor="bloodGroup" className="block mb-1 font-medium text-gray-700">
                        Blood Group *
                    </label>
                    <select
                        id="bloodGroup"
                        {...register("bloodGroup", { required: "Blood group is required" })}
                        defaultValue=""
                        className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors.bloodGroup ? "border-red-500" : "border-gray-300"
                            }`}
                    >
                        <option value="" disabled>
                            Select blood group
                        </option>
                        {bloodGroups.map((bg) => (
                            <option key={bg} value={bg}>
                                {bg}
                            </option>
                        ))}
                    </select>
                    {errors.bloodGroup && (
                        <p className="text-red-600 mt-1 text-sm">{errors.bloodGroup.message}</p>
                    )}
                </div>

                {/* Organ */}
                <div>
                    <label htmlFor="organ" className="block mb-1 font-medium text-gray-700">
                        Organ to Donate *
                    </label>
                    <select
                        id="organ"
                        {...register("organ", { required: "Organ is required" })}
                        defaultValue=""
                        className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors.organ ? "border-red-500" : "border-gray-300"
                            }`}
                    >
                        <option value="" disabled>
                            Select organ
                        </option>
                        {organs.map((org) => (
                            <option key={org} value={org}>
                                {org}
                            </option>
                        ))}
                    </select>
                    {errors.organ && (
                        <p className="text-red-600 mt-1 text-sm">{errors.organ.message}</p>
                    )}
                </div>

                {/* Hidden lat/lng inputs */}
                <input
                    type="hidden"
                    {...register("lat", { required: "Latitude is required", valueAsNumber: true })}
                />
                <input
                    type="hidden"
                    {...register("lng", { required: "Longitude is required", valueAsNumber: true })}
                />

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-md transition-colors disabled:opacity-50"
                >
                    {isSubmitting ? "Submitting..." : "Register as Donor"}
                </button>
            </form>
        </main>
    );
}
