import { useState } from 'react'
import { useGetJobReferralByJob, useGetJobs, useManageReferralStatus } from '../../query/JobQuery'
import { Button, Card, Select } from 'flowbite-react';
import toast from 'react-hot-toast';
import Loader from '../../common/Loader';

function ManageJobReferral() {
    const { data: allJobs, isLoading:jobLoading } = useGetJobs();
    const [selectedJobId, setSelectedJobId] = useState<number>();
    const { data: referrals, refetch: refetchReferral, isLoading:refLoading } = useGetJobReferralByJob(selectedJobId!)
    const statusMutation = useManageReferralStatus();
    const nextStatus = (status: string) => {
        switch (status) {
            case "New":
                return ['Interview', 'Selected', 'Rejected'];
            case 'Interview':
                return ['Selected', 'Rejected'];
            default:
                return [];
        }
    }
    return (
        <>
            <Card className="mb-6">
                <h5 className="text-lg font-semibold mb-3">Select Job</h5>
                <Select value={selectedJobId} onChange={e => setSelectedJobId(Number(e.target.value))}>
                    <option value="">Select Travel Plan</option>
                    {allJobs?.map(job => <option key={job.jobId} value={job.jobId}>{job.title}</option>)}
                </Select>
            </Card>
            <div className="grid md:grid-cols-3 gap-6">
                {referrals?.map((ref) => (
                    <Card key={ref.jobReferralId} className="shadow-md border border-gray-200">
                        <h5>Referral Code : </h5><small>{ref.jobReferralId}</small>
                        <div className="text-sm text-gray-700 ">
                            <p>
                                <span className="font-medium">Name:</span>{" "}
                                {ref.referee}
                            </p>
                            <p>
                                <span className="font-medium">Email:</span>{" "}
                                {ref.refereeEmail}
                            </p>
                            <p>
                                <span className="font-medium">Job Title:</span>{" "}
                                {ref.jobTitle}
                            </p>
                            <p>
                                <span className='font-medium'>Referrer:</span>{" "}
                                {ref.referrer.firstName + ' ' + ref.referrer.lastName}
                            </p>
                            <p>
                                <span className='font-medium'>Email:</span>{" "}
                                {ref.referrer.email}
                            </p>
                            <p className='font-bold'>Status: {ref.referralStatus}</p>
                            <div className='flex gap-2 justify-center'>
                                {nextStatus(ref.referralStatus).length > 0 && nextStatus(ref.referralStatus).map(s =>
                                    <Button key={s} size='xs' onClick={() => {
                                        statusMutation.mutate({ referralId: ref.jobReferralId, status: s }, {
                                            onSuccess: (data) => {
                                                toast.success(data.message);
                                                refetchReferral();
                                            },
                                            onError: (error) => toast.error(error.message)
                                        })
                                    }}>{s}</Button>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
            {(jobLoading || refLoading || statusMutation.isPending) && <Loader/>}
        </>
    )
}

export default ManageJobReferral