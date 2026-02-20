import { Card, Modal, ModalBody, ModalHeader, ModalFooter, Button, Select, Table, Badge, TableHead, TableHeadCell, TableBody, TableRow, TableCell, Spinner, Label, FileInput } from "flowbite-react";
import React, { useEffect, useMemo, useState } from "react";
import type { TravelEmployeeType, TravelPlanType } from "../types/TravelPlan";
import { useAddProvidedDocument, useGetProvidedDocument, useGetTravelPlan } from "../query/TravelPlanQuery";
import { useGetDocumentByUrl, useGetDocumentTypes, useGetEmployeeDocument, useGetTravelDocumentRequest, useVerifyTravelDocument } from "../query/DocumentQuery";
import toast from "react-hot-toast";
import { useForm, type SubmitHandler } from "react-hook-form";

function DocumentVarification() {
    const [selectedPlanId, setSelectedPlanId] = useState<number>();
    const [selectedEmployee, setSelectedEmployee] = useState<TravelEmployeeType>();
    const [openModal, setOpenModal] = useState(false);
    const [url, setUrl] = useState<string>();
    const { data: travelPlans = [] } = useGetTravelPlan();
    const { data: travelDocumentRequests = [], isLoading } = useGetTravelDocumentRequest(selectedEmployee?.employeeId!);
    const { data: document, refetch } = useGetDocumentByUrl(url!);
    const verifyMutation = useVerifyTravelDocument();

    const selectedPlan: TravelPlanType | undefined = travelPlans.find(t => t.travelPlanId === selectedPlanId);

    const remainingDocuments = useMemo(() => {
        const submittedIds = travelDocumentRequests.map(d => d.documentTypeId);
        return selectedPlan?.documentTypes.filter(doc => !submittedIds.includes(doc.documentTypeId));
    }, [selectedPlan, travelDocumentRequests]);

    const openEmployeeModal = (employee: TravelEmployeeType) => { setSelectedEmployee(employee); setOpenModal(true); };
    const [openAdd, setOpenAdd] = useState<number>();
    const { data: providedDocuments } = useGetProvidedDocument({ travelPlanId: selectedPlanId!, employeeId: selectedEmployee?.employeeId! })
    const addProvidedMutation = useAddProvidedDocument();
    const {register, handleSubmit, reset} = useForm<{documentTypeId:number,file:FileList}>();
    const {data:documents} = useGetDocumentTypes();

    useEffect(() => {
        if (document != undefined)
            window.open(URL.createObjectURL(document!), '_blank')
    }, [document])
    useEffect(() => {
        if (url != undefined)
            refetch()
    }, [url])
    // console.log(error)

    const onSubmit: SubmitHandler<{documentTypeId:number,file:FileList}> = (data) =>{
        const formData = new FormData();
        formData.append('documentTypeId',data.documentTypeId.toString());
        formData.append('employeeId', openAdd?.toString()!);
        formData.append('travelPlanId', selectedPlan?.travelPlanId.toString()!);
        formData.append('file', data.file[0]);

        addProvidedMutation.mutate(formData, {
            onSuccess: (data) => {
                toast.success(data.message);
                reset();
                setOpenAdd(undefined);
            }
        })
    }
    return (
        <>
            <Card className="mb-6">
                <h5 className="text-lg font-semibold mb-3">Select Travel Plan</h5>
                <Select value={selectedPlanId} onChange={e => setSelectedPlanId(Number(e.target.value))}>
                    <option value="">Select Travel Plan</option>
                    {travelPlans.map(plan => <option key={plan.travelPlanId} value={plan.travelPlanId}>{plan.title}</option>)}
                </Select>
            </Card>

            {selectedPlan && (
                <Card>
                    <h5 className="text-md font-semibold mb-4">Employees in {selectedPlan.title}</h5>
                    <Table>
                        <TableHead>
                            <TableHeadCell>Name</TableHeadCell>
                            <TableHeadCell>Email</TableHeadCell>
                            <TableHeadCell>Action</TableHeadCell>
                        </TableHead>
                        <TableBody>
                            {selectedPlan.travelEmployees.map(emp =>
                                <TableRow key={emp.employeeId}>
                                    <TableCell>{emp.firstName} {emp.lastName}</TableCell>
                                    <TableCell>{emp.email}</TableCell>
                                    <TableCell><Button size="xs" onClick={() => openEmployeeModal(emp)}>Show Documents</Button></TableCell>
                                    <TableCell><Button size='xs' onClick={() => setOpenAdd(emp.employeeId)}>Add Document</Button></TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
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
                                            <p className="text-xs text-gray-500">Employee Document ID: {doc.employeeDocumentId}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            {doc.documentStatus === "Uploaded" && (
                                                <>
                                                    <Button size="xs" color="green" onClick={() => verifyMutation.mutate({
                                                        docRequestId: doc.employeeTravelDocumentId, status: "Verified"
                                                    },
                                                        {
                                                            onSuccess: data => toast.success(data.message)
                                                        }
                                                    )}>Verify</Button>
                                                    <Button size="xs" color="red" onClick={() => verifyMutation.mutate(
                                                        { docRequestId: doc.employeeTravelDocumentId, status: "Reupload" },
                                                        {
                                                            onSuccess: data => toast.success(data.message),
                                                            onError: error => console.log(error)
                                                        }
                                                    )}>Reupload</Button>
                                                    <Button size="xs" color="blue" onClick={() => setUrl(doc.employeeDocumentUrl)}>View</Button>
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
                                    <Button size="xs" color="blue" onClick={()=>setUrl(doc.documentUrl)}>
                                        View
                                    </Button>
                                </div>
                            ))
                        )}
                    </Card>
                </ModalBody>
                <ModalFooter><Button color="gray" onClick={() => setOpenModal(false)}>Close</Button></ModalFooter>
            </Modal>

            <Modal show={openAdd!=undefined}>
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
                    <Button onClick={()=>setOpenAdd(undefined)}>Cancel</Button>
                </div>
                </form>
            </Modal>
        </>
    );
}

export default DocumentVarification;