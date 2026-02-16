import type { DocumentType } from "../types/TravelPlan";
import { Api } from "./AxiosBase"

export const getDocumetTypes = async (): Promise<DocumentType[]> => {
    const response = await Api.get('/document-type');
    return response.data.data;
}