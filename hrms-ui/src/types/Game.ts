export interface GameSlotType{
    gameSlotId: number
    slotTime: string
    active: boolean
}
export interface GameType{
    gameId:number
    gameName:string
    durationInMinute:number
    maxPlayer:number
    gameSlots:GameSlotType[]
}
export interface GameCreateType{
    gameName:string
    durationInMinute: number
    maxPlayer: number
    startingTime:string
    endingTime:string
}