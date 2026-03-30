import { Badge, Card, Select } from 'flowbite-react'
import { useAddInterest, useGetGames, useGetInterestedGame, useRemoveInterest } from '../../query/GameQuery'
import { useSelector } from 'react-redux';
import type { RootStateType } from '../../redux-store/Store';
import { CircleCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import Loader from '../../common/Loader';
import { useQueryClient } from '@tanstack/react-query';
import type { GameType } from '../../types/Game';

function Profile() {
    const queryClient = useQueryClient();
    const { data: allGames } = useGetGames();
    const user = useSelector((state: RootStateType) => state.user);
    const { data: interestedGame } = useGetInterestedGame(user.userId);
    const addMutation = useAddInterest();
    const removeMutation = useRemoveInterest();
    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Employee Profile</h2>
            <Card>
                <div className='flex gap-2 flex-wrap'>
                    Your Interest on Game :
                    {interestedGame?.length! > 0 && interestedGame?.map(game =>
                        <Badge key={game.gameId} icon={CircleCheck}>
                            {game.gameName}
                            <button className="ml-2 text-red-500" onClick={() => {
                                removeMutation.mutate(game.gameId, {
                                    onSuccess: (data) => {
                                        toast.success(data.message);
                                        queryClient.setQueryData(["interestedGame", user.userId], (oldData : GameType[]) => oldData.filter(item => item.gameId != game.gameId))
                                        // console.log(interestedGame)
                                    },
                                    onError: (err) => console.log(err)
                                })
                            }}>✕</button>
                        </Badge>
                    )}
                </div>
                <div className='flex gap-4'>
                    Add Game into Interest :
                    <Select className='w-full' onChange={(e) => {
                        const exist = interestedGame?.find((obj) => obj.gameId.toString() == e.target.value)
                        if (exist != undefined)
                            return;
                        addMutation.mutate(Number(e.target.value), {
                            onSuccess: (data) => {
                                toast.success(data.message)
                                queryClient.setQueryData(["interestedGame", user.userId], (oldData : GameType[]) => [...oldData, allGames?.find(game => game.gameId.toString() == e.target.value)])
                            }
                        })
                    }}>
                        <option>Select</option>
                        {allGames?.map((game) => (
                            <option key={game.gameId} value={game.gameId}>{game.gameName}</option>))}
                    </Select>
                </div>
            </Card>
            {( addMutation.isPending || removeMutation.isPending) && <Loader/>}
        </div>
    )
}

export default Profile