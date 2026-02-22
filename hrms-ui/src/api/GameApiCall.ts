import type { ApiResponseType, PageResponseType } from "../types/ApiResponse";
import type { GameBookingResponseType, GameBookingSubmitType, GameCreateType, GameCycleType, GameType, InterestedEmployeeType, OperationalHourUpdateType } from "../types/Game";
import { Api } from "./AxiosBase";

export const getGames = async (): Promise<GameType[]> => {
    const response = await Api.get('/game');
    return response.data.data
}

export const createGame = async (data: GameCreateType): Promise<ApiResponseType<Object>> => {
    const response = await Api.post(`/game`, data)
    return response.data
}

export const deleteGame = async (gameId: number): Promise<ApiResponseType<Object>> => {
    const response = await Api.delete(`/game/${gameId}`)
    return response.data
}

export const updateOperationalHour = async (data: OperationalHourUpdateType): Promise<ApiResponseType<Object>> => {
    const response = await Api.put(`/game/operation-hour`, data)
    return response.data
}

export const getGameCycle = async (gameId: number): Promise<GameCycleType> => {
    const response = await Api.get(`/game/cycle/${gameId}`);
    return response.data.data;
}

export const getInterestedEmployee = async (gameId: number): Promise<InterestedEmployeeType[]> => {
    const response = await Api.get(`/game/interested-employee/${gameId}`)
    return response.data.data
}

export const getInterestedGame = async (employeeId: number): Promise<GameType[]> => {
    const response = await Api.get(`/game/interest/${employeeId}`)
    return response.data.data
}

export const createGameBooking = async (data: GameBookingSubmitType): Promise<ApiResponseType<Object>> => {
    const response = await Api.post(`/booking`, data)
    return response.data
}

export const cancelBooking = async (bookingId: number): Promise<ApiResponseType<Object>> => {
    const response = await Api.put(`/booking/cancel/${bookingId}`)
    return response.data
}

export const getTodayBookedForGame = async (gameId: number): Promise<GameBookingResponseType[]> => {
    const response = await Api.get(`/booking/today-booked/${gameId}`)
    return response.data.data
}

export const getEmployeeBookingsInCycle = async (gameId: number,employeeId: number): Promise<GameBookingResponseType[]> => {
    const response = await Api.get(`/booking/cycle/${gameId}/${employeeId}`)
    return response.data.data
}

export const getAllEmployeeBookings = async (employeeId: number,page: number,size: number): Promise<PageResponseType<GameBookingResponseType>> => {
    const response = await Api.get(`/booking/employee/${employeeId}?page=${page}&size=${size}`)
    return response.data.data
}
