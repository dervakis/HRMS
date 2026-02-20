import React, { useMemo, useState } from 'react'
import { useGetGameCycle, useGetGames, useGetInterestedGames } from '../../query/GameQuery'
import { type GameSlotType, type GameType } from '../../types/Game';
import { Card, Select, Table, TableHeadCell, TableHead, TableBody, TableRow, TableCell, Badge, Button, Modal, ModalHeader, ModalBody, Label } from 'flowbite-react';
import { useSelector } from 'react-redux';
import type { RootStateType } from '../../redux-store/store';

interface cycleSlot {
    slot?: GameSlotType,
    date: string,
    isBooked: boolean
    waitingCount: number,
    gameSlotBookingId?: number,
}

function GameBooking() {
    const user = useSelector((state: RootStateType) => state.user)
    const { data: allInterestedGames } = useGetInterestedGames(user.userId);
    const [selectedGameId, setSelectedGameId] = useState<number>();
    const { data: gameCycle } = useGetGameCycle(selectedGameId!);
    const selectedGame = allInterestedGames?.find((game) => game.gameId == selectedGameId);
    const [selectedSlot, setSelectedSlot] = useState<cycleSlot>();
    const [openMoal, setOpenModal] = useState<string>();
    // console.log(allInterestedGames)
    const cycleSlots = useMemo(() => {
        const res: cycleSlot[] = [];
        // let noOfSlot:number =gameCycle?.noOfSlot!;
        // let i = 0;
        let start: Date = new Date(gameCycle?.startDate!)
        const sortedSlots = selectedGame?.gameSlots.sort((s1, s2) => {
            return s1.slotTime.localeCompare(s2.slotTime);
        });
        // console.log(gameCycle?.startDate);
        // console.log(new Date('2025-02-10T12:00:00Z').toLocaleTimeString('en-GB'));
        // console.log(start.toLocaleTimeString('en-GB'));
        let j = 0;
        let i = 0;
        for (; j < sortedSlots?.length!; j++) {
            if (start.toLocaleTimeString('en-GB') < (sortedSlots?.[j].slotTime!)) {
                break;
            }
        }
        while (i < gameCycle?.noOfSlot!) {
            res.push({
                slot: sortedSlots?.at(j % (sortedSlots.length)),
                date: new Date(start.setDate(start.getDate() + j / (sortedSlots?.length!))).toLocaleDateString('en-GB'),
                isBooked: false, //changes here happens,
                waitingCount: 0 // waiting count,
            })
            j++;
            i++;
        }
        // while(i>0){
        //     res.push();
        // }
        // console.log(res)
        return res;
    }, [gameCycle]);
    return (
        <>
            <Card className="mb-6">
                <h5 className="text-lg font-semibold">Your Intrested Game</h5>
                <Select value={selectedGameId} onChange={e => setSelectedGameId(Number(e.target.value))}>
                    <option value="">Select game</option>
                    {allInterestedGames?.map(game => <option key={game.gameId} value={game.gameId}>{game.gameName}</option>)}
                </Select>
            </Card>

            {cycleSlots.length > 0 && (
                <Card>
                    <h5 className='font-semibold'>Slots in Cycle#{gameCycle?.gameCycleId}</h5>
                    <Table className='text-center'>
                        <TableHead>
                            <TableHeadCell>Index</TableHeadCell>
                            <TableHeadCell>Slot</TableHeadCell>
                            <TableHeadCell>Date</TableHeadCell>
                            <TableHeadCell>Status</TableHeadCell>
                            <TableHeadCell>Waitings</TableHeadCell>
                            <TableHeadCell>Action</TableHeadCell>
                        </TableHead>
                        <TableBody>
                            {cycleSlots.map((slot, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{slot.slot?.slotTime}</TableCell>
                                    <TableCell>{slot.date}</TableCell>
                                    <TableCell>{slot.isBooked ? 'Booked' : 'Available'}</TableCell>
                                    <TableCell className='justify-items-center'><Button>{slot.waitingCount}</Button></TableCell>
                                    <TableCell className='justify-items-center' onClick={() => { setOpenModal('book'); setSelectedSlot(slot) }}><Button>Book</Button></TableCell>
                                    {/* <TableCell><Button>view</Button></TableCell> */}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            )}
            {selectedSlot &&
                <Modal show={openMoal=='book'}>
                    <ModalHeader>Booking Slot for - {selectedSlot.slot?.slotTime} - {selectedSlot.date}</ModalHeader>
                    <ModalBody>
                        <div>
                            <Label>Select Player</Label>
                            <Select>
                                <option value=''>Select</option>
                                {
                                    
                                }
                            </Select>
                        </div>
                    </ModalBody>
                </Modal>
            }
        </>
    )
}

export default GameBooking