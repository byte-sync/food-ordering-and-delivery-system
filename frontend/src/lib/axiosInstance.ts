import axios from "axios"

const axiosInstance = axios.create({
    baseURL: import.meta.env.BASE_URL,
    timeout: 1000,
    headers: { "Content-Type": "application/json" }
})


export default axiosInstance