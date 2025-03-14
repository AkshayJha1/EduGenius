import axios from 'axios'

export const axiosInstance = axios.create({
    baseURL : "https://edugenius.onrender.com",
    withCredentials : true,
})