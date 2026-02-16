import { useQuery } from "@tanstack/react-query"
import { getDocumetTypes } from "../api/DocumentApiCall";

export const useGetDocumentTypes = ()=>{
    return useQuery({
        queryKey: ['DocumentTypes'],
        queryFn: getDocumetTypes,
        staleTime: Infinity
    });
}