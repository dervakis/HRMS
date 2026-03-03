import { Card, Modal, ModalBody, ModalHeader, ModalFooter, Button, Select, Badge, Spinner, Label, FileInput } from "flowbite-react";
import React, { useEffect, useMemo, useState } from "react";
import type { TravelEmployeeType, TravelPlanType } from "../../types/TravelPlan";
import { useAddProvidedDocument, useGetProvidedDocument, useGetTravelPlan } from "../../query/TravelPlanQuery";
import { useGetDocumentByUrl, useGetDocumentTypes, useGetTravelDocumentRequest, useVerifyTravelDocument } from "../../query/DocumentQuery";
import toast from "react-hot-toast";
import { useForm, type SubmitHandler } from "react-hook-form";
import SelectOption from "../../common/SelectOption";
import ConfirmModal from "../achievement/component/ConfirmModal";

function DocumentVarification() {
    const [selectedPlanId, setSelectedPlanId] = useState<number>();
    const [selectedEmployee, setSelectedEmployee] = useState<TravelEmployeeType>();
    const [openModal, setOpenModal] = useState(false);
    const [openReupload, setOpenReupload] = useState<number | null>(null);
    const { data: travelPlans = [] } = useGetTravelPlan();
    const { data: travelDocumentRequests = [], isLoading, refetch: refetchRequest } = useGetTravelDocumentRequest(selectedEmployee?.employeeId!);
    const verifyMutation = useVerifyTravelDocument();
    const docMutation = useGetDocumentByUrl();

    const selectedPlan: TravelPlanType | undefined = travelPlans.find(t => t.travelPlanId === selectedPlanId);

    const remainingDocuments = useMemo(() => {
        const submittedIds = travelDocumentRequests.filter(d => d.documentStatus == 'Verified').map(d => d.documentTypeId);
        return selectedPlan?.documentTypes.filter(doc => !submittedIds.includes(doc.documentTypeId));
    }, [selectedPlan, travelDocumentRequests]);

    const openEmployeeModal = (employee: TravelEmployeeType) => { setSelectedEmployee(employee); setOpenModal(true); };
    const [openAdd, setOpenAdd] = useState<number>();
    const { data: providedDocuments } = useGetProvidedDocument({ travelPlanId: selectedPlanId!, employeeId: selectedEmployee?.employeeId! })
    const addProvidedMutation = useAddProvidedDocument();
    const { register, handleSubmit, reset } = useForm<{ documentTypeId: number, file: FileList }>();
    const { data: documents } = useGetDocumentTypes(true);

    const onSubmit: SubmitHandler<{ documentTypeId: number, file: FileList }> = (data) => {
        const formData = new FormData();
        formData.append('documentTypeId', data.documentTypeId.toString());
        formData.append('employeeId', openAdd?.toString()!);
        formData.append('travelPlanId', selectedPlan?.travelPlanId.toString()!);
        formData.append('file', data.file[0]);

        addProvidedMutation.mutate(formData, {
            onSuccess: (data) => {
                toast.success(data.message);
                reset();
                setOpenAdd(undefined);
            },
            onError: (err) => toast.error(err.message)
        })
    }
    return (
        <>
            <SelectOption
                title='Travel Plan For Document Varification'
                value={selectedPlanId!}
                onChange={(value) => setSelectedPlanId(Number(value))}
                options={travelPlans.map(
                    (tp) => ({ label: tp.title, value: tp.travelPlanId })
                )}
                placeholder='Select Plan'
            />

            {selectedPlan && (
                <Card>
                    <h5 className="text-md font-semibold">Employees in {selectedPlan.title}</h5>
                    <div className="overflow-x-auto">

                        <table className='w-full text-sm text-center'>
                            <thead className='border-b'>
                                <tr>
                                    <th className="px-3 py-3">Name</th>
                                    <th className="px-3 py-3">Email</th>
                                    <th className="px-3 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedPlan.travelEmployees.map(emp =>
                                    <tr key={emp.employeeId}>
                                        <td className="px-4 py-2">{emp.firstName} {emp.lastName}</td>
                                        <td className="px-4 py-2">{emp.email}</td>
                                        <td className="px-4 py-2">
                                            <div className="flex gap-2 justify-center">
                                                <Button size="xs" onClick={() => openEmployeeModal(emp)}>Show Documents</Button>
                                                <Button size='xs' onClick={() => setOpenAdd(emp.employeeId)}>Add Document</Button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            <Modal show={openModal} size="4xl" onClose={() => setOpenModal(false)}>
                <ModalHeader>Document Verification - {selectedEmployee?.firstName} {selectedEmployee?.lastName}</ModalHeader>
                <ModalBody>
                    <div className="grid gap-4">
                        {isLoading ? <Spinner /> :
                            travelDocumentRequests.map(doc =>
                                <Card key={doc.employeeTravelDocumentId} className="border border-gray-200 shadow-sm">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h5 className="font-semibold">{doc.documentTypeName}</h5>
                                            <p className="text-xs text-gray-500">
                                                Status: <span className={`font-medium ${doc.documentStatus === "Approved" ? "text-green-600" : doc.documentStatus === "Rejected" ? "text-red-600" : "text-yellow-600"}`}>
                                                    {doc.documentStatus}</span>
                                            </p>
                                            <p className="text-xs text-gray-500">Action Date: {new Date(doc.actionDate).toLocaleDateString()}</p>
                                            <p className="text-xs text-gray-500">Remark {doc.remark}</p>
                                        </div>
                                        <div className="flex flex-col lg:flex-row gap-2">
                                            {doc.documentStatus === "Uploaded" && (
                                                <>
                                                    <Button size="xs" color="green" onClick={() => verifyMutation.mutate({
                                                        docRequestId: doc.employeeTravelDocumentId, status: "Verified", remark: null
                                                    },
                                                        {
                                                            onSuccess: data => {
                                                                toast.success(data.message);
                                                                setOpenModal(false);
                                                                refetchRequest();
                                                            }
                                                        }
                                                    )}>Approve</Button>
                                                    <Button size="xs" color="red" onClick={() => setOpenReupload(doc.employeeTravelDocumentId)}>Reupload</Button>
                                                    <Button size="xs" color="blue" onClick={() => docMutation.mutate(doc.employeeDocumentUrl, {
                                                        onSuccess: (data) => {
                                                            const fileURL = URL.createObjectURL(data);
                                                            window.open(fileURL, '_blank')
                                                        }
                                                    })}>View</Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            )
                        }
                    </div>

                    <Card className="border border-dashed border-gray-300 mt-4">
                        <h5 className="text-sm font-semibold mb-2">Remaining Documents</h5>
                        <div className="flex flex-wrap gap-2">
                            {remainingDocuments?.map(doc =>
                                <Badge key={doc.documentTypeId} color="failure">
                                    {doc.documentTypeName}
                                </Badge>)}
                        </div>
                    </Card>
                    <Card className="border border-gray-200 mt-4">
                        <h5 className="text-sm font-semibold mb-2">Provided Documents</h5>

                        {!providedDocuments ? (
                            <p className="text-xs text-gray-500">No provided documents.</p>
                        ) : (
                            providedDocuments?.map(doc => (
                                <div key={doc.providedTravelDocumentId} className="flex justify-between items-center border-b py-2">
                                    <div>
                                        <p className="text-sm font-medium">{doc.documentTypeName}</p>
                                        <p className="text-xs text-gray-500">
                                            Uploaded At: {new Date(doc.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <Button size="xs" color="blue" onClick={() => docMutation.mutate(doc.documentUrl, {
                                        onSuccess: (data) => {
                                            const fileURL = URL.createObjectURL(data);
                                            window.open(fileURL, '_blank')
                                        }
                                    })}>
                                        View
                                    </Button>
                                </div>
                            ))
                        )}
                    </Card>
                </ModalBody>
                <ModalFooter><Button color="gray" onClick={() => setOpenModal(false)}>Close</Button></ModalFooter>
            </Modal>

            <Modal show={openAdd != undefined}>
                <ModalHeader>Provide Document</ModalHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <ModalBody>
                        <div>
                            <Label>Document Type</Label>
                            <Select {...register('documentTypeId')}>
                                <option value=''>Select </option>
                                {documents?.map(doc => (
                                    <option key={doc.documentTypeId} value={doc.documentTypeId}>{doc.documentTypeName}</option>
                                ))}
                            </Select>
                        </div>
                        <div>
                            <Label>Upload File</Label>
                            <FileInput {...register('file')}></FileInput>
                        </div>
                    </ModalBody>
                    <div className="flex ml-6 mb-4 gap-4">
                        <Button type="submit">Add</Button>
                        <Button onClick={() => setOpenAdd(undefined)}>Cancel</Button>
                    </div>
                </form>
            </Modal>
            <ConfirmModal
                open={openReupload != null}
                title="Mark as Reupload"
                message="Are you sure you want to re upload that document request ?"
                confirmText="Yes"
                cancelText="No"
                requireRemark
                danger
                loading={verifyMutation.isPending}
                onConfirm={(remark) => verifyMutation.mutate({ docRequestId: openReupload!, status: "Reupload", remark: remark! },
                    {
                        onSuccess: data => {
                            toast.success(data.message);
                            refetchRequest();
                            setOpenReupload(null);
                        },
                        onError: error => toast.error(error.message)
                    }
                )}
                onClose={() => setOpenReupload(null)}
            />
        </>
    );
}

export default DocumentVarification;