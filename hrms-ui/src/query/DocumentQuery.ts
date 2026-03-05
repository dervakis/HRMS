import { skipToken, useMutation, useQuery } from "@tanstack/react-query"
import { addDocument, addDocumentTypes, getDocumentByUrl, getDocumetTypes, getTravelDocumentRequest, reSubmitTravelDocument, submitTravelDocument, verifyTravelDocument } from "../api/DocumentApiCall";

export const useGetDocumentTypes = (isProvided:boolean)=>{
    return useQuery({
        queryKey: ['DocumentTypes', isProvided],
        queryFn: () => getDocumetTypes(isProvided),
        staleTime: Infinity
    });
}

export const useAddDocumentTypes = () => {
    return useMutation({
        mutationFn: addDocumentTypes
    });
}

export const useAddDocument = () => {
    return useMutation({
        mutationFn: addDocument
    });
}

export const useGetDocumentByUrl = () => {
    return useMutation({
        mutationFn: getDocumentByUrl
    })
}

export const useGetTravelDocumentRequest = (userId:number) => {
    return useQuery({
        queryKey: ['travelDocument', userId],
        queryFn: userId ? () => getTravelDocumentRequest(userId) : skipToken,
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

export const useReSubmitTravelDocument = () => {
    return useMutation({
        mutationFn: reSubmitTravelDocument
    });
}