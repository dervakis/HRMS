import { employeeApi } from "./AxiosBase"

export const resetPasswordRequest = async (email:string):Promise<string> =>{
    const response = await employeeApi.get(`/forget-password/${email}`);
    console.log(response.status);
    console.log(response);
    return response.data.message;
}

export const submitNewPassword = async (email:string, token:string, password:string): Promise<string> =>{
    const response = await employeeApi.post(`/forget-password/${email}`, {token:token, newPassword:password});
    return response.data.message;
}

export const login = async (email:string, password:string): Promise<string> =>{
    const response = await employeeApi.get(`/login?email=${email}&password=${password}`);
    console.log(response.data);
    console.log(response.data.data.token)
    //ahi thi direct token set
    return response.data.message;
}

