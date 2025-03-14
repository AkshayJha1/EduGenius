import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import { toast } from 'react-hot-toast';

export const ProfileStore = create((set, get) => ({
    myProfile: null,
    isFetchingProfile: false,
    isUpdatingProfilePic: false,
    isUpdatingProfile: false,

    ProfileData: async () => {
        set({ isFetchingProfile: true });
        try {
            const res = await axiosInstance.get("/profile/profiledata");
            set({ myProfile: res.data });
            // console.log("Profile Data Loaded:", get().myProfile);
        } catch (error) {
            console.error("Profile Error:", error.response?.data || error);
            set({ myProfile: null });
            toast.error(error.response?.data?.message || "Error fetching profile data");
        } finally {
            set({ isFetchingProfile: false });
        }
    },

    UpdateProfilePic: async (data) => {  // ✅ Accept `data` as an argument
        set({ isUpdatingProfilePic: true });
        try {
            const response = await axiosInstance.post("/profile/updateProfilePic", data);
            if (response.status === 200) {
                await get().ProfileData(); // ✅ Re-fetch profile data after update
                toast.success("Profile picture updated successfully");
            } else {
                toast.error("Error updating profile picture");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating profile picture");
        } finally {
            set({ isUpdatingProfilePic: false });
        }
    },

    UpdateProfile: async (data) => {  // ✅ Accept `data` as an argument
        set({ isUpdatingProfile: true });
        try {
            const response = await axiosInstance.post("/profile/updateProfile", data);
            if (response.status === 200) {
                await get().ProfileData();
                toast.success("Profile updated successfully");
            } else {
                toast.error("Error updating profile");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating profile");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    // AddBalance : async(balance) => {
    //     try{
    //         const response = await axiosInstance.post("/profile/addBalance" , {balance});
    //         if(response.status === 200) {
    //             toast.success(response.data.message);
    //         } else {
    //             toast.error("Unable to add funds");
    //         }
    //     } catch(error) {
    //         toast.error(error.response?.data?.message || "Error in adding funds");
    //     }
    // },

    AddBalance : async(amount) => {
        try{
            const response = await axiosInstance.post("/payment/addBalance" , {amount});
            if(response.status === 200) {
                toast.success(response.data.message);
            } else {
                toast.error("Unable to add funds");
            }
        } catch(error) {
            toast.error(error.response?.data?.message || "Error in adding funds");
        }
    },

    WithdrawBalance : async({balance}) => {
        try{
            const response = await axiosInstance.post("/profile/withdrawBalance" , {balance});
            if(response.status === 200) {
                if(response.data.message === "Insufficient funds for withdrawl!"){
                    toast.error(response.data.message);
                }else {
                    toast.success(response.data.message);
                }
                
            } else {
                toast.error("Unable to withdraw funds");
            }
        } catch(error) {
            toast.error(error.response?.data?.message || "Error in withdrawing funds");
        }
    },
}));
