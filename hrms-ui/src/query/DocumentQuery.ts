import { useMutation, useQuery } from "@tanstack/react-query"
import { addDocument, getDocumetTypes, getEmployeeDocument } from "../api/DocumentApiCall";

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