import { skipToken, useMutation, useQuery } from "@tanstack/react-query"
import { addProvidedDocument, createTravelPlan, getProvidedDocument, getTravelPlans, getTravelPlansByEmployee, getTravelPlansForExpense, manageTravelDocument, manageTravelEmployee, updateTravelPlan } from "../api/TravelPlanApiCall"

export const useGetTravelPlan = () => {
    return useQuery({
        queryKey:['travelPlans'],
        queryFn: getTravelPlans
    });
}

export const useGetTravelPlanByEmployee = (userId:number) => {
    return useQuery({
        queryKey:['travelPlansE', userId],
        queryFn: () => getTravelPlansByEmployee(userId),
        enabled: !!userId
    });
}

export const useGetTravelPlanForExpense = (userId:number) => {
    return useQuery({
        queryKey:['travelPlansEx', userId],
        queryFn: () => getTravelPlansForExpense(userId),
        enabled: !!userId
    });
}

export const useCreateTravelPlan = () =>{
    return useMutation({
        mutationFn: createTravelPlan
    });
}

export const useUpdateTravelPlan = () =>{
    return useMutation({
        mutationFn: updateTravelPlan
    });
}

export const useManageTravelEmployee = () =>{
    return useMutation({
        mutationFn: manageTravelEmployee
    });
}

export const useManageTravelDocument = () => {
    return useMutation({
        mutationFn: manageTravelDocument
    });
}

export const useAddProvidedDocument = () => {
    return useMutation({
        mutationFn: addProvidedDocument
    })
}

export const useGetProvidedDocument = ({travelPlanId, employeeId}:{travelPlanId:number, employeeId:number}) =>{
    return useQuery({
        queryKey: ['Provided', travelPlanId, employeeId],
        queryFn: travelPlanId && employeeId ? () => getProvidedDocument({travelPlanId, employeeId}) : skipToken
    });
}