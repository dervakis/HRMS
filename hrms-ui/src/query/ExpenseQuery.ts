import { useMutation, useQuery } from "@tanstack/react-query"
import { createTravelExpense, getExpenseByEmployee, getExpenseByTravelPlan, getExpenseType, submitTravelExpense, verifyTravelExpense } from "../api/ExpenseApiCall"

export const useGetExpenseByEmployee = (userId:number) => {
    return useQuery({
        queryKey: ['ExpenseE', userId],
        queryFn: () => getExpenseByEmployee(userId)
    })
}

export const useGetExpenseByTravelPlan = (travelPlanId:number) => {
    return useQuery({
        queryKey: ['ExpenseT', travelPlanId],
        queryFn: () => getExpenseByTravelPlan(travelPlanId)
    })
}

export const useGetExpenseType = () => {
    return useQuery({
        queryKey: ['ExpenseType'],
        queryFn: getExpenseType
    })
}

export const useCreateTravelExpense = () => {
    return useMutation({
        mutationFn: createTravelExpense
    });
}

export const useSubmitTravelExpense = () => {
    return useMutation({
        mutationFn: submitTravelExpense
    });
}

export const useVerifyTravelExpense = () => {
    return useMutation({
        mutationFn: verifyTravelExpense
    });
}