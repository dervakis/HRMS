package com.intern.hrms.repository.job;

import com.intern.hrms.entity.job.Job;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobRepository extends JpaRepository<Job, Integer> {
}
