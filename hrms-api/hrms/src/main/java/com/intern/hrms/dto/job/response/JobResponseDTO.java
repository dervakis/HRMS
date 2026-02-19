package com.intern.hrms.dto.job.response;
import com.intern.hrms.dto.travel.response.EmployeeResponseDTO;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class JobResponseDTO {
    private int jobId;
    private String title;
    private Boolean isOpen;
    private LocalDate openedAt;
    private int salary;
    private int requirement;
    private String location;
    private String jobDescriptionUrl;
    private EmployeeResponseDTO createdBy;
    private Integer referralCount;
}
