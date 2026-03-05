import type { ApiResponseType } from "../types/ApiResponse";
import type { DocumentType, EmployeeTravelDocumentType, TravelDocumentSubmitType } from "../types/TravelPlan";
import { Api } from "./AxiosBase"

export const getDocumetTypes = async (isProvided:boolean): Promise<DocumentType[]> => {
    const response = await Api.get('/document-type', {params: {isProvided:isProvided}});
    return response.data.data;
}

export const addDocumentTypes = async ({name, isProvided}:{name:string, isProvided:boolean}): Promise<ApiResponseType<Object>> => {
    const response = await Api.post(`/document-type/${name}/${isProvided}`);
    return response.data;
}

export const addDocument = async (document:FormData) : Promise<ApiResponseType<Object>> => {
    const response = await Api.post('/document', document, {headers: {'Content-Type': 'multipart/form-data'}});
    return response.data;
}

export const getDocumentByUrl = async(url: string) : Promise<string> =>{
    const response = await Api.get(`/document/url/`, {params : {url:url}});
    console.log(response.data)
    return response.data;
}

export const updateEmployeeDocument = async({documentId, form}:{documentId:number,form:FormData}) : Promise<ApiResponseType<Object>> => {
    const response = await Api.put(`/document/${documentId}`, form, {headers: {'Content-Type': 'multipart/form-data'}});
    return response.data;
}

export const getTravelDocumentRequest = async(userId:number): Promise<EmployeeTravelDocumentType[]> =>{
    const response = await Api.get(`/document/request/${userId}`);
    // console.log(response.data.data);
    return response.data.data;
}

export const submitTravelDocument = async(data:TravelDocumentSubmitType): Promise<ApiResponseType<Object>> => {
    const response = await Api.post('/document/submit', data);
    return response.data;
}

export const reSubmitTravelDocument = async(employeeTravelDocumentId:number): Promise<ApiResponseType<Object>> => {
    const response = await Api.put(`/document/resubmit/${employeeTravelDocumentId}`);
    return response.data;
}

export const verifyTravelDocument = async({docRequestId, status, remark}:{docRequestId:number, status:string, remark:string|null}) : Promise<ApiResponseType<Object>> =>{
    const response = await Api.patch(`/document/verify/${docRequestId}/${status}`, remark, {headers: {'Content-Type': 'text/plain'}});
    return response.data;
}