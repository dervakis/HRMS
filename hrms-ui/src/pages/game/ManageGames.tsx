import React, { useState } from 'react'
import { useAddGame, useAddSlot, useGetGames } from '../../query/GameQuery'
import { Badge, Button, Card, Label, Modal, ModalBody, ModalFooter, ModalHeader, TextInput } from 'flowbite-react';
import { CircleAlert, CircleCheck, Mail, Plus } from 'lucide-react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import {type GameType, type GameCreateType } from '../../types/Game';
import toast from 'react-hot-toast';

function ManageGames() {
  const { data: allGame, refetch: refetchGame } = useGetGames();
  const CreateGameMutation = useAddGame();
  const AddSlotMutation = useAddSlot();
  const [openModal, setOpenModal] = useState<string>();
  const { register, handleSubmit, reset } = useForm<GameCreateType>();
  const [selectedGame, setSelectedGame] = useState<GameType>();
  const [slotTime, setSlotTime] = useState<string>()
  const onCreate: SubmitHandler<GameCreateType> = (data) => {
    CreateGameMutation.mutate(data, {
      onSuccess: (data) => {
        toast.success(data.message)
        refetchGame();
        reset();
      },
      onError: (err) => console.log(err)
    });
    setOpenModal(undefined);
  }

  return (
    <>
      <div className='grid grid-col-1 gap-4'>
        {allGame?.map((game) => (
          <Card key={game.gameId}>
            <div className='flex gap-2 justify-center'>
              <h5 className="text-md font-bold text-gray-800">
                {game.gameName}
              </h5>
              |<p>Maximum Player : {game.maxPlayer}</p>
              |<p>Maximum Duration : {game.durationInMinute}min</p>
            </div>
            <div className='flex flex-wrap gap-2'>
              {game.gameSlots?.map((slot) => (
                <Badge id={slot.gameSlotId.toString()} icon={slot.active ? CircleCheck : CircleAlert}>{slot.slotTime.toString()}</Badge>
              ))}
              <Badge color='gray' icon={Plus} onClick={()=>setSelectedGame(game)}>Add Slot</Badge>
            </div>
          </Card>
        ))}
        <Card className='border-dashed border-3' onClick={() => setOpenModal('add')}>
          <div className='flex flex-col items-center text-gray-500'>
            <Plus className='size-8 mb-2' />
            <p>New Game</p>
          </div>
        </Card>
      </div>

      <Modal show={openModal == 'add'}>
        <ModalHeader>Add New Game</ModalHeader>
        <form onSubmit={handleSubmit(onCreate)}>
          <ModalBody>
            <div>
              <Label>Game Name</Label>
              <TextInput {...register('gameName')} />
            </div>
            <div>
              <Label>Max Player</Label>
              <TextInput type='number' {...register('maxPlayer')} />
            </div>
            <div>
              <Label>Duration In Minute</Label>
              <TextInput type='number' {...register('durationInMinute')} />
            </div>
            <div className='flex gap-6'>
              <div className='w-full'>
                <Label>Start Time</Label>
                <TextInput type='time' {...register('startingTime')} />
              </div>
              <div className='w-full'>
                <Label>End Time</Label>
                <TextInput type='time' {...register('endingTime')} />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color={'blue'} type='submit'>Add</Button>
            <Button color={'gray'} onClick={() => setOpenModal(undefined)}>Cancle</Button>
          </ModalFooter>
        </form>
      </Modal>

      <Modal show={selectedGame!=undefined}>
        <ModalBody>
          <div className='w-full'>
            <Label>Start Time</Label>
            <TextInput type='time' value={slotTime} onChange={(e) => setSlotTime(e.target.value)} />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color={'blue'} onClick={()=>{
            AddSlotMutation.mutate({gameId:selectedGame?.gameId!, slotStart:slotTime!}, {
              onSuccess: (data) => {
                toast.success(data.message);
                refetchGame();
                setSelectedGame(undefined);
              },
              onError: (error) => toast.error(error.message)
            })
          }}>Add</Button>
          <Button color={'gray'} onClick={() => setSelectedGame(undefined)}>Cancle</Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

export default ManageGames