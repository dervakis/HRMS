import { Button, Card, FileInput, Label, Modal, ModalBody, ModalFooter, ModalHeader, Select, Spinner } from 'flowbite-react';
import { Eye, Pencil, Plus, Upload } from 'lucide-react';
import React, {useMemo, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useAddDocument, useGetDocumentByUrl, useGetDocumentTypes } from '../../query/DocumentQuery';
import type { DocumentSubmitType, EmployeeDocumentType } from '../../types/TravelPlan';
import { useGetEmployeeDocuments, useUpdateEmployeeDocument } from '../../query/EmployeeQuery';
import { useSelector } from 'react-redux';
import type { RootStateType } from '../../redux-store/Store';
import toast from 'react-hot-toast';

function EmployeeDocument() {
    const { data: alldocumentTypes } = useGetDocumentTypes(false);
    const user = useSelector((state: RootStateType) => state.user);
    const { data: allEmployeeDocuments, refetch } = useGetEmployeeDocuments(user.userId);
    const addMutation = useAddDocument();
    const docMutation = useGetDocumentByUrl();
    const updateMutation = useUpdateEmployeeDocument();
    const [openModal, setOpenModal] = useState<string>();
    const [selectedDocument, setSelectedDocument] = useState<EmployeeDocumentType | null>(null);
    const { register, handleSubmit, reset, watch } = useForm<DocumentSubmitType>();


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
        if (!data.fileList || data.fileList.length == 0) {
            toast.error('please upload a document')
            return;
        }
        const formData = new FormData();
        formData.append('file', data.fileList[0]);
        if (openModal == 'edit') {
            updateMutation.mutate({
                documentId: selectedDocument?.employeeDocumentId!,
                form: formData
            }, {
                onSuccess: (data) => {
                    toast.success(data.message);
                    setOpenModal(undefined);
                    refetch();
                    reset();
                },
                onError: (err) => toast.error(err.message)
            });
            return;
        }
        formData.append('documentTypeId', data.documentTypeId.toString());
        formData.append('employeeId', user.userId.toString());
        addMutation.mutate(formData, {
            onSuccess: (data) => {
                toast.success(data.message);
                refetch();
                setOpenModal(undefined);
            },
            onError: (error) => {
                toast.error(error.message)
            }
        })
    };

    const availableDocumentTypes = useMemo(() => {
        const uploadedIds = allEmployeeDocuments?.map((d) => d.documentTypeId);
        return alldocumentTypes?.filter((d) => !uploadedIds?.includes(d.documentTypeId));
    }, [allEmployeeDocuments]);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                                <Eye onClick={() => docMutation.mutate(doc.documentUrl,
                                    {
                                        onSuccess: (url) => {
                                            window.open(url, "_blank");
                                        }
                                    }
                                )} size={20} />
                                <Pencil onClick={() => openEditModal(doc)} size={20} />
                            </div>
                        </div>
                        <div className="text-xs text-gray-500">
                            Updated At :{" "}
                            {new Date(doc.uploadedAt).toLocaleDateString("en-GB")}
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
                                <p className="text-sm text-gray-600"> { watch('fileList') ? watch('fileList').item(0)?.name :  'Click to upload document'}</p>
                                <input type="file" hidden {...register("fileList")} className="mt-3"></input>
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