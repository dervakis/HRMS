export interface LoginDetailType {
    email: string,
    password: string
}

export interface LoginResponseType {
    authToken: string
    role: string
    fullName: string
    email: string
    userId: number
}

export interface ResetPasswordDetailType {
    email: string,
    password: string,
    confirmPassword: string
}

export interface EmployeeDetailType {
    employeeId: number
    firstName: string
    lastName: string
    email: string
    dateOfBirth: Date
    joiningDate: Date
    managerId: number
    managerFirstName: string
    managerLastName: string
    departmentId: number
    departmentName: string
    roleId: number
    roleName: string
    childEmployee?: EmployeeDetailType[]
}

export interface RoleType {
    roleId: number
    roleName: string
}

export interface DepartmentType {
    departmentId: number
    departmentName: string
}

export interface NotificationType {
    notificationId: number
    notificationType: string
    message: string
    createdAt: string
}

export interface EmployeeRequestType {
    firstName: string
    lastName: string
    email: string
    password?: string
    dateOfBirth: string
    joiningDate: string
    departmentId?: number
    roleId?: number
    managerId?: number
}

