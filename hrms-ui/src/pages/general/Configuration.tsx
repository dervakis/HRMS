import React, { useEffect, useState } from 'react'
import { useAddConfiguration, useDeleteConfiguration, useGetConfiguration, useUpdateConfigurationByKey } from '../../query/AppConfigurationQuery';
import toast from 'react-hot-toast';
import { Badge, Button, Card, Label, Radio, Spinner, TextInput } from 'flowbite-react';
import { Trash } from 'lucide-react';
import { useAddDocumentTypes, useGetDocumentTypes } from '../../query/DocumentQuery';
import SearchableDropdown from '../../common/SearchableDD';
import { useAddExpenseType, useGetExpenseType } from '../../query/ExpenseQuery';
import type { TravelExpenseType } from '../../types/TravelPlan';

function Configuration() {
    const { data, isLoading, refetch } = useGetConfiguration("referral_to");
    const { data: days, refetch: refetchDay } = useGetConfiguration("expense_deadline");
    const addMutation = useAddConfiguration();
    const deleteMutation = useDeleteConfiguration();
    const updateMutation = useUpdateConfigurationByKey()
    const addDocTypeMutation = useAddDocumentTypes();
    const addExpTypeMutation = useAddExpenseType();
    const [email, setEmail] = useState("");
    const [deadline, setDeadline] = useState(0);
    const [docType, setDocType] = useState("");
    const [isProvided, setIsProvided] = useState(false);
    const [newExpType, setNewExpType] = useState<TravelExpenseType>();
    const { data: documentType, refetch: refetchType } = useGetDocumentTypes(isProvided);
    const { data: expenseType, refetch: refetchExpType } = useGetExpenseType();
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

    useEffect(() => {
        if (days?.length) {
            setDeadline(Number(days[0].configValue));
        }
    }, [days]);
    return (
        <div className='space-y-2'>
            <Card>
                <h2 className="text-xl font-semibold mb-4">Referral Email Configuration</h2>
                <div className="space-y-2">
                    {data?.map((config: any) => (
                        <div key={config.appConfigurationId} className="flex justify-between items-center bg-gray-50 p-1 rounded-lg">
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
                    <Button size='sm' onClick={handleAdd} disabled={addMutation.isPending || !email}>
                        {addMutation.isPending && (<Spinner size="sm" />)} Add
                    </Button>
                </div>
            </Card>

            <Card>
                <div className='flex flex-col md:flex-row items-center gap-4'>
                    <h2 className="text-xl font-semibold">Expense Submition Deadline (days)</h2>
                    <TextInput type='number' value={deadline} onChange={(e) => setDeadline(Number(e.target.value))} className="flex-1" />
                    <Button size='sm' onClick={() => updateMutation.mutateAsync({ configId: Number(days?.[0].appConfigurationId), value: deadline.toString() },
                        {
                            onSuccess: () => {
                                toast.success("Value Updated Successfully");
                                refetchDay();

                            },
                            onError: (err) => {
                                toast.error(err?.message || "Failed to Update Days");
                            }
                        })}
                    > Update</Button>
                </div>
            </Card >

            <Card>
                <div className='flex flex-col md:flex-row items-center gap-4'>
                    <h2 className='text-xl font-semibold'>Document Type</h2>
                    <div className=' flex gap-2 item-center lg:flex-row'>
                        <div>
                            <Radio id='uploaded' checked={!isProvided} onChange={() => setIsProvided(false)} />
                            <Label className='ms-2' htmlFor='uploaded'>Uploaded</Label>
                        </div>
                        <div>
                            <Radio id='provided' checked={isProvided} onChange={() => setIsProvided(true)} />
                            <Label className='ms-2' htmlFor='provided'>Provided</Label>
                        </div>
                    </div>
                    <SearchableDropdown
                        label='Existing Type'
                        items={documentType!}
                        getKey={(item) => item.documentTypeId}
                        getLabel={(item) => item.documentTypeName}
                        onSelect={() => { }}
                    />

                    <TextInput value={docType} onChange={(e) => setDocType(e.target.value)} className="flex-1" />
                    <Button disabled={!docType} size='sm' onClick={() => addDocTypeMutation.mutate({ name: docType, isProvided: isProvided }, {
                        onSuccess: (data) => { toast.success(data.message); refetchType(); setDocType(""); },
                        onError: (err) => toast.error(err.message)
                    })}>Add</Button>
                </div>
            </Card>

            <Card>
                <div className='flex flex-col md:flex-row items-center gap-4'>
                    <h2 className='text-xl font-semibold'>Expense Type</h2>
                    <SearchableDropdown
                        label='Existing Type'
                        items={expenseType!}
                        getKey={(item) => item.travelExpenseTypeId}
                        getLabel={(item) => `${item.travelExpenseTypeName} (${item.maxAmount})`}
                        onSelect={() => { }}
                    />

                    <div className='flex flex-1 gap-2'>
                        <TextInput placeholder='New Type..' value={newExpType?.travelExpenseTypeName} onChange={(e) => setNewExpType({ ...newExpType!, travelExpenseTypeName: e.target.value })} className='flex-1' />
                        <TextInput type='number' placeholder='Maximum Amount' value={newExpType?.maxAmount} onChange={(e) => setNewExpType({ ...newExpType!, maxAmount: Number(e.target.value) })} className='flex-1' />
                    </div>
                    <Button size='sm' disabled={!newExpType?.maxAmount || !newExpType?.travelExpenseTypeName} onClick={() => addExpTypeMutation.mutate({ name: newExpType?.travelExpenseTypeName!, maxAmount: newExpType?.maxAmount! }, {
                        onSuccess: (data) => { toast.success(data.message); refetchExpType(); setNewExpType({ ...newExpType!, travelExpenseTypeName: '', maxAmount: 0 }) },
                        onError: (err) => toast.error(err.message)
                    })}>Add</Button>
                </div>
            </Card>
        </div >
    )
}

export default Configuration