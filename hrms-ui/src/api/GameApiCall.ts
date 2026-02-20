import type { ApiResponseType } from "../types/ApiResponse";
import type { GameCreateType, GameCycleType, GameType } from "../types/Game";
import { Api } from "./AxiosBase";

export const getGames = async() :Promise<GameType[]> => {
    const response = await Api.get('/game');
    return response.data.data
}
export const getInterestedGames = async(userId:number) :Promise<GameType[]> => {
    const response = await Api.get(`/game/interest/${userId}`);
    return response.data.data
}
export const addGame = async(game:GameCreateType): Promise<ApiResponseType<Object>> => {
    const response = await Api.post('/game', game);
    return response.data;
}
export const addSlot = async({gameId, slotStart}:{gameId:number, slotStart:string}): Promise<ApiResponseType<Object>> => {
    // console.log(game, slotStart)
    const response = await Api.post('/game/slot', {gameId, slotStart});
    return response.data;
}
export const getGameCycle = async(gameId:number):Promise<GameCycleType> => {
    const response = await Api.get(`/game/cycle/${gameId}`);
    return response.data.data;
}