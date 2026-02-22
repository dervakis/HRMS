import { skipToken, useMutation, useQuery } from "@tanstack/react-query"
import { cancelBooking, createGame, createGameBooking, deleteGame, getAllEmployeeBookings, getEmployeeBookingsInCycle, getGameCycle, getGames, getInterestedEmployee, getInterestedGame, getTodayBookedForGame, updateOperationalHour } from "../api/GameApiCall"
import { use } from "react"

export const useGetGames = () => {
    return useQuery({
        queryKey: ['Games'],
        queryFn: getGames
    })
}

export const useCreateGame = () => {
    return useMutation({
        mutationFn: createGame
    })
}

export const useDeleteGame = () => {
    return useMutation({
        mutationFn: deleteGame
    })
}

export const useUpdateOperationalHour = () => {
    return useMutation({
        mutationFn: updateOperationalHour
    })
}

export const useGetGameCycle = (gameId:number) => {
    return useQuery({
        queryKey: ['GameCycle', gameId],
        queryFn: gameId ? () => getGameCycle(gameId) : skipToken
    });
}

export const useGetInterestedEmployee = (gameId: number) => {
    return useQuery({
        queryKey: ["interestedEmployee", gameId],
        queryFn: gameId ? () => getInterestedEmployee(gameId) : skipToken,
    })
}

export const useGetInterestedGame = (employeeId: number) => {
    return useQuery({
        queryKey: ["interestedGame", employeeId],
        queryFn: () => getInterestedGame(employeeId),
        enabled: !!employeeId
    })
}

export const useCreateGameBooking = () => {
    return useMutation({
        mutationFn: createGameBooking
    })
}

export const useCancelBooking = () => {
    return useMutation({
        mutationFn: cancelBooking
    })
}

export const useGetTodayBookedForGame = (gameId: number) => {
    return useQuery({
        queryKey: ["todayBooked", gameId],
        queryFn: gameId ? () => getTodayBookedForGame(gameId) : skipToken,
    })
}

export const useGetEmployeeBookingsInCycle = (gameId: number,employeeId: number) => {
    return useQuery({
        queryKey: ["cycleBookings", gameId, employeeId],
        queryFn: gameId && employeeId ? () => getEmployeeBookingsInCycle(gameId, employeeId) : skipToken,
    })
}

export const useGetAllEmployeeBookings = (employeeId: number, page: number,size: number) => {
    return useQuery({
        queryKey: ["employeeBookings", employeeId, page, size],
        queryFn: employeeId ? () => getAllEmployeeBookings(employeeId, page, size) : skipToken,
    })
}