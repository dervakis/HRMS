import React from 'react'
import { useGetJobs } from '../../query/JobQuery'
import { Card } from 'flowbite-react';

function ManageJob() {
    const { data: allJobs } = useGetJobs();
    return (
        <>
            <div className='grid grid-cols-3 gap-6'>
                {allJobs?.map((job) => (
                    <Card key={job.jobId} className='shadow-md border border-gray-200'>
                        <div >
                            <h5 className='text-xl font-semibold text-gray-900'>{job.title}</h5>
                        </div>
                    </Card>
                ))}
            </div>
        </>
    )
}

export default ManageJob