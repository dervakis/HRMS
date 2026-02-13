import { Alert, Button, Card, Label, TextInput } from 'flowbite-react'
import { HatGlasses, Lock, Mail } from 'lucide-react'
import React from 'react'
import { useForm, type SubmitErrorHandler, type SubmitHandler } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom'
import type { ResetPasswordDetailType } from '../types/AuthType';
import toast from 'react-hot-toast';
import { useSubmitNewPassword } from '../query/EmployeeQuery';

function ResetPassword() {
    const [searchParam, setSearchParam] = useSearchParams();
    const {register, handleSubmit} = useForm<ResetPasswordDetailType>();
    const {mutate, isPending, isError, error }= useSubmitNewPassword();
    const navigate = useNavigate();

    const onSubmit: SubmitHandler<ResetPasswordDetailType> = (data) =>{
        if(!searchParam.get('token'))
            toast.error("Invalid Path, verify link with mail");
        mutate({email:data.email, token: searchParam.get('token')!, newPassword:data.password}, {
            onSuccess: (data) =>{
                toast.success(data.message);
                navigate('/login');
                // console.log(data)
            }
        })
        // console.log(data);
    }
    const onError: SubmitErrorHandler<ResetPasswordDetailType> = (error) =>{
        console.log(error);
        ///remaining error handling
    }

    
    return (
        <div className='min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center'>
            <Card className='w-md'>
                <div className="text-center gap-4 justify-center">
                    <div className="inline-block p-2 bg-gradient-to-br from-blue-400 to-blue-800 rounded-full flex  shadow-lg">
                        <HatGlasses className="size-15 text-white" />
                    </div>
                    <h1 className="text-3xl font-medium text-gray-800 mb-2">Reset Password</h1>
                </div>
                <form className="flex max-w-md flex-col gap-4" onSubmit={handleSubmit(onSubmit, onError)}>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="email1">Your email</Label>
                        </div>
                        <TextInput id="email1" type="email" icon={Mail} placeholder="name@roimaint.com" required {...register('email',{required: true})} />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="password1">New password</Label>
                        </div>
                        <TextInput id="password1" type="password" required icon={Lock} {...register('password', {required: true})}/>
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="password2">Confirm password</Label>
                        </div>
                        <TextInput id="password2" type="password" required icon={Lock} {...register('confirmPassword', {required:true})}/>
                    </div>
                    <Alert color='failure' hidden={!isError}>{error?.message}</Alert>
                    <div className='flex justify-center'>
                        <Button color='blue' type='submit' pill>Confirm</Button>
                    </div>
                </form>
            </Card>
        </div>
    )
}

export default ResetPassword