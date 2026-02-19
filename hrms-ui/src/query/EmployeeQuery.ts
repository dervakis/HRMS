import { useMutation, useQuery } from "@tanstack/react-query"
import { getEmployeeDocuments, getEmployees, getOrgChartByEmployee, login, resetPasswordRequest, submitNewPassword } from "../api/EmployeeApiCall"
import { type ApiErrorType, type ApiResponseType } from "../types/ApiResponse"
import { type LoginDetailType, type ResetPasswordDetailType } from "../types/AuthType"
import { updateEmployeeDocument } from "../api/DocumentApiCall"

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
    return useMutation({
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

export const useGetEmployeeDocuments = (userId:number) => {
    return useQuery({
        queryKey: ['EmployeeDocument'],
        queryFn: () => getEmployeeDocuments(userId)
    })
}

export const useUpdateEmployeeDocument = () => {
    return useMutation({
        mutationFn: updateEmployeeDocument
    });
}

export const useGetOrgChartByEmployee = (employeeId:number) =>{
    return useQuery({
        queryKey: ['OrgChart', employeeId],
        queryFn: () => getOrgChartByEmployee(employeeId)
    })
}
