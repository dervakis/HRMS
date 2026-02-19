import React, { useEffect, useState } from 'react'
import { useCreateJobReferral, useGetOpenJobs, useShareJob } from '../../query/JobQuery'
import { Badge, Button, Card, FileInput, Label, Modal, ModalBody, ModalFooter, ModalHeader, Spinner, TextInput } from 'flowbite-react';
import type { JobReferralCreateType, JobType } from '../../types/Job';
import { useForm, type SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useGetDocumentByUrl } from '../../query/DocumentQuery';

function OpenJob() {
    const { data: openJobs } = useGetOpenJobs();
    const { mutate: createReferral, isPending } = useCreateJobReferral();
    const [openModal, setOpenModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState<JobType | null>(null);
    const { register, handleSubmit, reset } = useForm<JobReferralCreateType>();
    const [url, setUrl] = useState<string>()
    const { data: document, refetch } = useGetDocumentByUrl(url!);
    const openReferralModal = (job: JobType) => {
        setSelectedJob(job);
        setOpenModal(true);
        reset();
    };
    useEffect(() => {
        if (document != undefined)
            window.open(URL.createObjectURL(document!), '_blank')
    }, [document])
    useEffect(() => {
        if (url != undefined)
            refetch()
    }, [url])
    const onSubmit: SubmitHandler<JobReferralCreateType> = (data) => {
        const formData = new FormData();
        formData.append("referee", data.referee);
        formData.append("refereeEmail", data.refereeEmail);
        formData.append("jobId", selectedJob?.jobId.toString()!);
        formData.append("resumeFile", data.file[0]);

        createReferral(formData, {
            onSuccess: (res) => {
                toast.success(res.message);
                setOpenModal(false);
                reset();
            },
            onError: (err) => {
                console.log(err);
            }
        });
    };
    const jobShareMutation = useShareJob();
    const [openShare, setOpenShare] = useState(false);
    const [email, setEmail] = useState<string>();

    return (
        <>
            <div className='grid grid-cols-3 gap-6'>
                {openJobs?.map((job) => (
                    <Card key={job.jobId} className='shadow-md border border-gray-200'>
                        <div className="flex items-center gap-2">
                            <h5 className="text-xl font-semibold text-gray-900">
                                {job.title}
                            </h5>
                            <Badge color="success" className="ml-auto">Open</Badge>
                        </div>
                        <div className="text-xs text-gray-600 space-y-1">
                            <p>Salary: ₹{job.salary}</p>
                            <p>Requirement: {job.requirement}</p>
                            <p>Location: {job.location}</p>
                            <p>Referrals: {job.referralCount ?? 0}</p>
                        </div>
                        <div className="flex gap-2 justify-center mt-3">
                            <Button size="sm" color="blue" onClick={() => openReferralModal(job)}>
                                Refer Candidate
                            </Button>
                            {job.jobDescriptionUrl && (
                                <Button size="sm" color="gray" onClick={() => setUrl(job.jobDescriptionUrl)}>
                                    View JD
                                </Button>
                            )}
                            <Button size='sm' color='blue' onClick={() => { setOpenShare(true); setSelectedJob(job) }}>Share</Button>
                        </div>
                    </Card>
                ))}

                <Modal show={openModal} onClose={() => setOpenModal(false)}>
                    <ModalHeader>
                        Refer Candidate - {selectedJob?.title}
                    </ModalHeader>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <ModalBody className="space-y-4">
                            <div>
                                <Label>Candidate Name</Label>
                                <TextInput {...register("referee", { required: true })} />
                            </div>
                            <div>
                                <Label>Candidate Email</Label>
                                <TextInput type="email" {...register("refereeEmail", { required: true })} />
                            </div>
                            <div>
                                <Label>Upload Resume</Label>
                                <FileInput {...register("file", { required: true })} />
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button type="submit">
                                Submit Referral
                            </Button>
                            <Button color="gray" onClick={() => setOpenModal(false)}>
                                Cancel
                            </Button>
                        </ModalFooter>
                    </form>
                </Modal>

                <Modal show={openShare} onClose={() => setOpenShare(false)}>
                    <ModalHeader>
                        Share Job Opening Detail
                    </ModalHeader>
                    <ModalBody>
                        <div>
                            <Label>Share to Email</Label>
                            <TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color='green' onClick={()=> {
                            jobShareMutation.mutate({jobId:selectedJob?.jobId!, email:email!}, {
                                onSuccess: (res) => {
                                    toast.success(res.message);
                                    setOpenShare(false);
                                    setEmail('');
                                },
                                onError: (error) => toast.error(error.message)
                            })
                        }} disabled={jobShareMutation.isPending}>
                            {jobShareMutation.isPending && <Spinner size='sm'/>}Share
                        </Button>
                        <Button color="gray" onClick={() => setOpenShare(false)}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        </>
    )
}

export default OpenJob;