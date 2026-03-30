import { skipToken, useMutation, useQuery } from "@tanstack/react-query"
import { addInterest, cancelBooking, createGame, createGameBooking, deleteGame, getAllEmployeeBookings, getBookingForDate, getEmployeeBookingsInCycle, getGameCycle, getGames, getInterestedEmployee, getInterestedGame, getTodayBookedForGame, removeInterest, updateGame } from "../api/GameApiCall"

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

export const useUpdateGame = () => {
    return useMutation({
        mutationFn: updateGame
    })
}

export const useGetGameCycle = (gameId: number) => {
    return useQuery({
        queryKey: ['GameCycle', gameId],
        queryFn: gameId ? () => getGameCycle(gameId) : skipToken,
        staleTime: Infinity
    });
}

export const useGetInterestedEmployee = (gameId: number) => {
    return useQuery({
        queryKey: ["interestedEmployee", gameId],
        queryFn: gameId ? () => getInterestedEmployee(gameId) : skipToken,
    })
}

export const useAddInterest = () => {
    return useMutation({
        mutationFn: addInterest
    })
}

export const useRemoveInterest = () => {
    return useMutation({
        mutationFn: removeInterest
    })
}

export const useGetInterestedGame = (employeeId: number) => {
    return useQuery({
        queryKey: ["interestedGame", employeeId],
        queryFn: () => getInterestedGame(employeeId),
        enabled: !!employeeId,
        staleTime: Infinity
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

export const useGetBookingForDate = () => {
    return useMutation({
        mutationFn: getBookingForDate
    })
}

export const useGetEmployeeBookingsInCycle = (gameId: number, employeeId: number) => {
    return useQuery({
        queryKey: ["cycleBookings", gameId, employeeId],
        queryFn: gameId && employeeId ? () => getEmployeeBookingsInCycle(gameId, employeeId) : skipToken,
    })
}

export const useGetAllEmployeeBookings = (employeeId: number, page: number, size: number) => {
    return useQuery({
        queryKey: ["employeeBookings", employeeId, page, size],
        queryFn: () => getAllEmployeeBookings(employeeId, page, size),
    })
}