import { skipToken, useMutation, useQuery } from "@tanstack/react-query"
import { addGame, addSlot, getGameCycle, getGames, getInterestedGames } from "../api/GameApiCall"
import { use } from "react"

export const useGetGames = () => {
    return useQuery({
        queryKey: ['Games'],
        queryFn: getGames
    })
}

export const useGetInterestedGames = (userId:number) =>{
    return useQuery({
        queryKey: ['Games', userId],
        queryFn: userId ? () => getInterestedGames(userId) : skipToken
    });
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

export const useGetGameCycle = (gameId:number) => {
    return useQuery({
        queryKey: ['GameCycle', gameId],
        queryFn: gameId ? () => getGameCycle(gameId) : skipToken
    });
}