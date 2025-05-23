"use server";

import Doner from "@/lib/database/models/userModel";
import { connectToDatabase } from "@/lib/database/mongoDB";

interface DonorData {
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  bloodGroup: string;
  organ: string;
  lat: number;
  lng: number;
}

export const registerDonor = async (data: DonorData) => {
  try {
    await connectToDatabase();

    // Check if user with email already exists
    const existingUser = await Doner.findOne({ email: data.email });
    if (existingUser) {
      throw new Error("User with this email already exists.");
    }

    // Create new donor user document
    const newDonor = new Doner({
      email: data.email,
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      role: "donor",
      bloodGroup: data.bloodGroup,
      organ: data.organ,
      location: {
        lat: data.lat,
        lng: data.lng,
      },
    });

    await newDonor.save();

    return { success: true, message: "Donor registered successfully." };
  } catch (error: any) {
    console.error(error);
    return { success: false, message: error.message || "Failed to register donor." };
  }
};
