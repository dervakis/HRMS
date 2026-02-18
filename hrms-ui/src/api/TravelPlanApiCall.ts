import type { ApiResponseType } from "../types/ApiResponse";
import type { TravelPlanCreate, TravelPlanType } from "../types/TravelPlan";
import { Api } from "./AxiosBase"

export const getTravelPlans = async () : Promise<TravelPlanType[]> => {
    const response = await Api.get(`/travel-plan`);
    console.log('api is called');
    return response.data.data;
}
export const getTravelPlansByEmployee = async (userId:number) : Promise<TravelPlanType[]> => {
    const response = await Api.get(`/travel-plan/employee/${userId}`);
    return response.data.data;
}

export const getTravelPlansForExpense = async (userId:number) : Promise<TravelPlanType[]> => {
    const response = await Api.get(`/travel-plan/running/${userId}`);
    return response.data.data;
}

export const createTravelPlan = async(travelplan:TravelPlanCreate) : Promise<ApiResponseType<Object>> => {
    const response = await Api.post(`/travel-plan`, travelplan);
    return response.data;
}

export const updateTravelPlan = async(travelplan:TravelPlanCreate) : Promise<ApiResponseType<Object>> => {
    const response = await Api.put(`/travel-plan`, travelplan);
    return response.data;
}

export const manageTravelEmployee = async ({travelPlanId, employeeIds}:{travelPlanId: number,employeeIds: number[]}) : Promise<ApiResponseType<Object>> =>{
    const response = await Api.post('/travel-plan/employee', {travelPlanId, employeeIds});
    return response.data;
}

export const manageTravelDocument = async ({travelPlanId, documentTypeIds}:{travelPlanId: number,documentTypeIds: number[]}): Promise<ApiResponseType<Object>> =>{
    const response = await Api.post('/travel-plan/employee-document', {travelPlanId, documentTypeIds});
    return response.data;
}