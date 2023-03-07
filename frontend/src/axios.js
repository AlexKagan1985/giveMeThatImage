import axios from "axios";

const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND ?? "http://localhost:3001"
});

export default instance;