package com.intern.hrms.dto.travel.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@Getter
@Setter
public class EmployeeDocumentRequestDTO {
    @Min(value = 1, message = "employee doc id must me > 1")
    private Integer employeeDocumentId;
    @Min(1)
    @NotNull(message = "document type can not be null")
    private Integer documentTypeId;
    @NotNull(message = "employee id is mandatory field")
    private Integer employeeId;
    private MultipartFile file;
}
