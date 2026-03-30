import { Alert, Button, Card, Label, Modal, ModalBody, ModalFooter, ModalHeader, Spinner, Textarea, TextInput } from 'flowbite-react';
import { FileText, Plus, SquarePen, Trash2, Users } from 'lucide-react';
import { useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useCreateTravelPlan, useDeleteTravelPlan, useGetTravelPlan, useManageTravelDocument, useManageTravelEmployee, useUpdateTravelPlan } from '../../query/TravelPlanQuery';
import { type DocumentType, type TravelEmployeeType, type TravelPlanCreate, type TravelPlanType } from '../../types/TravelPlan';
import toast from 'react-hot-toast';
import { useGetEmployees } from '../../query/EmployeeQuery';
import { useGetDocumentTypes } from '../../query/DocumentQuery';
import ConfirmModal from '../achievement/component/ConfirmModal';
import SearchableDropdown from '../../common/SearchableDD';
import Loader from '../../common/Loader';
import { useQueryClient } from '@tanstack/react-query';

function ManageTravel() {
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<TravelPlanCreate>();
    const { data: travelPlans, isLoading: tpLoading } = useGetTravelPlan();
    const { data: allEmployees, isLoading: empLoading } = useGetEmployees();
    const { data: allDocuments, isLoading: docLoading } = useGetDocumentTypes(false);
    const createTravelMutation = useCreateTravelPlan();
    const manageEmployeeMutation = useManageTravelEmployee();
    const manageDocumentMutation = useManageTravelDocument();
    const updateTravelMutation = useUpdateTravelPlan();
    const deleteTravelMutation = useDeleteTravelPlan();
    const [openModal, setOpenModal] = useState<string>();
    const [openConfirm, setOpenConfirm] = useState<number | null>(null);
    const [selectedTravelPlan, setSelectedTravelPlan] = useState<TravelPlanType>();
    const [selectedEmployees, setSelectedEmployees] = useState<TravelEmployeeType[]>();
    const [selectedDocuments, setSelectedDocuments] = useState<DocumentType[]>();

    const onSubmit: SubmitHandler<TravelPlanCreate> = (travel) => {
        if (openModal == 'edit') {
            updateTravelMutation.mutate(travel, {
                onSuccess: (data) => {
                    reset();
                    setOpenModal(undefined);
                    toast.success(data.message);
                    queryClient.setQueryData(['travelPlans'], (old: TravelPlanType[]) => old.map(item => item.travelPlanId != data.data.travelPlanId ? item : data.data))
                }
            })
            return;
        }
        createTravelMutation.mutate(travel, {
            onSuccess: (data) => {
                reset();
                setOpenModal(undefined);
                toast.success(data.message);
                queryClient.setQueryData(['travelPlans'], (old: TravelPlanType[]) => [...old, data.data])
            },
            onError: (error) => {
                // console.log(error)
                toast.error(error.message)
            }
        })
    }
    const openSelection = (plan: TravelPlanType) => {
        setSelectedTravelPlan(plan);
        setSelectedEmployees(plan.travelEmployees)
        setOpenModal('select');
    }
    const openDocument = (plan: TravelPlanType) => {
        setSelectedTravelPlan(plan);
        setSelectedDocuments(plan.documentTypes);
        setOpenModal('document');
    }
    const openEdit = (plan: TravelPlanType) => {
        reset({
            travelPlanId: plan.travelPlanId,
            title: plan.title,
            description: plan.description,
            startTime: plan.startTime,
            endTime: plan.endTime
        });
        setOpenModal('edit');
    }
    const handleSelect = () => {
        manageEmployeeMutation.mutate({
            travelPlanId: selectedTravelPlan?.travelPlanId!,
            employeeIds: selectedEmployees?.map(e => e.employeeId)!
        },
            {
                onSuccess: (data) => {
                    toast.success(data.message);
                    setOpenModal(undefined)
                    queryClient.setQueryData(['travelPlans'], (old: TravelPlanType[]) => old.map(item => item.travelPlanId != data.data.travelPlanId ? item : data.data))
                },
                onError: (error) => {
                    toast.error(error.message)
                }
            })
    }
    const handleDocument = () => {
        manageDocumentMutation.mutate({
            travelPlanId: selectedTravelPlan?.travelPlanId!,
            documentTypeIds: selectedDocuments?.map(d => d.documentTypeId)!
        }, {
            onSuccess: (data) => {
                toast.success(data.message);
                setOpenModal(undefined)
                queryClient.setQueryData(['travelPlans'], (old: TravelPlanType[]) => old.map(item => item.travelPlanId != data.data.travelPlanId ? item : data.data))
            }
        })
    }

    return (
        <>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                {
                    travelPlans?.map((plan) => (
                        <Card key={plan.travelPlanId} className='shadow-md border border-gray-200'>
                            <div >
                                <h1 className='text-xl text-center font-semibold'>{plan.title}</h1>
                            </div>
                            <p className='text-gray-700 text-center text-sm'>{plan.description}</p>
                            <div className='text-sm text-gray-600 space-y-1'>
                                <p>Start : {new Date(plan.startTime).toLocaleDateString('en-GB', { hour: 'numeric', minute: '2-digit', })}</p>
                                <p>End : {new Date(plan.endTime).toLocaleDateString('en-GB', { hour: 'numeric', minute: '2-digit', })}</p>
                                <p>Created By : {plan.createdBy.email}</p>
                            </div>
                            <div className='flex gap-3 justify-center mt-auto'>
                                {new Date(plan.startTime) > new Date() && (<>
                                    <Button size='xs' color='gray' onClick={() => openSelection(plan)}>
                                        <Users />
                                        <span className="absolute -top-1 -right-1 w-5 h-5 text-xs flex items-center justify-center bg-blue-500 text-white rounded-full">
                                            {plan.travelEmployees.length}
                                        </span>
                                    </Button>
                                    <Button size='xs' color='gray' onClick={() => openDocument(plan)}><FileText /></Button>
                                    <Button size='xs' color='blue' onClick={() => openEdit(plan)}><SquarePen /></Button>
                                    <Button size='xs' color='red' onClick={() => setOpenConfirm(plan.travelPlanId)}><Trash2 /></Button>
                                </>)}
                            </div>
                        </Card>
                    ))
                }
                <Card onClick={() => setOpenModal('create')} className="flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 hover:bg-gray-50 transition-all">
                    <div className="flex flex-col items-center text-gray-500">
                        <Plus className="w-8 h-8 mb-2" />
                        <p className="font-medium">Add New Travel</p>
                    </div>
                </Card>
            </div>

            <Modal show={openModal == 'create' || openModal == 'edit'}>
                <ModalHeader>
                    {openModal == 'edit' ? "Edit Travel Plan" : "Add New Travel Plan"}
                </ModalHeader>
                <ModalBody>
                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <Label htmlFor="title">Title</Label>
                            <TextInput id="title" {...register("title", { required: "Title is Require" })} placeholder="Enter travel title" required />
                        </div>
                        <div>
                            <Label htmlFor="description"> Description </Label>
                            <Textarea id="description" {...register("description", { required: "Description is required" })} placeholder="Enter description" rows={3} required />
                        </div>
                        <div>
                            <Label htmlFor="startTime">Start Time</Label>
                            <TextInput type="datetime-local" id="startTime" {...register("startTime", {
                                required: "start time is required",
                                validate: (value) => {
                                    if (new Date(value) <= new Date())
                                        return "Start time must be in future";
                                    return true;
                                }
                            })} required />
                        </div>
                        <div>
                            <Label htmlFor="endTime" >End Time</Label>
                            <TextInput type="datetime-local" id="endTime" {...register("endTime", {
                                required: "endtime is required",
                                validate: (value) => {
                                    if (new Date(value) <= new Date(watch('startTime')))
                                        return "End time must be after start time";
                                    return true;
                                }
                            })} required />
                        </div>
                        {Object.keys(errors).length > 0 && <Alert color='failure'>{errors.title?.message || errors.description?.message || errors.startTime?.message || errors.endTime?.message}</Alert>}

                        <ModalFooter>
                            <Button type="submit" disabled={(createTravelMutation.isPending || updateTravelMutation.isPending)}>
                                {(createTravelMutation.isPending || updateTravelMutation.isPending) && <Spinner size='sm' />}{openModal == 'edit' ? "Update" : "Create"}
                            </Button>
                            <Button color="gray" onClick={() => {
                                setOpenModal(undefined);
                                reset({
                                    travelPlanId: undefined,
                                    title: undefined,
                                    description: undefined,
                                    startTime: undefined,
                                    endTime: undefined
                                });
                            }}>
                                Cancel
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalBody>
            </Modal>

            <Modal show={openModal == 'select'}>
                <ModalHeader>
                    Employee Selection - {selectedTravelPlan?.title}
                </ModalHeader>
                <ModalBody>
                    <div className="space-y-6">
                        <div className="text-xl font-semibold mb-2">
                            Selected Employees
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {selectedEmployees?.map((emp) => (
                                <div key={emp.employeeId} className="flex items-center bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm">
                                    <div className="flex-col items-center">
                                        <span className="font-semibold">{emp.firstName} {emp.lastName}</span>
                                        <div className="text-xs text-blue-500">{emp.email}</div>
                                    </div>
                                    <button className="ml-2 hover:text-red-500"
                                        onClick={() => setSelectedEmployees(selectedEmployees.filter(e => e.employeeId != emp.employeeId))}
                                    >✕</button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='mt-6 flex justify-center'>
                        <SearchableDropdown
                            label='Select Employee for travel'
                            items={allEmployees!}
                            getKey={(item) => item.employeeId}
                            getLabel={(item) => item.firstName + " " + item.lastName}
                            onSelect={(item) => {
                                if (!selectedEmployees?.find(e => e.employeeId == item.employeeId)) {
                                    setSelectedEmployees((employees) => [...employees!, item])
                                }
                            }}
                            placeholder='Search'
                            notFoundText='Employee not found.'
                        />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={handleSelect} disabled={manageEmployeeMutation.isPending}>{manageEmployeeMutation.isPending && <Spinner size='sm' />}Save</Button>
                    <Button color="gray" onClick={() => setOpenModal(undefined)}>Close</Button>
                </ModalFooter>
            </Modal>

            <Modal show={openModal == 'document'} size='lg'>
                <ModalHeader>Requested Documents - {selectedTravelPlan?.title}</ModalHeader>
                <ModalBody>
                    <div className="space-y-6">
                        <div className="text-xl font-semibold mb-2">Selected Document</div>
                        <div className="flex flex-wrap gap-2">
                            {selectedDocuments?.map((doc) => (
                                <div
                                    key={doc.documentTypeId}
                                    className="flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                                >
                                    {doc.documentTypeName}
                                    <button className="ml-2 hover:text-red-500"
                                        onClick={() => {
                                            setSelectedDocuments(selectedDocuments.filter(d => d.documentTypeId != doc.documentTypeId));
                                        }}
                                    >✕</button>
                                </div>
                            ))}
                        </div>

                        <div className='mt-6 flex justify-center'>
                            <SearchableDropdown
                                label='Select Document for Travel'
                                items={allDocuments!}
                                getKey={(item) => item.documentTypeId}
                                getLabel={(item) => item.documentTypeName}
                                onSelect={(item) => {
                                    if (!selectedDocuments?.find((d) => d.documentTypeId == item.documentTypeId)) {
                                        setSelectedDocuments((docs) => [...docs!, item]);
                                    }
                                }}
                                placeholder='Search'
                                notFoundText='Document not found.'
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={handleDocument} disabled={manageDocumentMutation.isPending}>{manageDocumentMutation.isPending && <Spinner size='sm' />}Save</Button>
                    <Button color={'gray'} onClick={() => setOpenModal(undefined)}>Cancle</Button>
                </ModalFooter>
            </Modal>

            <ConfirmModal
                open={openConfirm != null}
                title='Cancel Travel Plan'
                message='Are you sure you want to cancel this travel plan ?'
                confirmText='Yes'
                cancelText='No'
                danger
                onConfirm={() => deleteTravelMutation.mutate(openConfirm!,
                    {
                        onSuccess: (data) => {
                            toast.success(data.message);
                            setOpenConfirm(null);
                            queryClient.setQueryData(['travelPlans'], (old: TravelPlanType[]) => old.filter(item => item.travelPlanId != openConfirm))
                        },
                        onError: (err) => toast.error(err.message)
                    }
                )}
                onClose={() => setOpenConfirm(null)}
            />

            {(empLoading || docLoading || tpLoading) && <Loader />}
        </>
    )
}

export default ManageTravel