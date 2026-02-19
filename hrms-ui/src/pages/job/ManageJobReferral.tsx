import React, { useState } from 'react'
import { useGetJobReferralByJob, useGetJobs, useManageJobStatus, useManageReferralStatus } from '../../query/JobQuery'
import { Card, Select } from 'flowbite-react';
import { type JobReferralType } from '../../types/Job';
import toast from 'react-hot-toast';

function ManageJobReferral() {
    const { data: allJobs } = useGetJobs();
    const [selectedJobId, setSelectedJobId] = useState<number>();
    const { data: referrals, refetch: refetchReferral } = useGetJobReferralByJob(selectedJobId!)
    // const [selectedReferral, setSelectedReferral] = useState<JobReferralType>();
    const [status, setStatus] = useState<string>();
    const statusMutation = useManageReferralStatus();
    return (
        <>
            <Card className="mb-6">
                <h5 className="text-lg font-semibold mb-3">Select Job</h5>
                <Select value={selectedJobId} onChange={e => setSelectedJobId(Number(e.target.value))}>
                    <option value="">Select Travel Plan</option>
                    {allJobs?.map(job => <option key={job.jobId} value={job.jobId}>{job.title}</option>)}
                </Select>
            </Card>
            <div className="grid grid-cols-3 gap-6">
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
                                    <p className='font-bold'>Status:</p> {" "}
                                    <Select value={ref.referralStatus} onChange={(e)=>{
                                        statusMutation.mutate({referralId:ref.jobReferralId, status:e.target.value},{
                                            onSuccess: (data) => {
                                                toast.success(data.message);
                                                refetchReferral();
                                            },
                                            onError: (error) => console.log(error)
                                        })
                                    }}>
                                        <option value="New">New</option>
                                         <option value="Interview">Interview</option>
                                          <option value="Selected">Selected</option>
                                           <option value="Rejected">Rejected</option>
                                    </Select>
                                </div>
                            </Card>
                        ))}
                    </div>
        </>
    )
}

export default ManageJobReferral