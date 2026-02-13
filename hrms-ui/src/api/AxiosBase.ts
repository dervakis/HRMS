import axios, { AxiosError } from "axios";

export const employeeApi = axios.create({
    baseURL: 'http://localhost:8080/api/employee',
});

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