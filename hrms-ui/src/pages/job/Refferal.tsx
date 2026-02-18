import React from 'react'
import { useSelector } from 'react-redux';
import type { RootStateType } from '../../redux-store/store';
import { useGetJobReferralByEmployee } from '../../query/JobQuery';
import { Card } from 'flowbite-react';

function Refferal() {
    const user = useSelector((state: RootStateType) => state.user);
    const { data: myReferrals } = useGetJobReferralByEmployee(user.userId);

    return (
        <div className="grid grid-cols-3 gap-6">
            {myReferrals?.map((ref) => (
                <Card key={ref.jobReferralId} className="shadow-md border border-gray-200">
                    <h5>Referral Code : </h5><small>{ref.jobReferralId}</small>
                    <div className="mt-3 text-sm text-gray-700 space-y-1">
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
                            <span className="font-medium">Status:</span>{" "}
                            {ref.referralStatus}
                        </p>
                    </div>
                </Card>
            ))}
        </div>
    )
}

export default Refferal