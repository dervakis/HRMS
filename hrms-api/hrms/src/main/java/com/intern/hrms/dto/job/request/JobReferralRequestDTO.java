package com.intern.hrms.dto.job.request;

import com.intern.hrms.entity.Employee;
import com.intern.hrms.entity.job.Job;
import com.intern.hrms.enums.ReferralStatusEnum;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class JobReferralRequestDTO {
    private String referee;
    private String refereeEmail;
    private Integer jobId;
    private MultipartFile resumeFile;
}
