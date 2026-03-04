import React, { useState, useMemo, useEffect } from "react";
import { useGetEmployeeDocuments } from "../../query/EmployeeQuery";
import { useGetDocumentByUrl, useGetTravelDocumentRequest, useReSubmitTravelDocument, useSubmitTravelDocument } from "../../query/DocumentQuery";
import { useGetProvidedDocument, useGetTravelPlanByEmployee } from "../../query/TravelPlanQuery";
import { useSelector } from "react-redux";
import type { RootStateType } from "../../redux-store/Store";
import toast from "react-hot-toast";
import { Badge, Button, Card, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";

function TravelDocument() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedTravelId, setSelectedTravelId] = useState<number>();
  const user = useSelector((state: RootStateType) => state.user);
  const { data: travelPlans = [] } = useGetTravelPlanByEmployee(user.userId);
  const { data: employeeDocs = [] } = useGetEmployeeDocuments(user.userId);
  const { data: travelRequests = [], refetch } = useGetTravelDocumentRequest(user.userId);
  const submitMutation = useSubmitTravelDocument();
  const reSubmitMutation = useReSubmitTravelDocument();
  const docMutation = useGetDocumentByUrl();
  const selectedTravel = useMemo(() => {
    return travelPlans.find(
      (t) => t.travelPlanId === selectedTravelId
    );
  }, [selectedTravelId, travelPlans]);

  const openRequestModal = (travelPlanId: number) => {
    setSelectedTravelId(travelPlanId);
    setOpenModal(true);
  };
  const handleSubmitRequest = (
    travelPlanId: number,
    documentTypeId: number
  ) => {
    submitMutation.mutate({
      employeeId: user.userId,
      travelPlanId,
      documentTypeId,
    }, {
      onSuccess: (data) => {
        console.log(data);
        setOpenModal(false);
        toast.success(data.message);
        refetch();
      }
    });
  };
  const { data: providedDocuments } = useGetProvidedDocument({ travelPlanId: selectedTravelId!, employeeId: user.userId })


  const getDocumentStatus = (travelPlanId: number, documentTypeId: number) => {
    const employeeDocument = employeeDocs.find(
      (doc) => doc.documentTypeId === documentTypeId
    );
    if (!employeeDocument) {
      return {
        employeeHasDocument: false,
        documentStatus: "Not Submitted",
      };
    }

    const travelDocRequest = travelRequests.find(
      (req) =>
        req.travelEmployeeTravelPlanId === travelPlanId &&
        req.documentTypeId === documentTypeId
    );
    if (!travelDocRequest) {
      return {
        employeeHasDocument: true,
        documentStatus: "Pending Submition",
        documentUrl: employeeDocument.documentUrl
      }
    }

    return {
      employeeHasDocument: true,
      documentStatus: travelDocRequest.documentStatus,
      actionDate: travelDocRequest.actionDate,
      approverName: travelDocRequest.approver?.firstName,
      documentUrl: travelDocRequest.employeeDocumentUrl,
      employeeTravelDocumentId: travelDocRequest.employeeTravelDocumentId,
      remark: travelDocRequest.remark
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {travelPlans.map((plan) => (
          <Card key={plan.travelPlanId} className="shadow-md border border-gray-200 cursor-pointer hover:shadow-lg transition-all"
            onClick={() => openRequestModal(plan.travelPlanId)}>
            <h5 className="text-lg font-semibold text-gray-800">{plan.title}</h5>
            <div className="text-sm text-gray-600 mb-3">
              <p>Start:{" "}{new Date(plan.startTime).toLocaleDateString("en-GB")}</p>
              <p>End:{" "}{new Date(plan.endTime).toLocaleDateString("en-GB")}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {plan.documentTypes.map((doc) => {
                const status = getDocumentStatus(
                  plan.travelPlanId,
                  doc.documentTypeId
                )
                return (
                  <Badge key={doc.documentTypeId} color={status.employeeHasDocument ? "success" : "failure"} >
                    {doc.documentTypeName}
                  </Badge>
                )
              })}
            </div>
          </Card>
        ))}
      </div>

      <Modal show={openModal} size="4xl">
        <ModalHeader>Document Requests - {selectedTravel?.title}</ModalHeader>
        <ModalBody>
          <div className="grid gap-4">
            {selectedTravel?.documentTypes.map((doc) => {
              const status = getDocumentStatus(
                selectedTravel.travelPlanId,
                doc.documentTypeId
              );

              return (
                <Card key={doc.documentTypeId} className="border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <h5 className="text-md font-semibold">{doc.documentTypeName}</h5>
                      <p className="text-xs text-gray-500 mt-1">
                        Status:{" "} {status.documentStatus}
                      </p>
                      {status.actionDate && (
                        <p className="text-xs text-gray-500">
                          Action Date:{" "}{new Date(status.actionDate).toLocaleDateString('en-GB')}
                        </p>
                      )}
                      {status.approverName && (
                        <p className="text-xs text-gray-500">
                          Verify By: {status.approverName}
                        </p>
                      )}
                      {status.documentStatus === 'Reupload' && (
                        <p className="text-xs text-gray-500">
                          Remark: {status.remark || '-'}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col md:flex-row gap-2">
                      {status.documentUrl && <Button size="xs" color={'gray'} onClick={() => docMutation.mutate(status.documentUrl, {
                        onSuccess: (url) => {
                          window.open(url, '_blank')
                        }
                      })}>View</Button>}
                      {!status.employeeHasDocument && (
                        <span className="text-xs text-red-500 font-medium">
                          Not Uploaded
                        </span>
                      )}
                      {status.employeeHasDocument &&
                        status.documentStatus ===
                        "Pending Submition" && (
                          <Button size="xs" onClick={() => handleSubmitRequest(selectedTravel.travelPlanId, doc.documentTypeId)}>
                            Submit
                          </Button>
                        )}
                      {status.employeeHasDocument &&
                        status.documentStatus ===
                        "Reupload" && (
                          <Button size="xs" onClick={() => {
                            reSubmitMutation.mutate(status.employeeTravelDocumentId!, {
                              onSuccess: () => {
                                toast.success("Document request re-submitted successfully");
                                refetch();
                              }
                            })
                          }}>Reupload</Button>
                        )}
                    </div>
                  </div>
                </Card>
              );
            })}

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
                      onSuccess: (url) => {
                        window.open(url, '_blank')
                      }
                    })}>
                      View
                    </Button>
                  </div>
                ))
              )}
            </Card>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default TravelDocument;