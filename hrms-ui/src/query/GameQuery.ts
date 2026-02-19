import { useMutation, useQuery } from "@tanstack/react-query"
import { addGame, addSlot, getGames } from "../api/GameApiCall"

export const useGetGames = () => {
    return useQuery({
        queryKey: ['Games'],
        queryFn: getGames
    })
}

export const useAddGame = () => {
    return useMutation({
        mutationFn: addGame
    });
}

export const useAddSlot = () => {
    return useMutation({
        mutationFn: addSlot
    });
}