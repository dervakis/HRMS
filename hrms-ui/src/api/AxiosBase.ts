import axios, { AxiosError } from "axios";
import { useSelector } from "react-redux";
import type { RootStateType } from "../redux-store/store";

export const employeeApi = axios.create({
    baseURL: 'http://localhost:8080/api/employee',
});
export const Api = axios.create({
    baseURL: 'http://localhost:8080/api',
});

Api.interceptors.response.use(
    response=>response,
    error=>{
        if(error.response?.data){
            return Promise.reject(error.response.data)
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
// Api.interceptors.request.use((config) => {
//     // const authToken = useSelector((state: RootStateType) => state.user.authToken);
//     // if(authToken){
//     //     config.headers.Authorization = `Bearer ${authToken}`;
//     // }
//     return config;
// });

employeeApi.interceptors.response.use(
    response=>response,
    error=>{
        // console.log();
        if(error.response?.data){
            return Promise.reject(error.response.data)
        }
        return Promise.reject(error);
    }
)