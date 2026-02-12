import { Button, Card, Label, TextInput } from 'flowbite-react'
import { HatGlasses, Lock, Mail } from 'lucide-react'
import React from 'react'

function ResetPassword() {
    return (
        <div className='min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center'>
            <Card className='w-md'>
                <div className="text-center gap-4 justify-center">
                    <div className="inline-block p-2 bg-gradient-to-br from-blue-400 to-blue-800 rounded-full flex  shadow-lg">
                        <HatGlasses className="size-15 text-white" />
                    </div>
                    <h1 className="text-3xl font-medium text-gray-800 mb-2">Reset Password</h1>
                </div>
                <form className="flex max-w-md flex-col gap-4" >
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="email1">Your email</Label>
                        </div>
                        <TextInput id="email1" type="email" icon={Mail} placeholder="name@roimaint.com" required />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="password1">New password</Label>
                        </div>
                        <TextInput id="password1" type="password" required icon={Lock} />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="password1">Confirm password</Label>
                        </div>
                        <TextInput id="password1" type="password" required icon={Lock} />
                    </div>
                    {/* <Alert color='failure'>kfsalja</Alert> */}
                    <div className='flex justify-center'>
                        <Button color='blue' type='submit' pill>Confirm</Button>
                    </div>
                </form>
            </Card>
        </div>
    )
}

export default ResetPassword