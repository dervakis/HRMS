import type { ApiResponseType } from "../types/ApiResponse";
import type { GameCreateType, GameType } from "../types/Game";
import { Api } from "./AxiosBase";

export const getGames = async() :Promise<GameType[]> => {
    const response = await Api.get('/game');
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