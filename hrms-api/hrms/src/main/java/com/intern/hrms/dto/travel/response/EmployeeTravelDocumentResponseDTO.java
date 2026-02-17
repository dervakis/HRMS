package com.intern.hrms.dto.travel.response;

import com.intern.hrms.entity.Employee;
import com.intern.hrms.entity.travel.DocumentType;
import com.intern.hrms.entity.travel.EmployeeDocument;
import com.intern.hrms.entity.travel.TravelEmployee;
import com.intern.hrms.enums.DocumentStatusEnum;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class EmployeeTravelDocumentResponseDTO {
    private int employeeTravelDocumentId;
    private LocalDate actionDate;
    private String documentStatus;
    private Integer travelEmployeeEmployeeId;
    private Integer travelEmployeeTravelPlanId;
    private Integer documentTypeId;
    private String documentTypeName;
    private Integer employeeDocumentId;
    private EmployeeResponseDTO approver;
}
