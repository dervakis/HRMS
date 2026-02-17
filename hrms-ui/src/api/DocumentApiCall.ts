import type { ApiResponseType } from "../types/ApiResponse";
import type { DocumentSubmitType, DocumentType, EmployeeTravelDocumentType, TravelDocumentSubmitType } from "../types/TravelPlan";
import { Api } from "./AxiosBase"

export const getDocumetTypes = async (): Promise<DocumentType[]> => {
    const response = await Api.get('/document-type');
    return response.data.data;
}

export const addDocument = async (document:FormData) : Promise<ApiResponseType<Object>> => {
    const response = await Api.post('/document', document, {headers: {'Content-Type': 'multipart/form-data'}});
    return response.data;
}

export const getEmployeeDocument = async(documentId: number) : Promise<Blob> =>{
    const response = await Api.get(`/document/${documentId}`, {responseType : 'blob'});
    return response.data;
}

export const updateEmployeeDocument = async({documentId, form}:{documentId:number,form:FormData}) : Promise<ApiResponseType<Object>> => {
    const response = await Api.put(`/document/${documentId}`, form, {headers: {'Content-Type': 'multipart/form-data'}});
    return response.data;
}

export const getTravelDocumentRequest = async(userId:number): Promise<EmployeeTravelDocumentType[]> =>{
    const response = await Api.get(`/document/request/${userId}`);
    console.log(response.data.data);
    return response.data.data;
}

export const submitTravelDocument = async(data:TravelDocumentSubmitType): Promise<ApiResponseType<Object>> => {
    const response = await Api.post('/document/submit', data);
    return response.data;
}

export const verifyTravelDocument = async({docRequestId, status}:{docRequestId:number, status:string}) : Promise<ApiResponseType<Object>> =>{
    const response = await Api.patch(`/document/verify/${docRequestId}/${status}`);
    return response.data;
}