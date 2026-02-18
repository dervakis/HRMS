import { useMutation, useQuery } from "@tanstack/react-query"
import { createTravelPlan, getTravelPlans, getTravelPlansByEmployee, getTravelPlansForExpense, manageTravelDocument, manageTravelEmployee, updateTravelPlan } from "../api/TravelPlanApiCall"

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