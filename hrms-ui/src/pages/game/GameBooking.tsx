import { useEffect, useMemo, useState } from 'react'
import { useCancelBooking, useCreateGameBooking, useGetBookingForDate, useGetEmployeeBookingsInCycle, useGetGameCycle, useGetInterestedEmployee, useGetInterestedGame, } from '../../query/GameQuery'
import { Card, Select, Badge, Button, Spinner, Modal, ModalHeader, ModalBody, Label, Alert, ModalFooter } from 'flowbite-react';
import { useSelector } from 'react-redux';
import type { RootStateType } from '../../redux-store/Store';
import toast from 'react-hot-toast';
import { Calendar, CircleAlert, CircleCheck, Clock, Recycle } from 'lucide-react';
import type { GameBookingResponseType, GameBookingSubmitType, InterestedEmployeeType } from '../../types/Game';
import { useForm, type SubmitHandler } from 'react-hook-form';
import InputField from '../../common/InputField';
import SelectOption from '../../common/SelectOption';
import SearchableDropdown from '../../common/SearchableDD';
import Loader from '../../common/Loader';

function GameBooking() {
    const user = useSelector((state: RootStateType) => state.user)
    const { data: allInterestedGames, isLoading:igLoading } = useGetInterestedGame(user.userId);
    const [selectedGameId, setSelectedGameId] = useState<number>();
    const { data: gameCycle, isLoading:gcLoading } = useGetGameCycle(selectedGameId!);
    const { data: bookings, isFetching: bookingLoading, refetch } = useGetEmployeeBookingsInCycle(selectedGameId!, user.userId);
    const cancelMutation = useCancelBooking()
    const selectedGame = allInterestedGames?.find((game) => game.gameId == selectedGameId);
    const { data: interestedEmployees, isLoading:empLoading, refetch:ieRefetch } = useGetInterestedEmployee(selectedGameId!);
    const [openModal, setOpenModal] = useState<boolean>();
    const createBookingMutation = useCreateGameBooking();
    const [selectedPlayers, setSelectedPlayers] = useState<InterestedEmployeeType[]>([]);
    const [formError, setFormError] = useState<string | null>(null);
    const { register, handleSubmit, reset: resetCreate, watch } = useForm<GameBookingSubmitType>();
    const bookingOnDateMutation = useGetBookingForDate();
    const slotTimes = useMemo(() => {
        if (!selectedGame) return [];
        const times: string[] = [];
        let [startHour, startMinute] = selectedGame.startTime.split(":").map(Number);
        let [endHour, endMinute] = selectedGame.endTime.split(":").map(Number);
        let current = new Date();
        current.setHours(startHour, startMinute, 0);
        const end = new Date();
        end.setHours(endHour, endMinute, 0);
        while (current < end) {
            times.push(
                current.toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                })
            );
            current.setMinutes(current.getMinutes() + selectedGame.durationInMinute);
        }
        return times;
    }, [selectedGame]);

    const addPlayer = (emp: InterestedEmployeeType) => {
        if (!selectedPlayers.find((p) => p.employee.employeeId === emp.employee.employeeId)) {
            setSelectedPlayers([...selectedPlayers, emp]);
        }
    };

    const removePlayer = (id: number) => {
        setSelectedPlayers(selectedPlayers.filter((p) => p.employee.employeeId !== id));
    };

    const onCloseCreate = () => {
        setOpenModal(false);
        resetCreate();
        setSelectedPlayers([]);
        setFormError(null);
    }

    const onSubmit: SubmitHandler<GameBookingSubmitType> = (data) => {
        setFormError("");
        if (!data.bookingDate || !data.bookingTime) {
            setFormError("Date and time required");
            return;
        }
        if (new Date(`${data.bookingDate}T${data.bookingTime}`) < new Date()) {
            setFormError("Booking not allowed for past slot");
            return;
        }
        if (data.bookingDate < gameCycle?.startDate! || data.bookingDate > gameCycle?.endDate!) {
            setFormError("Booking date must be inside cycle");
            return;
        }
        if (selectedPlayers.length < 1 || selectedPlayers.length > selectedGame?.maxPlayer! - 1) {
            setFormError("Invalid no of player selected");
            return;
        }
        data.game = selectedGameId!;
        data.bookedBy = user.userId;
        data.players = selectedPlayers.map(p => p.employee.employeeId);
        data.gameCycle = gameCycle?.gameCycleId!;
        createBookingMutation.mutate(data,
            {
                onSuccess: (res) => {
                    toast.success(res.message);
                    onCloseCreate();
                    refetch();
                    ieRefetch();
                },
                onError: (err) => {
                    toast.error(err.message);
                },
            }
        );
    };

    // console.log(allInterestedGames)
    const handleCancel = (bookingId: number) => {
        cancelMutation.mutate(bookingId, {
            onSuccess: (res) => {
                toast.success(res.message)
                refetch()
                ieRefetch();
            },
            onError: (err) => {
                toast.error(err.message)
            }
        })

    }

    useEffect(() => {
        let bookingDate = new Date(watch('bookingDate'));
        bookingOnDateMutation.reset();
        if (!watch('bookingDate') || bookingDate.getDate() < new Date().getDate() || bookingDate > new Date(gameCycle?.endDate!))
            return;
        bookingOnDateMutation.mutate({ gameId: selectedGame?.gameId!, date: watch('bookingDate') });
    }, [watch('bookingDate')])

    const bookingOnTime = (time: string, status: string): GameBookingResponseType[] => {
        if (!bookingOnDateMutation.data)
            return [];

        return bookingOnDateMutation.data.filter(obj => obj.bookingTime.includes(time) && obj.bookingStatus == status)
    }
    const getStatusColor = (status: string) => {
        switch (status) {
            case "Booked":
                return "success"
            case "Waiting":
                return "warning"
            case "Cancelled":
                return "failure"
            default:
                return "gray"
        }
    }
    return (
        <>
            <SelectOption
                title='Games of your Interest'
                value={selectedGameId!}
                onChange={(value) => setSelectedGameId(Number(value))}
                options={allInterestedGames?.map(
                    (g) => ({ label: g.gameName, value: g.gameId })
                )!}
                placeholder='Select Game'
            />

            {selectedGameId && (
                <>
                    <Card className='mb-4'>
                        <div className='flex flex-col md:flex-row gap-3 items-center'>
                            <h5 className='font-semibold text-xl'>Your Bookings for</h5>
                            <Badge icon={Recycle} className='text-md'>Cycle#{gameCycle?.gameCycleId}</Badge>{' • '}
                            <Badge icon={Calendar} className='text-md'>{gameCycle?.startDate} - {gameCycle?.endDate}</Badge>{' • '}
                            <Badge icon={Clock} className='text-md'>Time : {selectedGame?.startTime} - {selectedGame?.endTime}</Badge>
                            <Button className='md:ml-auto' onClick={() => setOpenModal(true)}>Book Your Slot</Button>
                        </div>
                    </Card>
                    {bookingLoading ? <div className='flex items-center justify-center'><Spinner/></div> : bookings?.length == 0 ? (
                        <p className='text-gray-500'>No bookings found</p>
                    ) : (
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
                                                <div className='flex items-center gap-2'>
                                                    <span className='font-semibold'>Status:</span>{" "}
                                                    <Badge color={getStatusColor(booking.bookingStatus)}>{booking.bookingStatus}</Badge>
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
                                        {(booking.bookingStatus != 'Cancelled' && (new Date(`${booking.bookingDate}T${booking.bookingTime}`) > new Date())) && booking.bookedBy.employeeId == user.userId && (
                                            <Button color="red" size="xs" onClick={() => handleCancel(booking.gameBookingId)} >Cancel</Button>
                                        )}
                                    </Card>
                                )
                            )}
                        </div>
                    )}
                </>
            )}

            <Modal show={openModal}>
                <ModalHeader>Book Slot</ModalHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <ModalBody className="flex flex-col gap-3">
                        <div>
                            <Label>Date</Label>
                            <InputField type="date" {...register("bookingDate")} />
                        </div>

                        {
                            !bookingOnDateMutation.isPending && bookingOnDateMutation.data && (
                                <div className='flex flex-wrap justify-center gap-3'>
                                    {slotTimes.map(time => (
                                        <div className='relative' key={time}>
                                            <Badge color={bookingOnTime(time, 'Booked').length > 0 ? "red" : "green"} icon={bookingOnTime(time, 'Booked').length == 0 ? CircleCheck : CircleAlert}>{time}</Badge>
                                            {bookingOnTime(time, 'Waiting').length > 0 && <span className="absolute -top-2 -right-3 w-5 h-5 text-xs flex items-center justify-center bg-yellow-500 text-white rounded-full">
                                                {bookingOnTime(time, 'Waiting').length}
                                            </span>
                                            }
                                        </div>

                                    ))}
                                </div>
                            )
                        }

                        <div>
                            <Label>Time</Label>
                            <Select {...register("bookingTime")}>
                                <option value="">Select</option>
                                {slotTimes.map((time) => (
                                    <option key={time}>{time}</option>
                                ))}
                            </Select>
                        </div>
                        <div>
                            <div className='flex justify-center'>
                                <SearchableDropdown
                                    label='Select Players'
                                    items={interestedEmployees!}
                                    getKey={(item) => item.employeeInterestId}
                                    getLabel={(item) => `${item.employee.firstName} ${item.employee.lastName} (${item.slotPlayed})`}
                                    onSelect={(item) => item.employee.employeeId != user.userId ? addPlayer(item) : ''}
                                    placeholder='Search Player'
                                    notFoundText='No Employee found'
                                    color='green'
                                />
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {selectedPlayers.map((p) => (
                                    <div key={p.employee.employeeId} className="flex items-center bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm">
                                        <div className="flex-col items-center">
                                            <span className="font-semibold">{p.employee.firstName} {p.employee.lastName}</span>
                                            <div className="text-xs text-green-500">{p.employee.email}</div>
                                        </div>
                                        <button className="ml-2 hover:text-red-500"
                                            onClick={() => removePlayer(p.employee.employeeId)}
                                        >✕</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {formError && (
                            <Alert color="failure">{formError}</Alert>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button disabled={createBookingMutation.isPending} type='submit'>
                            {createBookingMutation.isPending && (<Spinner size="sm" className="mr-2" />)}
                            Book
                        </Button>
                        <Button color="gray" onClick={onCloseCreate}>Cancel</Button>
                    </ModalFooter>
                </form>
            </Modal>
            {(igLoading || gcLoading || empLoading || cancelMutation.isPending) && <Loader/>}
        </>
    )
}

export default GameBooking