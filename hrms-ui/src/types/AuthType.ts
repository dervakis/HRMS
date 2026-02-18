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