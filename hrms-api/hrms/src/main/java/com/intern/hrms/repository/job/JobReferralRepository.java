package com.intern.hrms.repository.job;

import com.intern.hrms.entity.job.JobReferral;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface JobReferralRepository extends JpaRepository<JobReferral, UUID> {
    List<JobReferral> findAllByJob_JobId(int jobJobId);

    List<JobReferral> findAllByReferrer_EmployeeId(int referrerEmployeeId);
}
