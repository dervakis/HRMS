import { useQuery } from "@tanstack/react-query"
import { login, resetPasswordRequest, submitNewPassword } from "../api/EmployeeApiCall"

export const useResetPasswordRequest = (email:string)=>{
    return useQuery({
        queryKey: [email],
        queryFn: () => resetPasswordRequest(email),
        enabled: false
    })
}

export const useSubmitNewPassword = (email:string, token:string, password:string) => {
    return useQuery({
        queryKey: [email],
        queryFn: () => submitNewPassword(email, token, password),
        enabled: false
    });
}

export const useLogin = (email: string, password: string) => {
    return useQuery({
        queryKey: [email, password],
        queryFn: () => login(email, password),
        enabled: false
    })
}
