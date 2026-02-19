import type EmployeeDocument from "../pages/EmployeeDocument";
import type { ApiResponseType } from "../types/ApiResponse";
import type { EmployeeDetailType, LoginDetailType, LoginResponseType } from "../types/AuthType";
import type { EmployeeDocumentType, TravelEmployeeType } from "../types/TravelPlan";
import { Api, employeeApi } from "./AxiosBase"

export const resetPasswordRequest = async (email:string):Promise<ApiResponseType<Object>> =>{
    const response = await employeeApi.get(`/forget-password/${email}`);
    return response.data;
}

export const submitNewPassword = async ({email, token, newPassword}:{email:string, token: string, newPassword:string}): Promise<ApiResponseType<Object>> =>{
    console.log(email, token, newPassword);
    const response = await employeeApi.post(`/forget-password/${email}`, {token, newPassword});
    return response.data;
}

export const login = async (creadential:LoginDetailType) :Promise<LoginResponseType> =>{
    const response = await employeeApi.get(`/login`, {params: {email: creadential.email, password:creadential.password}});
    return response.data.data;
}

export const getEmployees = async (): Promise<TravelEmployeeType[]> => {
    const response = await Api.get(`/employee`);
    return response.data.data;
}

export const getEmployeeDocuments = async(userId:number) : Promise<EmployeeDocumentType[]> => {
    const response = await Api.get(`/employee/documents/${userId}`);
    return response.data.data;
}

export const getOrgChartByEmployee = async(employeeId:number): Promise<EmployeeDetailType> => {
    const response = await Api.get(`/employee/chart/${employeeId}`);
    // console.log(response)
    return response.data.data
}
