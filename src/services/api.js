import axios from 'axios';

const api = axios.create({
    baseURL: "https://anonymous-wall-0c87.onrender.com/" 
});

export default api;