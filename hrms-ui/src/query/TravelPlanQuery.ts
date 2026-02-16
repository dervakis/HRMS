import { useMutation, useQuery } from "@tanstack/react-query"
import { createTravelPlan, getTravelPlans, manageTravelDocument, manageTravelEmployee, updateTravelPlan } from "../api/TravelPlanApiCall"

export const useGetTravelPlan = () => {
    return useQuery({
        queryKey:['travelPlans'],
        queryFn: getTravelPlans
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