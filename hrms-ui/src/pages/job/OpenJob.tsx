import React from 'react'
import { useGetOpenJobs } from '../../query/JobQuery'
import { Card } from 'flowbite-react';

function OpenJob() {
    const { data: openJobs } = useGetOpenJobs();
    return (
        <>
            <div className='grid grid-cols-3 gap-6'>
                {openJobs?.map((job) => (
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

export default OpenJob