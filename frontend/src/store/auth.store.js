import { create } from 'zustand'
import { axiosInstance } from '../lib/axios.js'
import { toast } from 'react-hot-toast'

const BASE_URL = 'http://localhost:5000'

export const AuthStore = create( (set , get) => ({
    authUser : null,
    isSigningIn : false,
    isLoggingIn : false,
    isCheckingAuth : true,

    checkAuth : async () => {
      try {
          const res = await axiosInstance.get('/auth/check')
          set({authUser : res.data})
      } catch (error) {
        console.error("Auth Error:", error.response?.data || error);
          set({authUser : null})
      } finally{
          set({isCheckingAuth : false})
      }
    },

    signup: async (data) => {
        set({ isSigningIn: true });
        try {
          const res = await axiosInstance.post("/auth/signUp", data);
          set({ authUser: res.data });
          // localStorage.setItem('authUser',true)
          toast.success("Account created successfully");
          console.log("User signed up:", get().authUser);
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          set({ isSigningIn: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
          const res = await axiosInstance.post("/auth/login", data);
          set({ authUser: res.data });
          toast.success("Logged in successfully");
          console.log("User logged In:", get().authUser);
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          set({ isLoggingIn: false });
        }
      },

      logout: async () => {
        try {
          await axiosInstance.post("/auth/logout");
          set({ authUser: null });
          toast.success("Logged out successfully");
        } catch (error) {
          toast.error(error.response.data.message);
        }
      },
}))