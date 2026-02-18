import { useCreateJob, useGetJobs, useManageJobStatus, useUpdateJob } from "../../query/JobQuery"
import { useEffect, useState } from "react"
import type { JobCreateType, JobType } from "../../types/Job"
import { useForm, type SubmitErrorHandler, type SubmitHandler } from "react-hook-form"
import { Badge, Button, Card, FileInput, Label, Modal, ModalBody, ModalFooter, ModalHeader, Spinner, TextInput } from "flowbite-react"
import toast from "react-hot-toast"
import { Plus } from "lucide-react"
import { useGetDocumentByUrl } from "../../query/DocumentQuery"

function ManageJob() {
    const { data: allJobs, refetch: refetchAllJobs } = useGetJobs();
    const [openModal, setOpenModal] = useState<string>();
    const [selectedJob, setSelectedJob] = useState<JobType | null>(null);
    const { register, handleSubmit, reset } = useForm<JobCreateType>();
    const { mutate: createMutate, isPending } = useCreateJob();
    const { mutate: updateMutate, isPending: isPending2 } = useUpdateJob();
    const { mutate: changeStatus } = useManageJobStatus();
    const [url, setUrl] = useState<string>()
    const { data: document, refetch } = useGetDocumentByUrl(url!);
    console.log(allJobs)

    const openAddModal = () => {
        setSelectedJob(null);
        reset();
        setOpenModal("add");
    };
    const openEditModal = (job: JobType) => {
        setSelectedJob(job);
        setOpenModal("edit");
        reset({
            jobId: job.jobId,
            title: job.title,
            salary: job.salary,
            requirement: job.requirement,
            location: job.location
        });
    };
    useEffect(() => {
        if (document != undefined)
            window.open(URL.createObjectURL(document!), '_blank')
    }, [document])
    useEffect(() => {
        if (url != undefined)
            refetch()
    }, [url])
    const onSubmit: SubmitHandler<JobCreateType> = (data) => {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("salary", data.salary.toString());
        formData.append("requirement", data.requirement.toString());
        formData.append("location", data.location);

        if (data.file && data.file.length > 0) {
            formData.append("jobDescription", data.file[0]);
        }

        if (openModal === "edit" && selectedJob) {
            formData.append("jobId", selectedJob.jobId.toString());
            updateMutate(formData, {
                onSuccess: (res) => {
                    toast.success(res.message);
                    refetchAllJobs();
                    setOpenModal(undefined);
                },
                onError: (res) => {
                    console.log(res);
                }
            });
            return;
        }

        createMutate(formData, {
            onSuccess: (res) => {
                toast.success(res.message);
                refetchAllJobs();
                setOpenModal(undefined);
            },
            onError: (res) => {
                console.log(res);
            }
        });
    }
    const onError: SubmitErrorHandler<JobCreateType> = () => {
    }
    const handleJobStatus = (job: JobType) => {
        changeStatus(
            { jobId: job.jobId, isOpen: !job.isOpen },
            {
                onSuccess: (data) => {
                    toast.success(data.message);
                    refetchAllJobs();
                }
            }
        );
    };

    return (
        <>
            <div className='grid grid-cols-3 gap-6'>
                {allJobs?.map((job) => (
                    <Card key={job.jobId} className='shadow-md border border-gray-200'>
                        <div className="flex gap-2 items-center">
                            <h5 className='text-xl font-semibold text-gray-900'>{job.title}</h5>
                            <Badge className="ml-auto" color={job.isOpen ? 'success' : 'failure'}>{job.isOpen ? "Open" : "Closed"}</Badge>
                        </div>

                        <div className="text-xs text-gray-600 space-y-1">
                            <p>Salary: ${job.salary}</p>
                            <p>Requirement: {job.requirement}</p>
                            <p>Location: {job.location}</p>
                            <p>Referrals: {job.referralCount ?? 0}</p>
                        </div>

                        <div className="flex gap-2 items-center">
                            <Button size="sm" color={job.isOpen ? 'red' : 'green'} onClick={()=>handleJobStatus(job) }>{job.isOpen ? 'Close Job' : 'Open Job'}</Button>
                            <Button hidden={job.jobDescriptionUrl == undefined} size="sm" color='blue' onClick={() => {
                                setUrl(job.jobDescriptionUrl);
                                // refetch();
                            }}>
                                View JD</Button>
                            <Button size='sm' color='gray' onClick={() => openEditModal(job)}>Edit</Button>
                        </div>
                    </Card>
                ))}
                <Card
                    onClick={openAddModal}
                    className="flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 hover:bg-gray-50 transition-all"
                >
                    <div className="flex flex-col items-center text-gray-500">
                        <Plus className="size-8 mb-2" />
                        <p>New Job</p>
                    </div>
                </Card>
            </div>

            <Modal show={openModal === "add" || openModal === "edit"} onClose={() => setOpenModal(undefined)}>
                <ModalHeader>
                    {openModal === "edit"
                        ? `Update Job - ${selectedJob?.title}`
                        : "Add New Job"}
                </ModalHeader>
                <form onSubmit={handleSubmit(onSubmit, onError)}>
                    <ModalBody className="space-y-4">
                        <div>
                            <Label>Title</Label>
                            <TextInput {...register("title", { required: true })} />
                        </div>
                        <div>
                            <Label>Salary</Label>
                            <TextInput type="number" {...register("salary", { required: true })} />
                        </div>
                        <div>
                            <Label>Requirement</Label>
                            <TextInput
                                type="number"
                                {...register("requirement", { required: true })}
                            />
                        </div>
                        <div>
                            <Label>Location</Label>
                            <TextInput {...register("location", { required: true })} />
                        </div>
                        <div>
                            <Label>Upload Job Description</Label>
                            <FileInput {...register("file")} />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button type="submit">Save</Button>
                        <Button color="gray" onClick={() => setOpenModal(undefined)}>Cancel</Button>
                    </ModalFooter>
                </form>
            </Modal>
        </>
    )
}
export default ManageJob;