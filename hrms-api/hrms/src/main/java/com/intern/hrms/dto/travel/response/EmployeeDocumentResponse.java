package com.intern.hrms.dto.travel.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class EmployeeDocumentResponse {
    private int employeeDocumentId;
    private String documentUrl;
    private LocalDate uploadedAt;
    private int documentTypeId;
    private String documentTypeName;
}
