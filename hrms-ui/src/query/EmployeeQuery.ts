import { useMutation, useQuery } from "@tanstack/react-query"
import { createDepartment, createEmployee, createRole, deleteDepartment, deleteEmployee, deleteRole, getDepartments, getEmployeeDocuments, getEmployees, getEmployeesPage, getNotification, getOrgChartByEmployee, getRoles, login, markNotificationAsRead, resetPasswordRequest, submitNewPassword, updateDepartment, updateEmployee, updateRole, type GetEmployeeParams } from "../api/EmployeeApiCall"
import { type ApiErrorType, type ApiResponseType } from "../types/ApiResponse"
import { updateEmployeeDocument } from "../api/DocumentApiCall"
import type { EmployeeRequestType } from "../types/CommonType"

export const useResetPasswordRequest = () => {
    return useMutation<ApiResponseType<Object>, ApiErrorType, (string)>({
        mutationFn: resetPasswordRequest
    })
}

export const useSubmitNewPassword = () => {
    return useMutation<ApiResponseType<Object>, ApiErrorType, ({ email: string, token: string, newPassword: string })>({
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

export const useGetEmployeeDocuments = (userId: number) => {
    return useQuery({
        queryKey: ['EmployeeDocument', userId],
        queryFn: () => getEmployeeDocuments(userId),
        staleTime: Infinity
    })
}

export const useUpdateEmployeeDocument = () => {
    return useMutation({
        mutationFn: updateEmployeeDocument
    });
}

export const useGetOrgChartByEmployee = (employeeId: number) => {
    return useQuery({
        queryKey: ['OrgChart', employeeId],
        queryFn: () => getOrgChartByEmployee(employeeId),
        staleTime: 2*60*60*1000
    })
}

export const useGetRoles = () => {
    return useQuery({
        queryKey: ['Roles'],
        queryFn: () => getRoles()
    })
}

export const useGetDepartments = () => {
    return useQuery({
        queryKey: ['Departments'],
        queryFn: () => getDepartments()
    })
}

export const useGetNotification = () => {
    return useQuery({
        queryKey: ['Notification'],
        queryFn: () => getNotification()
    })
}

export const useMarkNotificationAsRead = () => {
    return useMutation({
        mutationFn: markNotificationAsRead
    })
}

export const useGetEmployeesPage = (params: GetEmployeeParams) => {
    return useQuery({
        queryKey: ['Employees', params],
        queryFn: () => getEmployeesPage(params),
    })
}

export const useCreateEmployee = () => {
    return useMutation({
        mutationFn: createEmployee
    })
}

export const useUpdateEmployee = () => {
    return useMutation({
        mutationFn: ({ employeeId, data }: { employeeId: number, data: EmployeeRequestType }) => updateEmployee(employeeId, data)
    })
}

export const useDeleteEmployee = () => {
    return useMutation({
        mutationFn: deleteEmployee
    })
}

export const useCreateDepartment = () => {
    return useMutation({
        mutationFn: createDepartment
    })
}

export const useUpdateDepartment = () => {
    return useMutation({
        mutationFn: ({ departmentId, departmentName }: { departmentId: number, departmentName: string }) => updateDepartment(departmentId, departmentName)
    })
}

export const useDeleteDepartment = () => {
    return useMutation({
        mutationFn: deleteDepartment
    })
}

export const useCreateRole = () => {
    return useMutation({
        mutationFn: createRole
    })
}

export const useUpdateRole = () => {
    return useMutation({
        mutationFn: ({ roleId, roleName }: { roleId: number, roleName: string }) => updateRole(roleId, roleName)
    })
}

export const useDeleteRole = () => {
    return useMutation({
        mutationFn: deleteRole
    })
}