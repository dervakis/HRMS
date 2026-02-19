export interface LoginDetailType {
    email:string,
    password:string
}

export interface LoginResponseType{
    authToken: string
    role: string
    fullName: string
    email: string
    userId: number
}

export interface ResetPasswordDetailType{
    email:string,
    password:string,
    confirmPassword:string
}

export interface EmployeeDetailType{
    employeeId: number
    firstName:string
    lastName: string
    email: string
    dateOfBirth: Date
    joiningDate: Date
    managerId: number
    departmentId: number
    departmentName: string
    roleId: number
    roleName: string
    childEmployee?: EmployeeDetailType[]
}