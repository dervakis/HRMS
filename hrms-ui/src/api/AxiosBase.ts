import axios from "axios";

export const Api = axios.create({
    baseURL: import.meta.env.VITE_API_URL+'/api',
});

Api.interceptors.response.use(
    response=>response,
    error=>{
        if(error.response?.data ){
            return Promise.reject(error.response.data)
        }
        // console.log(error.response.status)
        if(error.response?.status == 403){
            localStorage.removeItem('authToken');
            window.location.href = '/login'
        }
        return Promise.reject(error);
    }
)
Api.interceptors.request.use((config) => {
    const authToken = localStorage.getItem('authToken');
    if(authToken)
        config.headers.Authorization = 'Bearer '+authToken;
    return config;
})