package com.intern.hrms.dto.job.request;

import com.intern.hrms.entity.Employee;
import com.intern.hrms.entity.job.JobReferral;
import com.intern.hrms.validation.Create;
import com.intern.hrms.validation.Update;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class JobRequestDTO {
    @NotNull(message = "Specify Job id", groups = {Update.class})
    private Integer jobId;
    @NotBlank(message = "Job Title is mandatory", groups = {Create.class})
    private String title;
    @NotNull(message = "Salary can't be null", groups = {Create.class})
    @Min(value = 1, message = "Positive Salary allowed", groups = {Create.class, Update.class})
    private Integer salary;
    @Min(value = 1, message = "Positive Value allowed only in req.", groups = {Create.class, Update.class})
    private  Integer requirement;
    @NotNull(message = "Location can't be not null", groups = {Create.class})
    private String location; //remote  or office

    private MultipartFile jobDescription;
}
