import type { ApiResponseType } from "../types/ApiResponse";
import type { TravelExpenseResponseType, TravelExpenseSubmitType, TravelExpenseType } from "../types/TravelPlan";
import { Api } from "./AxiosBase";

export const getExpenseByEmployee = async(userId:number): Promise<TravelExpenseResponseType[]> => {
    const response = await Api.get(`/expense/${userId}`);
    return response.data.data;
}

export const getExpenseByTravelPlan = async(travelPlanId:number): Promise<TravelExpenseResponseType[]> => {
    const response = await Api.get(`/expense/travel-plan/${travelPlanId}`);
    return response.data.data;
}

export const getExpenseType = async(): Promise<TravelExpenseType[]> => {
    const response = await Api.get(`/expense/type`);
    return response.data.data;
}

export const createTravelExpense = async(form: FormData): Promise<ApiResponseType<Object>> => {
    const response = await Api.post(`/expense`, form, {headers: {'Content-Type': 'multipart/form-data'}});
    return response.data;
}

export const submitTravelExpense = async(expenseId:number):Promise<ApiResponseType<Object>> => {
    const response = await Api.patch(`/expense/submit/${expenseId}`);
    return response.data;
}

export const verifyTravelExpense = async({expenseId, status}:{expenseId:number, status:string}) :Promise<ApiResponseType<Object>>  => {
    const response = await Api.patch(`/expense/verify/${expenseId}/${status}`);
    return response.data;
}