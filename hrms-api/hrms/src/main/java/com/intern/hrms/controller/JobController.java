package com.intern.hrms.controller;

import com.intern.hrms.commonResponse.SuccessResponse;
import com.intern.hrms.dto.job.request.JobReferralRequestDTO;
import com.intern.hrms.dto.job.request.JobRequestDTO;
import com.intern.hrms.dto.job.response.JobReferralResponseDTO;
import com.intern.hrms.dto.job.response.JobResponseDTO;
import com.intern.hrms.entity.job.Job;
import com.intern.hrms.entity.job.JobReferral;
import com.intern.hrms.service.job.JobService;
import com.intern.hrms.validation.Create;
import com.intern.hrms.validation.Update;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("api/job")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @PostMapping
    public ResponseEntity<SuccessResponse<Object>> createJob(@Validated(Create.class) JobRequestDTO dto, Principal principal){
        jobService.createJob(dto, principal.getName());
        return ResponseEntity.ok(
                new SuccessResponse<>("Job Created Successfully", null)
        );
    }
    @PatchMapping
        public ResponseEntity<SuccessResponse<Object>> updateJob(@Validated(Update.class) JobRequestDTO dto){
        jobService.updateJob(dto);
        return ResponseEntity.ok(
                new SuccessResponse<>("Job Updated Successfully", null)
        );
    }

    @PatchMapping("/{jobId}/{isOpen}")
    public ResponseEntity<SuccessResponse<Object>>manageJobStatus(@PathVariable int jobId,@PathVariable boolean isOpen){
        jobService.jobStatus(isOpen, jobId);
        return ResponseEntity.ok(
                new SuccessResponse<>("Job Status Changed Successfully", null)
        );
    }

    @PostMapping("/referral")
    public ResponseEntity<SuccessResponse<Object>> sendJobReferral(JobReferralRequestDTO dto, Principal principal){
        jobService.sendJobReferral(dto, principal.getName());
        return ResponseEntity.ok(
                new SuccessResponse<>("Referral Sended Successfully", null)
        );

        // mail sending to hr, referral, separatly
    }
    @GetMapping("/referral/{jobId}")
    public ResponseEntity<SuccessResponse<List<JobReferralResponseDTO>>> getJobReferralByJob(@PathVariable int jobId){
        return ResponseEntity.ok(
                new SuccessResponse<>(null, jobService.getJobReferralByJob(jobId))
        );
    }
    @GetMapping("/open")
    public ResponseEntity<SuccessResponse<List<JobResponseDTO>>> getOpenJobs(){
        return ResponseEntity.ok(
                new SuccessResponse<>(null,jobService.getOpenJobs())
        );
    }

    @GetMapping
    public ResponseEntity<SuccessResponse<List<JobResponseDTO>>> getJobs(){
        return ResponseEntity.ok(
                new SuccessResponse<>(null,jobService.getJobs())
        );
    }

}
