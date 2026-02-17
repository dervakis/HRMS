import { useMutation, useQuery } from "@tanstack/react-query"
import { addDocument, getDocumetTypes, getEmployeeDocument, getTravelDocumentRequest, submitTravelDocument, verifyTravelDocument } from "../api/DocumentApiCall";

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

export const useGetTravelDocumentRequest = (userId:number) => {
    return useQuery({
        queryKey: ['travelDocument'],
        queryFn: () => getTravelDocumentRequest(userId)
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