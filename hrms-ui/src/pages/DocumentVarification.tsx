import { Card, Modal, ModalBody, ModalHeader, ModalFooter, Button, Select, Table, Badge, TableHead, TableHeadCell, TableBody, TableRow, TableCell, Spinner } from "flowbite-react";
import React, { useMemo, useState } from "react";
import type { TravelEmployeeType, TravelPlanType } from "../types/TravelPlan";
import { useGetTravelPlan } from "../query/TravelPlanQuery";
import { useGetEmployeeDocument, useGetTravelDocumentRequest, useVerifyTravelDocument } from "../query/DocumentQuery";
import toast from "react-hot-toast";

function DocumentVarification() {
    const [selectedPlanId, setSelectedPlanId] = useState<number>();
    const [selectedEmployee, setSelectedEmployee] = useState<TravelEmployeeType>();
    const [openModal, setOpenModal] = useState(false);
    const [viewModal, setViewModal] = useState<number>();

    const { data: travelPlans = [] } = useGetTravelPlan();
    const { data: travelDocumentRequests = [], isLoading } = useGetTravelDocumentRequest(selectedEmployee?.employeeId!);
    const { data: employeeDocument, isLoading: isLoading2 } = useGetEmployeeDocument(viewModal!);
    const verifyMutation = useVerifyTravelDocument();

    const selectedPlan: TravelPlanType | undefined = travelPlans.find(t => t.travelPlanId === selectedPlanId);

    const remainingDocuments = useMemo(() => {
        const submittedIds = travelDocumentRequests.map(d => d.documentTypeId);
        return selectedPlan?.documentTypes.filter(doc => !submittedIds.includes(doc.documentTypeId));
    }, [selectedPlan, travelDocumentRequests]);

    const openEmployeeModal = (employee: TravelEmployeeType) => { setSelectedEmployee(employee); setOpenModal(true); };

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
                                                    <Button size="xs" color="blue" onClick={() => setViewModal(doc.employeeDocumentId)}>View</Button>
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
                </ModalBody>
                <ModalFooter><Button color="gray" onClick={() => setOpenModal(false)}>Close</Button></ModalFooter>
            </Modal>

            <Modal show={viewModal! > 0} size="7xl" onClose={() => setViewModal(undefined)}>
                <ModalHeader>View Document</ModalHeader>
                <ModalBody>
                    <div className="flex items-center justify-center w-full h-[85vh] bg-gray-100 overflow-hidden">
                        {isLoading2 ? <Spinner /> :
                            <iframe src={employeeDocument ? URL.createObjectURL(employeeDocument) : undefined} title="Document Preview" className="w-full h-full rounded-md border-none" />
                        }
                    </div>
                </ModalBody>
                <ModalFooter><Button color="gray" onClick={() => setViewModal(undefined)}>Close</Button></ModalFooter>
            </Modal>
        </>
    );
}

export default DocumentVarification;