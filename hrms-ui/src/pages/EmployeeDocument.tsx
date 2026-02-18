import { Button, Card, FileInput, Label, Modal, ModalBody, ModalFooter, ModalHeader, Select, Spinner } from 'flowbite-react';
import { Eye, Pencil, Plus, Upload } from 'lucide-react';
import React, { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useAddDocument, useGetDocumentTypes, useGetEmployeeDocument } from '../query/DocumentQuery';
import type { DocumentSubmitType, EmployeeDocumentType } from '../types/TravelPlan';
import { useGetEmployeeDocuments, useUpdateEmployeeDocument } from '../query/EmployeeQuery';
import { useSelector } from 'react-redux';
import type { RootStateType } from '../redux-store/store';
import toast from 'react-hot-toast';

function EmployeeDocument() {
    const { data: alldocumentTypes } = useGetDocumentTypes();
    const user = useSelector((state: RootStateType) => state.user);
    const { data: allEmployeeDocuments, refetch } = useGetEmployeeDocuments(user.userId);
    const { mutate, isPending, isError, error } = useAddDocument();
    const [documentId, setDocumentId] = useState<number>();
    const { data: employeeDocument, isLoading } = useGetEmployeeDocument(documentId!);
    const {mutate:mutate2, isPending:isPending2, isError:isError2, error:error2} = useUpdateEmployeeDocument();

    const [openModal, setOpenModal] = useState<string>();
    const [selectedDocument, setSelectedDocument] = useState<EmployeeDocumentType | null>(null);

    const { register, handleSubmit, reset } = useForm<DocumentSubmitType>();

    const openViewModal = (doc: EmployeeDocumentType) => {
        setDocumentId(doc.employeeDocumentId);
        setSelectedDocument(doc);
        setOpenModal("view");
    };

    const openEditModal = (doc: EmployeeDocumentType) => {
        setSelectedDocument(doc);
        setOpenModal("edit");
        reset({
            documentTypeId: doc.documentTypeId
        });
    };

    const openAddModal = () => {
        setSelectedDocument(null);
        reset();
        setOpenModal("add");
    };

    const onSubmit = (data: DocumentSubmitType) => {
        const formData = new FormData();
        formData.append('file', data.fileList[0]);
        if(openModal == 'edit'){
            mutate2({documentId: data.documentTypeId,
                form: formData
            },{
                onSuccess: (data) => {
                console.log(data);
                toast.success(data.message);
            }
            });
            return;
        }
        formData.append('documentTypeId', data.documentTypeId.toString());
        formData.append('employeeId', user.userId.toString());
        mutate(formData, {
            onSuccess: (data) => {
                console.log(data);
                toast.success(data.message);
                refetch();
            },
            onError: (error) => {
                console.log(error)
            }
        })
        setOpenModal(undefined);
        reset();
    };

    // je no hoy e  j te dekhado
    const availableDocumentTypes = useMemo(() => {
        const uploadedIds = allEmployeeDocuments?.map((d) => d.documentTypeId);
        // console.log(uploadedIds)
        return alldocumentTypes?.filter((d) => !uploadedIds?.includes(d.documentTypeId));
    }, [allEmployeeDocuments]);

    return (
        <>
            <div className="grid grid-cols-4 gap-4">
                {allEmployeeDocuments?.map((doc) => (
                    <Card
                        key={doc.employeeDocumentId}
                        className="shadow-sm border border-gray-200 hover:shadow-md transition-all"
                    >
                        <div className="flex gap-2">
                            <h5 className="text-md font-semibold text-gray-800">
                                {doc.documentTypeName}
                            </h5>
                            <div className='flex ml-auto gap-3'>
                                <Eye onClick={() => openViewModal(doc)} size={20} />
                                <Pencil onClick={() => openEditModal(doc)} size={20} />
                            </div>
                        </div>
                        <div className="text-xs text-gray-500">
                            Updated At :{" "}
                            {new Date(doc.uploadedAt).toLocaleDateString("en-GB", {
                                hour: "numeric",
                                minute: "2-digit",
                            })}
                        </div>
                    </Card>
                ))}

                <Card
                    onClick={openAddModal}
                    className='flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 hover:bg-gray-50 transition-all'
                >
                    <div className='flex flex-col items-center text-gray-500'>
                        <Plus className='size-8 mb-2' />
                        <p>New Document</p>
                    </div>
                </Card>
            </div>

            <Modal show={openModal === "view"} size='7xl'  onClose={() => setOpenModal(undefined)}>
                <ModalHeader>
                    View Document - {selectedDocument?.documentTypeName}
                </ModalHeader>
                <ModalBody>
                    <div className="flex h-120 w-full ">
                        {isLoading ? <Spinner /> :
                            <iframe
                                src={employeeDocument && URL.createObjectURL(employeeDocument!)}
                                title="Document Preview"
                            className="w-full h-full rounded-md object-contain"
                            />
                        }
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="gray" onClick={() => setOpenModal(undefined)}>
                        Close
                    </Button>
                </ModalFooter>
            </Modal>

            <Modal show={openModal === "add" || openModal === "edit"} onClose={() => setOpenModal(undefined)}>
                <ModalHeader>
                    {openModal === "edit"
                        ? `Re-upload Document - ${selectedDocument?.documentTypeName}`
                        : "Add New Document"}
                </ModalHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <ModalBody>
                        {openModal === "add" && (
                            <div className="mb-4">
                                <label className="block mb-2 text-sm font-medium">
                                    Select Document Type
                                </label>
                                <Select {...register("documentTypeId", { required: true })}>
                                    <option value="">Select</option>
                                    {availableDocumentTypes?.map((type) => (
                                        <option key={type.documentTypeId} value={type.documentTypeId}>
                                            {type.documentTypeName}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                        )}
                        <label>
                            <div className="border-2 border-dashed border-blue-300 p-6 rounded-lg text-center cursor-pointer hover:bg-blue-50 transition-all">
                                <Upload className="mx-auto mb-3 text-blue-500" size={32} />
                                <p className="text-sm text-gray-600">Click to upload document</p>
                                <input type="file" hidden {...register("fileList", { required: true })} className="mt-3"></input>
                            </div>
                        </label>
                    </ModalBody>

                    <ModalFooter>
                        <Button type="submit">Save</Button>
                        <Button color="gray" onClick={() => setOpenModal(undefined)}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </form>
            </Modal>
        </>
    )
}

export default EmployeeDocument;