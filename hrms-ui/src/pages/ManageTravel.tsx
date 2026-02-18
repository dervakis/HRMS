import { Button, Card, Label, Modal, ModalBody, ModalFooter, ModalHeader, Textarea, TextInput } from 'flowbite-react';
import { Palette, Plus, X } from 'lucide-react';
import React, { useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useCreateTravelPlan, useGetTravelPlan, useManageTravelDocument, useManageTravelEmployee, useUpdateTravelPlan } from '../query/TravelPlanQuery';
import {type DocumentType, type TravelEmployeeType, type TravelPlanCreate, type TravelPlanType } from '../types/TravelPlan';
import toast from 'react-hot-toast';
import { useGetEmployees } from '../query/EmployeeQuery';
import { useGetDocumentTypes } from '../query/DocumentQuery';

function ManageTravel() {
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const { register, handleSubmit, reset } = useForm<TravelPlanCreate>();
    const { data: travelPlans, refetch: refetchTravelPlan, isLoading } = useGetTravelPlan();
    const {data:data1, mutate:mutate1, isPending:isPending1, isError:isError1, error:error1} = useCreateTravelPlan();
    const [openModal, setOpenModal] = useState<string>();
    const [selectedTravelPlan, setSelectedTravelPlan] = useState<TravelPlanType>();
    const [selectedEmployees, setSelectedEmployees] = useState<TravelEmployeeType[]>();
    const [selectedDocuments, setSelectedDocuments] = useState<DocumentType[]>();
    const {data:allEmployees, isLoading:emploading } = useGetEmployees();
    const {data:allDocuments} = useGetDocumentTypes();
    const {mutate:mutate2, isPending:isPending2, isError:isError2, error:error2} = useManageTravelEmployee();
    const {mutate:mutate3, isPending:isPending3, isError:isError3, error:error3} = useManageTravelDocument();
    const {mutate:mutate4, isPending:isPending4, isError:isError4, error:error4} = useUpdateTravelPlan();

    const onSubmit: SubmitHandler<TravelPlanCreate> = (travel) => {
        if(openModal == 'edit'){
            mutate4(travel, {
                onSuccess: (data) => {
                    reset();
                    setOpenModal(undefined);
                    toast.success(data.message);
                }
            })

            return;
        }
        mutate1(travel, {
            onSuccess: (data) => {
                reset();
                setOpenModal(undefined);
                toast.success(data.message);
            },
            onError: (error) => {
                console.log(error)
            }
        })
    }
    const onError = () => {}
    const openSelection = (plan:TravelPlanType) => {
        setSelectedTravelPlan(plan);
        setSelectedEmployees(plan.travelEmployees)
        setOpenModal('select');
    }
    const openDocument = (plan:TravelPlanType) => {
        setSelectedTravelPlan(plan);
        setSelectedDocuments(plan.documentTypes);
        setOpenModal('document');
    }
    const openEdit = (plan:TravelPlanType) => {
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
        mutate2({
                travelPlanId: selectedTravelPlan?.travelPlanId!,
                employeeIds: selectedEmployees?.map(e => e.employeeId)!
            },
        {
            onSuccess: (data) => {
                toast.success(data.message);
            },
            onError: (error) => {
                console.log(error)
            }
        })
    }
    const handleDocument = () =>{
        mutate3({
            travelPlanId: selectedTravelPlan?.travelPlanId!,
            documentTypeIds: selectedDocuments?.map(d => d.documentTypeId)!
        }, {
            onSuccess: (data) => {
                toast.success(data.message);
            }
        })
    }
    
    return (
        <>
            <div className='grid grid-cols-3 gap-6'>
                {
                    travelPlans?.map((plan) => (
                        <Card key={plan.travelPlanId} className='shadow-md border border-gray-200'>
                            <div >
                                <h5 className='text-xl font-semibold text-gray-900'>{plan.title}</h5>
                            </div>
                            <p className='text-gray-700 text-sm'>{plan.description}</p>
                            <div className='text-sm text-gray-600 space-y-1 mb-4'>
                                <p>Start : {new Date(plan.startTime).toLocaleDateString('en-GB', {hour: 'numeric',minute: '2-digit',})}</p>
                                <p>End : {new Date(plan.endTime).toLocaleDateString('en-GB', {hour: 'numeric',minute: '2-digit',})}</p>
                                <p>Created By : {plan.createdBy.email}</p>
                            </div>
                            <div className='flex gap-3 mt-auto'>
                                <Button size='xs' color='blue' onClick={()=>openSelection(plan)}>Employee Selection</Button>
                                <Button size='xs' color='blue' onClick={()=>openDocument(plan)}>Document Required</Button>
                                <Button size='xs' color='blue' onClick={()=>openEdit(plan)}>Edit</Button>
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
                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit, onError)}>
                        <div>
                            <Label htmlFor="title">Value</Label>
                            <TextInput id="title" {...register("title")} placeholder="Enter travel title" required />
                        </div>
                        <div>
                            <Label htmlFor="description"> Description </Label>
                            <Textarea id="description" {...register("description")} placeholder="Enter description" rows={3} required />
                        </div>
                        <div>
                            <Label htmlFor="startTime">Start Time</Label>
                            <TextInput type="datetime-local" id="startTime" {...register("startTime")} required />
                        </div>
                        <div>
                            <Label htmlFor="endTime" >End Time</Label>
                            <TextInput type="datetime-local" id="endTime" {...register("endTime")} required />
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button color="gray" onClick={()=> setOpenModal(undefined)}>
                                Cancel
                            </Button>

                            <Button type="submit">
                                {openModal == 'edit' ? "Update" : "Create"}
                            </Button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>

            <Modal show={openModal == 'select'} size="lg">
                <ModalHeader>
                    Employee Selection - {selectedTravelPlan?.title}
                </ModalHeader>
                <ModalBody>
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-sm font-semibold mb-2">
                                Selected Employees
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {selectedEmployees?.map((emp) => (
                                    <div key={emp.employeeId} className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                                        {emp.firstName} {emp.lastName}
                                        <button className="ml-2 hover:text-red-500"
                                        onClick={()=>setSelectedEmployees(selectedEmployees.filter(e => e.employeeId != emp.employeeId))}>✕</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold m-2">Select Employees</h4>
                        <div className="border-2 border-blue-200 rounded-lg divide-y max-h-60 overflow-y-auto">
                            {allEmployees?.map((emp) => (
                                <div
                                    key={emp.employeeId}
                                    className="p-3 hover:bg-gray-50 cursor-pointer"
                                    onClick={()=>{
                                        // console.log(selectedEmployees);
                                        if(!selectedEmployees?.find(e=>e.employeeId==emp.employeeId)){
                                            setSelectedEmployees((employees)=>[...employees!, emp])
                                        }
                                    }}
                                >
                                    <p className="font-medium text-sm">
                                        {emp.firstName} {emp.lastName}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {emp.email}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={handleSelect}>Save</Button>
                    <Button color="gray" onClick={() => setOpenModal(undefined)}>Close</Button>
                </ModalFooter>
            </Modal>

            <Modal show={openModal == 'document'} size='lg'>
                <ModalHeader>Requested Documents - {selectedTravelPlan?.title}</ModalHeader>
                <ModalBody>
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-sm font-semibold mb-2">Selected Documents</h4>
                            <div className="flex flex-wrap gap-2">
                                {selectedDocuments?.map((doc) => (
                                    <div
                                        key={doc.documentTypeId}
                                        className="flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                                    >
                                        {doc.documentTypeName}
                                        <button className="ml-2 hover:text-red-500"
                                        onClick={()=>{
                                            setSelectedDocuments(selectedDocuments.filter(d => d.documentTypeId != doc.documentTypeId));
                                        }}
                                        >✕</button>
                                    </div>
                                ))}
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold m-2">
                                    Select Documents
                                </h4>
                                <div className="border border-2 border-blue-200 rounded-lg divide-y max-h-60 overflow-y-auto">
                                    {allDocuments?.map((doc) => (
                                        <div
                                            key={doc.documentTypeId}
                                            className="p-3 hover:bg-gray-50 cursor-pointer"
                                            onClick={()=>{
                                                if(!selectedDocuments?.find((d)=>d.documentTypeId == doc.documentTypeId)){
                                                    setSelectedDocuments((docs)=>[...docs!, doc]);
                                                }
                                            }}
                                        >
                                            <p className="text-sm font-medium">
                                                {doc.documentTypeName}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={handleDocument}>Save</Button>
                    <Button color={'gray'} onClick={()=>setOpenModal(undefined)}>Cancle</Button>
                </ModalFooter>
            </Modal>
        </>
    )
}

export default ManageTravel