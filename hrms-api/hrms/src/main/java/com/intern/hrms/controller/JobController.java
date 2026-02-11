package com.intern.hrms.controller;

import com.intern.hrms.commonResponse.SuccessResponse;
import com.intern.hrms.dto.job.request.JobRequestDTO;
import com.intern.hrms.entity.job.Job;
import com.intern.hrms.service.job.JobService;
import com.intern.hrms.validation.Create;
import com.intern.hrms.validation.Update;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("api/job")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @PostMapping
    public ResponseEntity<SuccessResponse<Job>> createJob(@Validated(Create.class) JobRequestDTO dto, Principal principal){
        return ResponseEntity.ok(
                new SuccessResponse<>("Job Created Successfully", jobService.createJob(dto, principal.getName()))
        );
    }
    @PatchMapping
    public ResponseEntity<SuccessResponse<Job>> updateJob(@Validated(Update.class) JobRequestDTO dto){
        return ResponseEntity.ok(
                new SuccessResponse<>("Job Updated Successfully", jobService.updateJob(dto))
        );
    }
}
