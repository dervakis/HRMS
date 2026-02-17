import React, { useState, useMemo } from "react";
import { useGetEmployeeDocuments } from "../query/EmployeeQuery";
import { useGetTravelDocumentRequest, useSubmitTravelDocument } from "../query/DocumentQuery";
import { useGetTravelPlanByEmployee } from "../query/TravelPlanQuery";
import { useSelector } from "react-redux";
import type { RootStateType } from "../redux-store/store";
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
    },{
      onSuccess : (data) => {
        console.log(data);
        setOpenModal(false);
        toast.success(data.message);
        refetch();
      }
    });
  };

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
      }
    }

    return {
      employeeHasDocument: true,
      documentStatus: travelDocRequest.documentStatus,
      actionDate: travelDocRequest.actionDate,
      approverName: travelDocRequest.approver?.firstName,
    }
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-6">
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
                          Action Date:{" "}{new Date(status.actionDate).toLocaleDateString()}
                        </p>
                      )}
                      {status.approverName && (
                        <p className="text-xs text-gray-500">
                          Approved By: {status.approverName}
                        </p>
                      )}
                    </div>
                    <div>
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
                    </div>
                  </div>
                </Card>
              );
            })}
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