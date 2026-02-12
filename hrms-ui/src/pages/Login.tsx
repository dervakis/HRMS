import { CircleAlert, Eye, Key, Lock, Mail, Plane, Send, UserIcon } from 'lucide-react'
import React, { useState, type ChangeEvent } from 'react'
import { Alert, Button, Card, Label, Modal, ModalBody, ModalHeader, Spinner, TextInput } from 'flowbite-react'
import { useLogin, useResetPasswordRequest } from '../query/EmployeeQuery';
import type { LoginDetailType } from '../types/AuthType';
import { useForm, type SubmitErrorHandler, type SubmitHandler } from 'react-hook-form';

function Login() {
    const [openModel, setOpenModel] = useState<boolean>(false);
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [emailError, setEmailError] = useState<string>();
    // const [loginError, setLoginError] = useState<Object>()
    const {data:resetPasswordData, isLoading:resetPasswordLoading, error:resetPasswordError, refetch:resetPasswordRefetch} = useResetPasswordRequest(email!);
    const {data:loginData, isLoading:loginLoading, error:loginError, refetch:loginRefeth} = useLogin(email!, password!);
    const {register, handleSubmit} = useForm<LoginDetailType>()
    const onCloseModal = () => {
        setOpenModel(false);
        setEmailError(undefined);
        setEmail(undefined);
    }
    const onSubmitModal = () =>{
        setEmailError(undefined);
        const emailRegex =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email!) || email!.length > 30){
            setEmailError('Invalide Email Syntax : '+email);
        }
        resetPasswordRefetch();
        console.log(resetPasswordData);
        // if(resetPasswordError)
        //     setEmailError(resetPasswordError.message)
        // console.log(resetPasswordData);
        // const tem = 
        // console.log(resetPasswordError?.message);
        // console.log(resetPasswordError)
        // console.log(resetPasswordIsError);
        
    }

    const onSubmit:SubmitHandler<LoginDetailType> = (loginDetail) => {
        setPassword(loginDetail.password);
        setEmail(loginDetail.email);
        loginRefeth();
        console.log(loginData);
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
                        <TextInput id="email1" type="email" icon={Mail} placeholder="name@roimaint.com" {...register('email',{required:true})} />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="password1">Your password</Label>
                        </div>
                        <TextInput id="password1" type="password" required icon={Lock} {...register('password')} />
                    </div>
                    {/* <Alert color='failure'>kfsalja</Alert> */}
                    <div className='flex justify-center'>
                        <Button color='blue' type='submit' pill>{loginLoading ? <Spinner size='md'/> : <Send className='mx-4' />}</Button>
                    </div>
                </form>
                <div className='flex justify-center text-sm underline' onClick={()=>setOpenModel(true)}>
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
                            <TextInput id="email1" type="email" value={email} icon={Mail} placeholder="name@roimaint.com" onChange={(event:ChangeEvent<HTMLInputElement>)=>setEmail(event?.target.value)} required />
                        </div>
                        {<Alert hidden={emailError == undefined} color='failure'>{emailError}</Alert>}
                        {<Alert hidden={resetPasswordData == undefined } color='success'>{resetPasswordData}</Alert>}
                        <div className="flex justify-center gap-4 mt-4">
                            <Button disabled={!email} color="blue" onClick={onSubmitModal} >
                                { resetPasswordLoading && <Spinner size='sm' className='mr-2'></Spinner>}
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