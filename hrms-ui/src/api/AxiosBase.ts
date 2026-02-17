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
    config.headers.Authorization = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJwYXNzd29yZCI6IiQyYSQxMCRpRlRzakVrM0ZHdllCa3g2S2MySFEuZGpyV2ViSElXeDdobE1CS3N3Ti5XT3Q0QTR6TFJBZSIsInVzZXJuYW1lIjoia2lzaGFuLmRlcnZhbGl5YTI4MjhAZ21haWwuY29tIiwic3ViIjoia2lzaGFuLmRlcnZhbGl5YTI4MjhAZ21haWwuY29tIiwiaWF0IjoxNzcxMzQxNTQwLCJleHAiOjE3NzEzNzc1NDB9.7HpZwk0Q1jrFdnQFmE25sMrNqqW9SaszzZ2cmRzS1bo';
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