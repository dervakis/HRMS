import type { ApiResponseType } from "../types/ApiResponse";
import type { LoginDetailType } from "../types/AuthType";
import { employeeApi } from "./AxiosBase"

export const resetPasswordRequest = async (email:string):Promise<ApiResponseType<Object>> =>{
    const response = await employeeApi.get(`/forget-password/${email}`);
    return response.data;
}

export const submitNewPassword = async ({email, token, newPassword}:{email:string, token: string, newPassword:string}): Promise<ApiResponseType<Object>> =>{
    console.log(email, token, newPassword);
    const response = await employeeApi.post(`/forget-password/${email}`, {token, newPassword});
    return response.data;
}

export const login = async (creadential:LoginDetailType) =>{
    const response = await employeeApi.get(`/login`, {params: {email: creadential.email, password:creadential.password}});
    //set token from here direct not there
    return response.data;
}

