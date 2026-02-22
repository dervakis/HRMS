import React, { useState } from 'react'
import { useCreateGame, useDeleteGame, useGetGames, useUpdateOperationalHour } from '../../query/GameQuery'
import { Alert, Badge, Button, Card, Label, Modal, ModalBody, ModalFooter, ModalHeader, Spinner, TextInput } from 'flowbite-react';
import { Clock, Edit, Plus, Trash } from 'lucide-react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { type GameType, type GameCreateType, type OperationalHourUpdateType } from '../../types/Game';
import toast from 'react-hot-toast';

function ManageGames() {
  const { data: allGame, refetch: refetchGame } = useGetGames();
  const createMutation = useCreateGame();
  const deleteMutation = useDeleteGame();
  const updateHourMutation = useUpdateOperationalHour();
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState<GameType | null>(null);
  const [openDelete, setOpenDelete] = useState<GameType | null>(null);
  const [formError, setFormError] = useState<string | null>(null)
  const { register, handleSubmit, reset, formState: { errors }, reset:resetCreate } = useForm<GameCreateType>();

  const onCreate: SubmitHandler<GameCreateType> = (data) => {
    setFormError(null)
    if (data.startingTime && data.endingTime && data.endingTime <= data.startingTime) {
      setFormError("Ending time must be greater than starting time")
      return
    }
    createMutation.mutate(data, {
      onSuccess: (res) => {
        toast.success(res.message)
        refetchGame()
        reset()
        setOpenCreate(false)
      },
      onError: (err) => {
        toast.error(err.message)
      }
    })
  }

  const { register: registerEdit, handleSubmit: handleSubmitEdit, reset:resetEdit } = useForm<OperationalHourUpdateType>();
  const onUpdateHour: SubmitHandler<OperationalHourUpdateType> = (data) => {
    setFormError(null)
    if (data.end <= data.start) {
      setFormError("Ending time must be greater than starting time")
      return
    }
    data.gameId = openEdit?.gameId!;
    updateHourMutation.mutate(data, {
      onSuccess: (res) => {
        toast.success(res.message)
        refetchGame()
        setOpenEdit(null)
      },
      onError: (err) => {
        toast.error(err.message)
      }
    })

  }

  const confirmDelete = () => {
    deleteMutation.mutate(openDelete!.gameId, {
      onSuccess: (res) => {
        toast.success(res.message)
        refetchGame()
        setOpenDelete(null)
      },
      onError: (err: any) => {
        toast.error(err.message)
      }
    })
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
            <div className='flex gap-2 mt-2'>
              <Badge color='info' icon={Clock}>
                {game.startTime} - {game.endTime}
              </Badge>
              <Badge color='warning' icon={Edit} onClick={() => setOpenEdit(game)}>Edit Operational Hour</Badge>
              <Badge color='failure' icon={Trash} onClick={() => setOpenDelete(game)}>Delete</Badge>
            </div>
          </Card>
        ))}
        <Card className='border-dashed border-3' onClick={() => setOpenCreate(true)}>
          <div className='flex flex-col items-center text-gray-500'>
            <Plus className='size-8 mb-2' />
            <p>New Game</p>
          </div>
        </Card>
      </div>

      <Modal show={openCreate}>
        <ModalHeader>Add New Game</ModalHeader>
        <form onSubmit={handleSubmit(onCreate)}>
          <ModalBody>
            <div>
              <Label>Game Name</Label>
              <TextInput {...register('gameName', { required: "Game name required" })} />
            </div>
            <div>
              <Label>Max Player</Label>
              <TextInput type='number' {...register('maxPlayer', { required: "Max player is required", min: { value: 2, message: "Minimum 2 players required" }, max: { value: 12, message: "Maximum 12 players allowed" } })} />
            </div>
            <div>
              <Label>Duration In Minute</Label>
              <TextInput type='number' {...register('durationInMinute', { required: "Duration is required", min: { value: 1, message: "Minimum duration is 1 minute" }, max: { value: 60, message: "Maximum duration is 60 minutes" } })} />
            </div>
            <div className='flex gap-6'>
              <div className='w-full'>
                <Label>Start Time</Label>
                <TextInput type='time' {...register('startingTime', { required: "Start time is required" })} />
              </div>
              <div className='w-full'>
                <Label>End Time</Label>
                <TextInput type='time' {...register('endingTime', { required: true })} />
              </div>
            </div>
            {(formError || Object.keys(errors).length > 0) && (
              <Alert color="failure" className='mt-4'> {
                formError ||
                errors.gameName?.message ||
                errors.maxPlayer?.message ||
                errors.durationInMinute?.message ||
                errors.startingTime?.message ||
                errors.endingTime?.message
              }</Alert>)}
          </ModalBody>
          <ModalFooter>
            <Button color={'blue'} disabled={createMutation.isPending} type='submit'>{createMutation.isPending && <Spinner size='sm' />}Add</Button>
            <Button color={'gray'} onClick={() => {setOpenCreate(false); setFormError(null); resetCreate();}}>Cancle</Button>
          </ModalFooter>
        </form>
      </Modal>

      <Modal show={!!openEdit}>
        <ModalHeader>Edit Operational Hour</ModalHeader>
        <form onSubmit={handleSubmitEdit(onUpdateHour)}>
          <ModalBody>
            <div className='flex gap-2'>
            <div className='w-full'>
              <Label>Start</Label>
              <TextInput type="time" defaultValue={openEdit?.startTime} {...registerEdit("start")} />
            </div>
            <div className='w-full'>
              <Label>End</Label>
              <TextInput type="time" defaultValue={openEdit?.endTime} {...registerEdit("end")} />
            </div>
            </div>
            {formError && <Alert color="failure" className='mt-4'>{formError}</Alert>}
          </ModalBody>
          <ModalFooter>
            <Button color={'blue'} disabled={updateHourMutation.isPending} type='submit'>{updateHourMutation.isPending && <Spinner size='sm' />}Update</Button>
            <Button color={'gray'} onClick={() => setOpenEdit(null)}>Cancle</Button>
          </ModalFooter>
        </form>
      </Modal>

      <Modal show={!!openDelete}>
        <ModalHeader>Confirm Delete</ModalHeader>
        <ModalBody>Are you sure you want to delete<b> {openDelete?.gameName}</b> ?</ModalBody>
        <ModalFooter>
          <Button color="red" onClick={confirmDelete}>Delete</Button>
          <Button color="gray" onClick={() => setOpenDelete(null)}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

export default ManageGames