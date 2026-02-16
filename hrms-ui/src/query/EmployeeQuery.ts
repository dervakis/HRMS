import { useMutation, useQuery } from "@tanstack/react-query"
import { getEmployees, login, resetPasswordRequest, submitNewPassword } from "../api/EmployeeApiCall"
import { type ApiErrorType, type ApiResponseType } from "../types/ApiResponse"
import { type LoginDetailType, type ResetPasswordDetailType } from "../types/AuthType"

export const useResetPasswordRequest = ()=>{
    return useMutation<ApiResponseType<Object>, ApiErrorType, (string)>({
        mutationFn: resetPasswordRequest
    })
}

export const useSubmitNewPassword = () => {
    return useMutation<ApiResponseType<Object>, ApiErrorType, ({email:string, token: string, newPassword:string})>({
        mutationFn: submitNewPassword
    });
}

export const useLogin = () => {
    return useMutation<ApiResponseType<{token: string}>, ApiErrorType, LoginDetailType>({
        mutationFn: login
    });
}

export const useGetEmployees = () => {
    return useQuery({
        queryKey: ['Employees'],
        queryFn: getEmployees,
        staleTime: Infinity
    });
}
