package com.intern.hrms.repository.job;

import com.intern.hrms.entity.job.Job;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Integer> {
    List<Job> findAllByIsOpen(boolean isOpen);
}
