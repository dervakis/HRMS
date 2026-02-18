import { useMutation, useQuery } from "@tanstack/react-query"
import { addDocument, getDocumentByUrl, getDocumetTypes, getEmployeeDocument, getTravelDocumentRequest, submitTravelDocument, verifyTravelDocument } from "../api/DocumentApiCall";

export const useGetDocumentTypes = ()=>{
    return useQuery({
        queryKey: ['DocumentTypes'],
        queryFn: getDocumetTypes,
        staleTime: Infinity
    });
}

export const useAddDocument = () => {
    return useMutation({
        mutationFn: addDocument
    });
}
export const useGetEmployeeDocument = (documentId:number) => {
    return useQuery({
        queryKey: ['EmployeeDocument', documentId],
        queryFn: () => getEmployeeDocument(documentId),
        staleTime: Infinity,
        enabled: !!documentId
    });
}

export const useGetDocumentByUrl = (url:string) => {
    return useQuery({
        queryKey: ['Document', url],
        queryFn: () => getDocumentByUrl(url),
        staleTime: Infinity,
        enabled: false
    });
}

export const useGetTravelDocumentRequest = (userId:number) => {
    return useQuery({
        queryKey: ['travelDocument'],
        queryFn: () => getTravelDocumentRequest(userId),
        enabled: !!userId
    });
}
export const useSubmitTravelDocument = () => {
    return useMutation({
        mutationFn: submitTravelDocument
    });
}

export const useVerifyTravelDocument = () => {
    return useMutation({
        mutationFn: verifyTravelDocument
    });
}