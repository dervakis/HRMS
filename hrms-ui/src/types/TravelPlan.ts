export interface TravelPlanType{
    travelPlanId: number
    title: string
    description: string
    startTime:string
    endTime: string
    createdBy: TravelEmployeeType
    travelEmployees : TravelEmployeeType[]
    documentTypes : DocumentType[]
}
export interface TravelEmployeeType{
    employeeId: number
    firstName: string
    lastName: string
    email: string
}
export interface TravelPlanCreate{
    travelPlanId?: number
    title: string
    description: string
    startTime:string
    endTime: string
}
export interface DocumentType{
    documentTypeId : number
    documentTypeName: string
}

export interface DocumentSubmitType{
    employeeDocumentId? : number
    documentTypeId: number
    fileList:FileList
}

export interface EmployeeDocumentType{
    employeeDocumentId : number
    documentUrl : string
    uploadedAt : Date
    documentTypeId : number
    documentTypeName : string
}
