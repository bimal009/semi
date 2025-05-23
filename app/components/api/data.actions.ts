"use server";

import Doner from "@/lib/database/models/userModel";
import User from "@/lib/database/models/userModel";
import { connectToDatabase } from "@/lib/database/mongoDB";
import insert from './../../../node_modules/react-hook-form/dist/utils/insert.d';

const donors = [
    { email: "donor1@lifepatch.org", firstName: "Anita", lastName: "Acharya", role: "donor", bloodGroup: "A-", organ: "Lungs", location: { lat: 27.0998, lng: 87.6926 } },
    { email: "donor2@lifepatch.org", firstName: "Rekha", lastName: "Pandey", role: "donor", bloodGroup: "A+", organ: "Kidney", location: { lat: 27.9192, lng: 82.3575 } },
    { email: "donor3@lifepatch.org", firstName: "Sneha", lastName: "Paudel", role: "donor", bloodGroup: "A+", organ: "Liver", location: { lat: 27.5843, lng: 82.5092 } },
    { email: "donor4@lifepatch.org", firstName: "Raj", lastName: "Bista", role: "donor", bloodGroup: "B-", organ: "Heart", location: { lat: 26.9232, lng: 84.6879 } },
    { email: "donor5@lifepatch.org", firstName: "Rupesh", lastName: "Adhikari", role: "donor", bloodGroup: "A-", organ: "Liver", location: { lat: 27.4422, lng: 87.1602 } },
    { email: "donor6@lifepatch.org", firstName: "Kabita", lastName: "Sharma", role: "donor", bloodGroup: "O+", organ: "Kidney", location: { lat: 27.4512, lng: 85.2384 } },
    { email: "donor7@lifepatch.org", firstName: "Dipak", lastName: "Singh", role: "donor", bloodGroup: "AB+", organ: "Cornea", location: { lat: 27.5733, lng: 85.3347 } },
    { email: "donor8@lifepatch.org", firstName: "Sushil", lastName: "Tamang", role: "donor", bloodGroup: "B-", organ: "Lungs", location: { lat: 27.6399, lng: 85.5205 } },
    { email: "donor9@lifepatch.org", firstName: "Asmita", lastName: "Rai", role: "donor", bloodGroup: "O-", organ: "Heart", location: { lat: 27.7048, lng: 85.3213 } },
    { email: "donor10@lifepatch.org", firstName: "Nisha", lastName: "Karki", role: "donor", bloodGroup: "A-", organ: "Liver", location: { lat: 27.6214, lng: 85.3176 } },
    { email: "donor11@lifepatch.org", firstName: "Sunil", lastName: "Malla", role: "donor", bloodGroup: "AB-", organ: "Cornea", location: { lat: 27.6156, lng: 85.2791 } },
    { email: "donor12@lifepatch.org", firstName: "Rajendra", lastName: "Gurung", role: "donor", bloodGroup: "B+", organ: "Kidney", location: { lat: 27.6725, lng: 85.3076 } },
    { email: "donor13@lifepatch.org", firstName: "Monika", lastName: "Joshi", role: "donor", bloodGroup: "O+", organ: "Lungs", location: { lat: 27.7090, lng: 85.3003 } },
    { email: "donor14@lifepatch.org", firstName: "Sanjay", lastName: "Thapa", role: "donor", bloodGroup: "B-", organ: "Heart", location: { lat: 27.6088, lng: 85.2977 } },
    { email: "donor15@lifepatch.org", firstName: "Deepa", lastName: "Neupane", role: "donor", bloodGroup: "AB+", organ: "Liver", location: { lat: 27.5993, lng: 85.3449 } },
    { email: "donor16@lifepatch.org", firstName: "Suman", lastName: "Raut", role: "donor", bloodGroup: "A+", organ: "Cornea", location: { lat: 27.6234, lng: 85.3381 } },
    { email: "donor17@lifepatch.org", firstName: "Meena", lastName: "Lama", role: "donor", bloodGroup: "O-", organ: "Kidney", location: { lat: 27.6501, lng: 85.3012 } },
    { email: "donor18@lifepatch.org", firstName: "Raj", lastName: "Basnet", role: "donor", bloodGroup: "B+", organ: "Lungs", location: { lat: 27.6775, lng: 85.3104 } },
    { email: "donor19@lifepatch.org", firstName: "Ramesh", lastName: "Khadka", role: "donor", bloodGroup: "A-", organ: "Heart", location: { lat: 27.6833, lng: 85.3402 } },
    { email: "donor20@lifepatch.org", firstName: "Sarita", lastName: "Singh", role: "donor", bloodGroup: "AB-", organ: "Liver", location: { lat: 27.7020, lng: 85.3305 } },
    { email: "donor21@lifepatch.org", firstName: "Rajesh", lastName: "Thapa", role: "donor", bloodGroup: "B-", organ: "Cornea", location: { lat: 27.7141, lng: 85.3347 } },
    { email: "donor22@lifepatch.org", firstName: "Kiran", lastName: "Magar", role: "donor", bloodGroup: "O+", organ: "Kidney", location: { lat: 27.7183, lng: 85.3121 } },
    { email: "donor23@lifepatch.org", firstName: "Sunita", lastName: "Bhattarai", role: "donor", bloodGroup: "A+", organ: "Lungs", location: { lat: 27.7219, lng: 85.3192 } },
    { email: "donor24@lifepatch.org", firstName: "Dipesh", lastName: "Rai", role: "donor", bloodGroup: "AB+", organ: "Heart", location: { lat: 27.7274, lng: 85.3451 } },
    { email: "donor25@lifepatch.org", firstName: "Pushpa", lastName: "Acharya", role: "donor", bloodGroup: "B+", organ: "Liver", location: { lat: 27.7291, lng: 85.3332 } },
    { email: "donor26@lifepatch.org", firstName: "Bikash", lastName: "Neupane", role: "donor", bloodGroup: "O-", organ: "Cornea", location: { lat: 27.7350, lng: 85.3273 } },
    { email: "donor27@lifepatch.org", firstName: "Nisha", lastName: "Shrestha", role: "donor", bloodGroup: "A-", organ: "Kidney", location: { lat: 27.7383, lng: 85.3100 } },
    { email: "donor28@lifepatch.org", firstName: "Sandhya", lastName: "Tamang", role: "donor", bloodGroup: "B-", organ: "Lungs", location: { lat: 27.7411, lng: 85.3019 } },
    { email: "donor29@lifepatch.org", firstName: "Kamal", lastName: "Raut", role: "donor", bloodGroup: "AB-", organ: "Heart", location: { lat: 27.7453, lng: 85.2998 } },
    { email: "donor30@lifepatch.org", firstName: "Puja", lastName: "Joshi", role: "donor", bloodGroup: "A+", organ: "Liver", location: { lat: 27.7492, lng: 85.3143 } },
    { email: "donor31@lifepatch.org", firstName: "Asmita", lastName: "Gurung", role: "donor", bloodGroup: "O+", organ: "Cornea", location: { lat: 27.7501, lng: 85.3201 } },
    { email: "donor32@lifepatch.org", firstName: "Sunil", lastName: "Karki", role: "donor", bloodGroup: "B+", organ: "Kidney", location: { lat: 27.7531, lng: 85.3108 } },
    { email: "donor33@lifepatch.org", firstName: "Anita", lastName: "Lama", role: "donor", bloodGroup: "A-", organ: "Lungs", location: { lat: 27.7549, lng: 85.3129 } },
    { email: "donor34@lifepatch.org", firstName: "Nirmala", lastName: "Singh", role: "donor", bloodGroup: "AB+", organ: "Heart", location: { lat: 27.7568, lng: 85.3140 } },
    { email: "donor35@lifepatch.org", firstName: "Dipak", lastName: "Paudel", role: "donor", bloodGroup: "B-", organ: "Liver", location: { lat: 27.7585, lng: 85.3152 } },
    { email: "donor36@lifepatch.org", firstName: "Kiran", lastName: "Basnet", role: "donor", bloodGroup: "O-", organ: "Cornea", location: { lat: 27.7603, lng: 85.3163 } },
    { email: "donor37@lifepatch.org", firstName: "Suman", lastName: "Sharma", role: "donor", bloodGroup: "A+", organ: "Kidney", location: { lat: 27.7621, lng: 85.3175 } },
    { email: "donor38@lifepatch.org", firstName: "Rajesh", lastName: "Rai", role: "donor", bloodGroup: "B+", organ: "Lungs", location: { lat: 27.7639, lng: 85.3186 } },
    { email: "donor39@lifepatch.org", firstName: "Meena", lastName: "Thapa", role: "donor", bloodGroup: "AB-", organ: "Heart", location: { lat: 27.7657, lng: 85.3198 } },
    { email: "donor40@lifepatch.org", firstName: "Sarita", lastName: "Malla", role: "donor", bloodGroup: "O+", organ: "Liver", location: { lat: 27.7675, lng: 85.3209 } },
    { email: "donor41@lifepatch.org", firstName: "Ram", lastName: "Adhikari", role: "donor", bloodGroup: "A-", organ: "Cornea", location: { lat: 27.7693, lng: 85.3220 } },
    { email: "donor42@lifepatch.org", firstName: "Bimala", lastName: "Gurung", role: "donor", bloodGroup: "B-", organ: "Kidney", location: { lat: 27.7711, lng: 85.3232 } },
    { email: "donor43@lifepatch.org", firstName: "Raj", lastName: "Khadka", role: "donor", bloodGroup: "AB+", organ: "Lungs", location: { lat: 27.7729, lng: 85.3243 } },
    { email: "donor44@lifepatch.org", firstName: "Ramesh", lastName: "Singh", role: "donor", bloodGroup: "O-", organ: "Heart", location: { lat: 27.7747, lng: 85.3254 } },
    { email: "donor45@lifepatch.org", firstName: "Pushpa", lastName: "Neupane", role: "donor", bloodGroup: "A+", organ: "Liver", location: { lat: 27.7765, lng: 85.3265 } },
    { email: "donor46@lifepatch.org", firstName: "Sushil", lastName: "Raut", role: "donor", bloodGroup: "B+", organ: "Cornea", location: { lat: 27.7783, lng: 85.3276 } },
    { email: "donor47@lifepatch.org", firstName: "Kabita", lastName: "Bhattarai", role: "donor", bloodGroup: "AB-", organ: "Kidney", location: { lat: 27.7801, lng: 85.3287 } },
    { email: "donor48@lifepatch.org", firstName: "Dipesh", lastName: "Joshi", role: "donor", bloodGroup: "O+", organ: "Lungs", location: { lat: 27.7819, lng: 85.3298 } },
    { email: "donor49@lifepatch.org", firstName: "Sunita", lastName: "Karki", role: "donor", bloodGroup: "A-", organ: "Heart", location: { lat: 27.7837, lng: 85.3309 } },
    { email: "donor50@lifepatch.org", firstName: "Sanjay", lastName: "Lama", role: "donor", bloodGroup: "B-", organ: "Liver", location: { lat: 27.7855, lng: 85.3320 } },
    { email: "donor51@lifepatch.org", firstName: "Deepa", lastName: "Magar", role: "donor", bloodGroup: "AB+", organ: "Cornea", location: { lat: 27.7873, lng: 85.3331 } },
    { email: "donor52@lifepatch.org", firstName: "Kamal", lastName: "Basnet", role: "donor", bloodGroup: "B+", organ: "Kidney", location: { lat: 27.7891, lng: 85.3342 } },
    { email: "donor53@lifepatch.org", firstName: "Puja", lastName: "Rai", role: "donor", bloodGroup: "O-", organ: "Lungs", location: { lat: 27.7909, lng: 85.3353 } },
    { email: "donor54@lifepatch.org", firstName: "Asmita", lastName: "Shrestha", role: "donor", bloodGroup: "A+", organ: "Heart", location: { lat: 27.7927, lng: 85.3364 } },
    { email: "donor55@lifepatch.org", firstName: "Rajendra", lastName: "Thapa", role: "donor", bloodGroup: "AB-", organ: "Liver", location: { lat: 27.7945, lng: 85.3375 } },
    { email: "donor56@lifepatch.org", firstName: "Sunil", lastName: "Malla", role: "donor", bloodGroup: "B-", organ: "Cornea", location: { lat: 27.7963, lng: 85.3386 } },
    { email: "donor57@lifepatch.org", firstName: "Rajesh", lastName: "Adhikari", role: "donor", bloodGroup: "O+", organ: "Kidney", location: { lat: 27.7981, lng: 85.3397 } },
    { email: "donor58@lifepatch.org", firstName: "Monika", lastName: "Gurung", role: "donor", bloodGroup: "A-", organ: "Lungs", location: { lat: 27.7999, lng: 85.3408 } },
    { email: "donor59@lifepatch.org", firstName: "Suman", lastName: "Khadka", role: "donor", bloodGroup: "B+", organ: "Heart", location: { lat: 27.8017, lng: 85.3419 } },
    { email: "donor60@lifepatch.org", firstName: "Raj", lastName: "Singh", role: "donor", bloodGroup: "AB+", organ: "Liver", location: { lat: 27.8035, lng: 85.3430 } },
    { email: "donor61@lifepatch.org", firstName: "Rupesh", lastName: "Neupane", role: "donor", bloodGroup: "O-", organ: "Cornea", location: { lat: 27.8053, lng: 85.3441 } },
    { email: "donor62@lifepatch.org", firstName: "Nisha", lastName: "Raut", role: "donor", bloodGroup: "A+", organ: "Kidney", location: { lat: 27.8071, lng: 85.3452 } },
    { email: "donor63@lifepatch.org", firstName: "Kabita", lastName: "Bhattarai", role: "donor", bloodGroup: "B-", organ: "Lungs", location: { lat: 27.8089, lng: 85.3463 } },
    { email: "donor64@lifepatch.org", firstName: "Dipak", lastName: "Joshi", role: "donor", bloodGroup: "AB-", organ: "Heart", location: { lat: 27.8107, lng: 85.3474 } },
    { email: "donor65@lifepatch.org", firstName: "Sunita", lastName: "Karki", role: "donor", bloodGroup: "B+", organ: "Liver", location: { lat: 27.8125, lng: 85.3485 } },
    { email: "donor66@lifepatch.org", firstName: "Sanjay", lastName: "Lama", role: "donor", bloodGroup: "O+", organ: "Cornea", location: { lat: 27.8143, lng: 85.3496 } },
    { email: "donor67@lifepatch.org", firstName: "Deepa", lastName: "Magar", role: "donor", bloodGroup: "A-", organ: "Kidney", location: { lat: 27.8161, lng: 85.3507 } },
    { email: "donor68@lifepatch.org", firstName: "Kamal", lastName: "Basnet", role: "donor", bloodGroup: "B-", organ: "Lungs", location: { lat: 27.8179, lng: 85.3518 } },
    { email: "donor69@lifepatch.org", firstName: "Puja", lastName: "Rai", role: "donor", bloodGroup: "AB+", organ: "Heart", location: { lat: 27.8197, lng: 85.3529 } },
    { email: "donor70@lifepatch.org", firstName: "Asmita", lastName: "Shrestha", role: "donor", bloodGroup: "O-", organ: "Liver", location: { lat: 27.8215, lng: 85.3540 } },
    { email: "donor71@lifepatch.org", firstName: "Rajendra", lastName: "Thapa", role: "donor", bloodGroup: "A+", organ: "Cornea", location: { lat: 27.8233, lng: 85.3551 } },
    { email: "donor72@lifepatch.org", firstName: "Sunil", lastName: "Malla", role: "donor", bloodGroup: "B+", organ: "Kidney", location: { lat: 27.8251, lng: 85.3562 } },
    { email: "donor73@lifepatch.org", firstName: "Rajesh", lastName: "Adhikari", role: "donor", bloodGroup: "AB-", organ: "Lungs", location: { lat: 27.8269, lng: 85.3573 } },
    { email: "donor74@lifepatch.org", firstName: "Monika", lastName: "Gurung", role: "donor", bloodGroup: "O+", organ: "Heart", location: { lat: 27.8287, lng: 85.3584 } },
    { email: "donor75@lifepatch.org", firstName: "Suman", lastName: "Khadka", role: "donor", bloodGroup: "A-", organ: "Liver", location: { lat: 27.8305, lng: 85.3595 } },
    { email: "donor76@lifepatch.org", firstName: "Raj", lastName: "Singh", role: "donor", bloodGroup: "B-", organ: "Cornea", location: { lat: 27.8323, lng: 85.3606 } },
    { email: "donor77@lifepatch.org", firstName: "Rupesh", lastName: "Neupane", role: "donor", bloodGroup: "AB+", organ: "Kidney", location: { lat: 27.8341, lng: 85.3617 } },
    { email: "donor78@lifepatch.org", firstName: "Nisha", lastName: "Raut", role: "donor", bloodGroup: "B+", organ: "Lungs", location: { lat: 27.8359, lng: 85.3628 } },
    { email: "donor79@lifepatch.org", firstName: "Kabita", lastName: "Bhattarai", role: "donor", bloodGroup: "O-", organ: "Heart", location: { lat: 27.8377, lng: 85.3639 } },
    { email: "donor80@lifepatch.org", firstName: "Dipak", lastName: "Joshi", role: "donor", bloodGroup: "A+", organ: "Liver", location: { lat: 27.8395, lng: 85.3650 } },
    { email: "donor81@lifepatch.org", firstName: "Sunita", lastName: "Karki", role: "donor", bloodGroup: "B-", organ: "Cornea", location: { lat: 27.8413, lng: 85.3661 } },
    { email: "donor82@lifepatch.org", firstName: "Sanjay", lastName: "Lama", role: "donor", bloodGroup: "AB-", organ: "Kidney", location: { lat: 27.8431, lng: 85.3672 } },
    { email: "donor83@lifepatch.org", firstName: "Deepa", lastName: "Magar", role: "donor", bloodGroup: "O+", organ: "Lungs", location: { lat: 27.8449, lng: 85.3683 } },
    { email: "donor84@lifepatch.org", firstName: "Kamal", lastName: "Basnet", role: "donor", bloodGroup: "A-", organ: "Heart", location: { lat: 27.8467, lng: 85.3694 } },
    { email: "donor85@lifepatch.org", firstName: "Puja", lastName: "Rai", role: "donor", bloodGroup: "B+", organ: "Liver", location: { lat: 27.8485, lng: 85.3705 } },
    { email: "donor86@lifepatch.org", firstName: "Asmita", lastName: "Shrestha", role: "donor", bloodGroup: "AB+", organ: "Cornea", location: { lat: 27.8503, lng: 85.3716 } },
    { email: "donor87@lifepatch.org", firstName: "Rajendra", lastName: "Thapa", role: "donor", bloodGroup: "B-", organ: "Kidney", location: { lat: 27.8521, lng: 85.3727 } },
    { email: "donor88@lifepatch.org", firstName: "Sunil", lastName: "Malla", role: "donor", bloodGroup: "O-", organ: "Lungs", location: { lat: 27.8539, lng: 85.3738 } },
    { email: "donor89@lifepatch.org", firstName: "Rajesh", lastName: "Adhikari", role: "donor", bloodGroup: "A+", organ: "Heart", location: { lat: 27.8557, lng: 85.3749 } },
    { email: "donor90@lifepatch.org", firstName: "Monika", lastName: "Gurung", role: "donor", bloodGroup: "B+", organ: "Liver", location: { lat: 27.8575, lng: 85.3760 } },
    { email: "donor91@lifepatch.org", firstName: "Suman", lastName: "Khadka", role: "donor", bloodGroup: "AB-", organ: "Cornea", location: { lat: 27.8593, lng: 85.3771 } },
    { email: "donor92@lifepatch.org", firstName: "Raj", lastName: "Singh", role: "donor", bloodGroup: "O+", organ: "Kidney", location: { lat: 27.8611, lng: 85.3782 } },
    { email: "donor93@lifepatch.org", firstName: "Rupesh", lastName: "Neupane", role: "donor", bloodGroup: "A-", organ: "Lungs", location: { lat: 27.8629, lng: 85.3793 } },
    { email: "donor94@lifepatch.org", firstName: "Nisha", lastName: "Raut", role: "donor", bloodGroup: "B-", organ: "Heart", location: { lat: 27.8647, lng: 85.3804 } },
    { email: "donor95@lifepatch.org", firstName: "Kabita", lastName: "Bhattarai", role: "donor", bloodGroup: "AB+", organ: "Liver", location: { lat: 27.8665, lng: 85.3815 } },
    { email: "donor96@lifepatch.org", firstName: "Dipak", lastName: "Joshi", role: "donor", bloodGroup: "O-", organ: "Cornea", location: { lat: 27.8683, lng: 85.3826 } },
    { email: "donor97@lifepatch.org", firstName: "Sunita", lastName: "Karki", role: "donor", bloodGroup: "A+", organ: "Kidney", location: { lat: 27.8701, lng: 85.3837 } },
    { email: "donor98@lifepatch.org", firstName: "Sanjay", lastName: "Lama", role: "donor", bloodGroup: "B+", organ: "Lungs", location: { lat: 27.8719, lng: 85.3848 } },
    { email: "donor99@lifepatch.org", firstName: "Deepa", lastName: "Magar", role: "donor", bloodGroup: "AB-", organ: "Heart", location: { lat: 27.8737, lng: 85.3859 } },
    { email: "donor100@lifepatch.org", firstName: "Kamal", lastName: "Basnet", role: "donor", bloodGroup: "O+", organ: "Liver", location: { lat: 27.8755, lng: 85.3870 } },
  ]
  
  
  
export async function getUsers() {

    await connectToDatabase();
    try {
        const users = await Doner.find();
        // Convert MongoDB documents to plain objects
        return users.map(Doner => ({
            email: Doner.email,
            username: Doner.username,
            firstName: Doner.firstName,
            lastName: Doner.lastName,
            role: Doner.role,
            bloodGroup: Doner.bloodGroup,
            organ: Doner.organ,
            urgency: Doner.urgency,
            location: {
                lat: Doner.location.lat,
                lng: Doner.location.lng
            },
            matchedUsers: Doner.matchedUsers?.map(id => id.toString()),
            createdAt: Doner.createdAt,
            updatedAt: Doner.updatedAt
        }));
    } catch (err) {
        console.error("❌ Error fetching users:", err);
        return [];
    }
}


