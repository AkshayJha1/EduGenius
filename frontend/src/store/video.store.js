import { create } from 'zustand'
import { axiosInstance } from '../lib/axios.js'
import { toast } from 'react-hot-toast'


export const VideoStore = create( (set , get) => ({
    loadingThumbnails : true,
    loadingVideo : true,
    loadingYourCourses : true,
    loadingCourseBuyied : true,
    purchasingCourse : false,
    uploadingVideo : false,
    courses : [],
    yourCourses : [],
    courseBuyied : [],
    specificVideo : {},
    
    GetCourses : async() => {
        try {
            const res = await axiosInstance.get('/videos/get-thumbnails');
            set({courses : res.data.allVideos});
        } catch (error) {
            toast.error(error.response.data.message);
            
        }finally {
           set({ loadingThumbnails : false});
        }
    },

    GetVideo: async (url) => {
        try {
            const res = await axiosInstance.get(`/videos/getVideo/${encodeURIComponent(url)}`);
            set({ specificVideo: res.data });
        } catch (error) {
            console.error("Error fetching video:", error?.response?.data?.message || error.message);
            toast.error(error?.response?.data?.message || "Failed to load video.");
            set({ specificVideo: {} });
            console.log("API error Response:", get().specificVideo);
        } finally {
            set({ loadingVideo: false });
        }
    },

    GetYourCourse : async() => {
        try {
            const res = await axiosInstance.get('/videos/get-yourCourseVideos');
            set({yourCourses : res.data.yourCourse});
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ loadingYourCourses : false});
        }
    },

    GetCourseBuyied : async() => {
        try {
            const res = await axiosInstance.get('/videos/get-coursesBuyiedVideos');
            set({courseBuyied : res.data.coursesBuyied});
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ loadingCourseBuyied : false});
        }
    },

    UploadVideo : async(formData) => {
        set({ uploadingVideo : true});
        try {
            const res = await axiosInstance.post('/videos/upload-video' , formData , {
                headers: {
                  "Content-Type": "multipart/form-data",
            }});
            if(res.status === 200) toast.success("Video Uploaded successfully");
            toast.error("Error in uploading video");
            
        } catch (error) {
            console.error("Error Response:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Something went wrong!");
        } finally {
            set({ uploadingVideo : false});
        }
    },

    PurchaseCourse: async (url) => {
        set({ purchasingCourse: true });
        try {    
            const res = await axiosInstance.post(`/videos/buyVideo/${encodeURIComponent(url)}`);
            toast.success(res.data.message);

            await get().GetCourseBuyied();

            // set((state) => ({ courseBuyied: [...state.courseBuyied] })); 
        } catch (error) {
            console.error("Error Response:", error.response?.data || error.message);
            if (error.response?.data?.error === "Insufficient wallet balance") {
                toast.error("Insufficient balance! Please add more funds.");
            } else {
                toast.error(error.response?.data?.message || "Something went wrong!");
            }
        } finally {
            set({ purchasingCourse: false });
        }
    },
    
    StripePurchaseCourse : async({price , videoUrl}) => {
        set({ purchasingCourse: true });
        try {
            const response = await axiosInstance.post('/payment/checkOut', {price , videoUrl});
            return response.data.url;
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong!");
        } finally {
            set({ purchasingCourse: false });
        }
    }
    
}))