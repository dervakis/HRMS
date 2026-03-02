import type { PaginatedResponse } from "../types/AchievementType";
import type { ApiResponseType, PageResponseType } from "../types/ApiResponse";
import type { DepartmentType, EmployeeDetailType, EmployeeRequestType, LoginDetailType, LoginResponseType, NotificationType, RoleType } from "../types/CommonType";
import type { EmployeeDocumentType, TravelEmployeeType } from "../types/TravelPlan";
import { Api } from "./AxiosBase"

export const resetPasswordRequest = async (email: string): Promise<ApiResponseType<Object>> => {
    const response = await Api.get(`employee/forget-password/${email}`);
    return response.data;
}

export const submitNewPassword = async ({ email, token, newPassword }: { email: string, token: string, newPassword: string }): Promise<ApiResponseType<Object>> => {
    console.log(email, token, newPassword);
    const response = await Api.post(`employee/forget-password/${email}`, { token, newPassword });
    return response.data;
}

export const login = async (creadential: LoginDetailType): Promise<LoginResponseType> => {
    const response = await Api.get(`employee/login`, { params: { email: creadential.email, password: creadential.password } });
    return response.data.data;
}

export const getEmployees = async (): Promise<TravelEmployeeType[]> => {
    const response = await Api.get(`/employee`);
    return response.data.data;
}

export const getEmployeeDocuments = async (userId: number): Promise<EmployeeDocumentType[]> => {
    const response = await Api.get(`/employee/documents/${userId}`);
    return response.data.data;
}

export const getOrgChartByEmployee = async (employeeId: number): Promise<EmployeeDetailType> => {
    const response = await Api.get(`/employee/chart/${employeeId}`);
    return response.data.data
}

export const getRoles = async (): Promise<RoleType[]> => {
    const response = await Api.get(`/role`);
    return response.data.data;
}

export const getDepartments = async (): Promise<DepartmentType[]> => {
    const response = await Api.get(`/department`);
    return response.data.data;
}

export const getNotification = async (): Promise<NotificationType[]> => {
    const response = await Api.get('/notification');
    return response.data.data;
}

export const markNotificationAsRead = async (notificationId: number): Promise<void> => {
    await Api.put(`/notification/${notificationId}`);
}

export interface GetEmployeeParams {
    page?: number
    size?: number
    departmentId?: number
    roleId?: number
}

export const getEmployeesPage = async (params: GetEmployeeParams): Promise<PaginatedResponse<EmployeeDetailType>> => {
    const response = await Api.get(`/employee/page`, { params })
    return response.data
}

export const createEmployee = async (data: EmployeeRequestType): Promise<void> => {
    await Api.post('/employee', data)
}

export const updateEmployee = async (employeeId: number, data: EmployeeRequestType): Promise<void> => {
    await Api.put(`/employee/${employeeId}`, data)
}

export const deleteEmployee = async (employeeId: number): Promise<void> => {
    await Api.delete(`/employee/${employeeId}`)
}

export const createDepartment = async (departmentName: string): Promise<DepartmentType> => {
    const response = await Api.post(`/department/${departmentName}`)
    return response.data
}

export const updateDepartment = async (departmentId: number, departmentName: string): Promise<DepartmentType> => {
    const response = await Api.put(`/department/${departmentId}`, null, { params: { name: departmentName } })
    return response.data
}

export const deleteDepartment = async (departmentId: number): Promise<void> => {
    await Api.delete(`/department/${departmentId}`)
}

export const createRole = async (roleName: string): Promise<RoleType> => {
    const response = await Api.post(`/role/${roleName}`)
    return response.data
}

export const updateRole = async (roleId: number, roleName: string): Promise<RoleType> => {
    const response = await Api.put(`/role/${roleId}`, null, { params: { name: roleName } })
    return response.data
}

export const deleteRole = async (roleId: number): Promise<void> => {
    await Api.delete(`/role/${roleId}`)
}
