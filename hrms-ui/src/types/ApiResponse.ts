export interface ApiResponseType<T> {
    message: string
    data: T
}

export interface ApiErrorType{
    status: number
    timestamp: string
    message: string
    details: string[] | null
}