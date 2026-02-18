package com.intern.hrms.dto.job.response;

import com.intern.hrms.dto.travel.response.EmployeeResponseDTO;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class JobReferralResponseDTO {
    private UUID jobReferralId;
    private String referee;
    private String refereeEmail;
    private String resumeUrl;
    private String referralStatus;
    private Integer jobJobId;
    private String jobTitle;
    private EmployeeResponseDTO referrer;
}
