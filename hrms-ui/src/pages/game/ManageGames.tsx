import { useState } from 'react'
import { useCreateGame, useDeleteGame, useGetGames, useUpdateGame } from '../../query/GameQuery'
import { Alert, Badge, Button, Card, Label, Modal, ModalBody, ModalFooter, ModalHeader, Spinner, TextInput } from 'flowbite-react';
import { Clock, Edit, Plus, Trash } from 'lucide-react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { type GameType, type GameCreateType } from '../../types/Game';
import toast from 'react-hot-toast';
import ConfirmModal from '../achievement/component/ConfirmModal';
import Loader from '../../common/Loader';
import { useQueryClient } from '@tanstack/react-query';

function ManageGames() {
  const queryClient = useQueryClient();
  const { data: allGame, isLoading } = useGetGames();
  const createMutation = useCreateGame();
  const deleteMutation = useDeleteGame();
  const updateMutation = useUpdateGame();
  const [openModal, setOpenModal] = useState(false);
  const [openDelete, setOpenDelete] = useState<GameType | null>(null);
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<GameCreateType>();

  const onSubmit: SubmitHandler<GameCreateType> = (data) => {
    if (data.gameId == undefined) {
      createMutation.mutate(data, {
        onSuccess: (res) => {
          toast.success(res.message);
          onClose();
          queryClient.setQueryData(['Games'], (oldData: GameType[]) => [...oldData, oldData]);
        },
        onError: (err) => toast.error(err.message)
      })
    } else {
      updateMutation.mutate(data, {
        onSuccess: (res) => {
          toast.success(res.message);
          onClose();
          queryClient.setQueryData(['Games'], (oldData: GameType[]) => oldData.map(item => item.gameId != res.data.gameId ? item : res.data));
        },
        onError: (err) => toast.error(err.message)
      })
    }

  }

  const onClose = () => {
    setOpenModal(false);
    reset({
      gameId: undefined,
      gameName: undefined,
      durationInMinute: undefined,
      maxPlayer: undefined,
      startingTime: undefined,
      endingTime: undefined
    })
  }

  const onEdit = (game: GameType) => {
    reset({
      gameId: game.gameId,
      gameName: game.gameName,
      durationInMinute: game.durationInMinute,
      maxPlayer: game.maxPlayer,
      startingTime: game.startTime,
      endingTime: game.endTime
    })
    setOpenModal(true)
  }

  const confirmDelete = () => {
    deleteMutation.mutate(openDelete!.gameId, {
      onSuccess: (res) => {
        toast.success(res.message)
        queryClient.setQueryData(['Games'], (oldData: GameType[]) => oldData.filter(item => item.gameId != openDelete?.gameId));
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
              <h5 className="text-md font-bold">
                {game.gameName}
              </h5>
              |<p>Maximum Player : {game.maxPlayer}</p>
              |<p>Maximum Duration : {game.durationInMinute}min</p>
            </div>
            <div className='flex gap-2 mt-2'>
              <Badge color='info' icon={Clock}>
                {game.startTime} - {game.endTime}
              </Badge>
              <Badge color='warning' icon={Edit} onClick={() => onEdit(game)}>Edit</Badge>
              <Badge color='failure' icon={Trash} onClick={() => setOpenDelete(game)}>Delete</Badge>
            </div>
          </Card>
        ))}
        <Card className='border-dashed border-3' onClick={() => setOpenModal(true)}>
          <div className='flex flex-col items-center text-gray-500'>
            <Plus className='size-8 mb-2' />
            <p>New Game</p>
          </div>
        </Card>
      </div>

      <Modal show={openModal}>
        <ModalHeader>{watch('gameId') == undefined ? 'Add New Game' : 'Edit Game'}</ModalHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
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
                <TextInput type='time' {...register('endingTime', {
                  required: "Ending time is required",
                  validate: (value) => {
                    if (new Date(value) < new Date(watch('startingTime'))) {
                      return "Endtime must be greater that starting Time"
                    }
                    return true;
                  }
                })} />
              </div>
            </div>
            {(Object.keys(errors).length > 0) && (
              <Alert color="failure" className='mt-4'> {
                errors.gameName?.message ||
                errors.maxPlayer?.message ||
                errors.durationInMinute?.message ||
                errors.startingTime?.message ||
                errors.endingTime?.message
              }</Alert>)}
          </ModalBody>
          <ModalFooter>
            <Button color={'blue'} disabled={createMutation.isPending || updateMutation.isPending} type='submit'>{(createMutation.isPending || updateMutation.isPending) && <Spinner size='sm' />}{watch('gameId') == undefined ? 'Create' : 'Update'}</Button>
            <Button color={'gray'} onClick={onClose}>Cancle</Button>
          </ModalFooter>
        </form>
      </Modal>

      <ConfirmModal
        open={!!openDelete}
        title="Delete Game"
        message="Are you sure you want to delete this Game? This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        danger
        loading={deleteMutation.isPending}
        onConfirm={confirmDelete}
        onClose={() => setOpenDelete(null)}
      />
      {(isLoading) && <Loader />}
    </>
  )
}

export default ManageGames