import type { TravelEmployeeType } from "./TravelPlan"

export interface GameType{
    gameId:number
    gameName:string
    durationInMinute:number
    maxPlayer:number
    startTime: string
    endTime: string
}
export interface GameCreateType{
    gameName:string
    durationInMinute: number
    maxPlayer: number
    startingTime:string
    endingTime:string
}
export interface GameCycleType{
    gameCycleId: number
    startDate: string
    endDate: string
}

export interface OperationalHourUpdateType {
    gameId: number
    start: string
    end: string
}

export interface InterestedEmployeeType {
    employeeInterestId: number
    slotPlayed: number
    employee: TravelEmployeeType
}

export interface GameBookingSubmitType {
    Game: number
    bookingDate: string
    bookingTime: string
    bookedBy: number
    players: number[]
    gameCycle: number
}

export interface GameBookingResponseType {
    gameBookingId: number
    bookingDate: string
    bookingTime: string
    bookingStatus: string
    createdAt: string
    bookedBy: TravelEmployeeType
    game: GameType
    players: TravelEmployeeType[]
    gameCycleGameCycleId: number
}
