import { CircleAlert, Lock, Mail, Send, UserIcon } from 'lucide-react'
import React, { useState, type ChangeEvent } from 'react'
import { Alert, Button, Card, Label, Modal, ModalBody, ModalHeader, Spinner, TextInput, Toast, ToastToggle } from 'flowbite-react'
import { useLogin, useResetPasswordRequest } from '../query/EmployeeQuery';
import type { LoginDetailType } from '../types/AuthType';
import { useForm, type SubmitErrorHandler, type SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { AppDispatchType } from '../redux-store/store';
import { Authenticate } from '../redux-store/UserSlice';

function Login() {
    const [openModel, setOpenModel] = useState<boolean>(false);
    const [email, setEmail] = useState<string>();
    const [emailError, setEmailError] = useState<string>();
    const { mutate, isPending, isError, error } = useResetPasswordRequest();
    const { mutate: mutateLogin, isPending: isPendingLogin, isError: isErrorLogin, error: errorLogin } = useLogin();
    const { register, handleSubmit } = useForm<LoginDetailType>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatchType>();
    const onCloseModal = () => {
        setOpenModel(false);
        setEmailError(undefined);
        setEmail(undefined);
    }
    const onSubmitModal = () => {
        setEmailError(undefined);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email!) || email!.length > 30) {
            setEmailError('Invalide Email Syntax : ' + email);
            return;
        }
        mutate(email!,
            {
                onSuccess: (data) => {
                    toast.success(data.message);
                    onCloseModal();
                }
            }
        );
    }

    const onSubmit: SubmitHandler<LoginDetailType> = (loginDetail) => {
        mutateLogin(loginDetail, {
            onSuccess: (data) => {
                console.log(data.data.token);
                dispatch(Authenticate(data.data.token));
                navigate('/');
            }
        })
    }
    const onError: SubmitErrorHandler<LoginDetailType> = (error) => {
        error.email?.ref?.focus;
    }
    return (
        <div className='min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center'>
            <Card className='w-md'>
                <div className="text-center gap-4 justify-center">
                    <div className="inline-block p-2 bg-gradient-to-br from-blue-400 to-blue-800 rounded-full flex  shadow-lg">
                        <UserIcon className="size-15 text-white" />
                    </div>
                    <h1 className="text-3xl font-medium text-gray-800 mb-2">Login</h1>
                </div>
                <form className="flex max-w-md flex-col gap-4" onSubmit={handleSubmit(onSubmit, onError)} >
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="email1">Your email</Label>
                        </div>
                        <TextInput id="email1" type="email" icon={Mail} placeholder="name@roimaint.com" {...register('email', { required: true })} />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="password1">Your password</Label>
                        </div>
                        <TextInput id="password1" type="password" required icon={Lock} {...register('password')} />
                    </div>
                    <Alert hidden={!isErrorLogin} color='failure'>{errorLogin?.message}</Alert>
                    <div className='flex justify-center'>
                        <Button color='blue' type='submit' pill>{isPendingLogin ? <Spinner size='md' /> : <Send className='mx-4' />}</Button>
                    </div>
                </form>
                <div className='flex justify-center text-sm underline' onClick={() => setOpenModel(true)}>
                    Reset Password
                </div>
            </Card>

            <Modal show={openModel} size="md" popup onClose={onCloseModal}>
                <ModalHeader />
                <ModalBody>
                    <div className="text-center">
                        <div className='flex justify-center items-center'>
                            <CircleAlert className='text-blue-500 size-20' />
                        </div>
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Are you sure you want to Reset Your Password?
                        </h3>
                        <div className='mb-4'>
                            <TextInput id="email1" type="email" value={email} icon={Mail} placeholder="name@roimaint.com" onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event?.target.value)} required />
                        </div>
                        {<Alert hidden={!emailError && !isError} color='failure'>{emailError || error?.message}</Alert>}
                        <div className="flex justify-center gap-4 mt-4">
                            <Button disabled={!email} color="blue" onClick={onSubmitModal} >
                                {isPending && <Spinner size='sm' className='mr-2'></Spinner>}
                                Yes, I'm sure
                            </Button>
                            <Button color="alternative" onClick={onCloseModal}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </div>
    )
}

export default Login