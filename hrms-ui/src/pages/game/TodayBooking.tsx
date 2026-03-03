import React, { useState } from "react";
import { useGetGames, useGetTodayBookedForGame } from "../../query/GameQuery";
import { Calendar, Clock, Users } from "lucide-react";
import { Badge, Card, Select, Spinner } from "flowbite-react";
import SelectOption from "../../common/SelectOption";
function TodayBooking() {
    const [selectedGameId, setSelectedGameId] = useState<number>();
    const { data: games } = useGetGames();
    const { data: bookings, isLoading, } = useGetTodayBookedForGame(selectedGameId!);
    const selectedGame = games?.find(g => g.gameId === selectedGameId);
    return (
        <div className="flex flex-col gap-4">
            <SelectOption
                title='Games in Zone'
                value={selectedGameId!}
                onChange={(value) => setSelectedGameId(Number(value))}
                options={games?.map(
                    (g) => ({ label: g.gameName, value: g.gameId })
                )!}
                placeholder='Select Game'
            />
            
            {selectedGameId && selectedGame && (
                <Card>
                    <div className="flex gap-3 items-center">
                        <Badge icon={Calendar}>Today</Badge>
                        <Badge icon={Clock}>{selectedGame.startTime} - {selectedGame.endTime}</Badge>
                        <Badge icon={Users}>Total Bookings: {bookings?.length || 0}</Badge>
                    </div>
                </Card>
            )}
            {isLoading && (<div className="flex justify-center"> <Spinner size="xl" /></div>)}
            {!isLoading && selectedGameId && bookings?.length === 0 && (
                <p className="text-gray-500"> No bookings for today</p>
            )}

            <div className='grid md:grid-cols-3 gap-6'>
                {bookings?.map(
                    (booking) => (
                        <Card key={booking.gameBookingId}>
                            <div className='flex justify-between'>
                                <div className='flex flex-col gap-1'>
                                    <div>
                                        <span className='font-semibold'>Date:</span>{" "}
                                        {booking.bookingDate}
                                    </div>
                                    <div>
                                        <span className='font-semibold'>Time:</span>{" "}
                                        {booking.bookingTime}
                                    </div>
                                    <div>
                                        <span className='font-semibold'>Created At:</span>{" "}
                                        {new Date(booking.createdAt).toLocaleString('en-GB')}
                                    </div>
                                    <div className='flex gap-2'>
                                        <span className='font-semibold'>Booked By:</span>{" "}
                                        <Badge>{booking.bookedBy.firstName}{" "}{booking.bookedBy.lastName}</Badge>
                                    </div>
                                    <div>
                                        <div className='flex gap-2 flex-wrap mt-1'>
                                            <span className='font-semibold'>Players:</span>
                                            {booking.players.map(player => (
                                                <Badge key={player.employeeId} color="purple">
                                                    {player.firstName}{" "}{player.lastName}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )
                )}
            </div>

        </div>
    );
}

export default TodayBooking;