import React, { useState } from 'react'
import { useAddConfiguration, useDeleteConfiguration, useGetConfiguration } from '../../query/AppConfigurationQuery';
import toast from 'react-hot-toast';
import { Badge, Button, Card, Spinner, TextInput } from 'flowbite-react';
import { Trash } from 'lucide-react';

function Configuration() {
    const { data, isLoading, refetch } = useGetConfiguration("referral_to");
    const addMutation = useAddConfiguration();
    const deleteMutation = useDeleteConfiguration();
    const [email, setEmail] = useState("");
    const handleAdd = async () => {
        if (!email.trim()) {
            toast.error("Email is required");
            return;
        }
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(email)) {
            toast.error("Please enter a valid email address");
            return;
        }
        addMutation.mutateAsync({ key: "referral_to", value: email }, {
            onSuccess: (data) => {
                toast.success(data.message);
                setEmail("");
                refetch();

            },
            onError: (err) => {
                toast.error(err?.message || "Failed to add email");
                setEmail("");
            }
        });
    };
    const handleDelete = async (id: number) => {
        deleteMutation.mutateAsync(id, {
            onSuccess: (data) => {
                toast.success(data.message);
                setEmail("");
                refetch();

            }
        });
    };
    return (
        <div>
            <Card>
                <h2 className="text-xl font-semibold mb-4">Referral Email Configuration</h2>
                <div className="space-y-2">
                    {data?.map((config: any) => (
                        <div key={config.id} className="flex justify-between items-center bg-gray-50 p-1 rounded-lg">
                            <Badge color="info">{config.configValue}</Badge>
                            <Button size="xs" color="red" onClick={() => handleDelete(config.appConfigurationId)} disabled={deleteMutation.isPending}>
                                <Trash size={14} />
                            </Button>
                        </div>
                    ))}
                    {!isLoading && data?.length === 0 && (
                        <p className="text-gray-500 text-sm">
                            No referral emails configured.
                        </p>
                    )}
                </div>
                <div className="flex gap-2 mt-6">
                    <TextInput placeholder="Enter referral email" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1" />
                    <Button onClick={handleAdd} disabled={addMutation.isPending}>
                        {addMutation.isPending && (<Spinner size="sm" />)} Add
                    </Button>
                </div>
            </Card>
        </div>
    )
}

export default Configuration