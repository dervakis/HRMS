package com.intern.hrms.dto.travel.request;

import com.intern.hrms.entity.Employee;
import com.intern.hrms.entity.travel.DocumentType;
import com.intern.hrms.entity.travel.EmployeeDocument;
import com.intern.hrms.entity.travel.TravelEmployee;
import com.intern.hrms.enums.DocumentStatusEnum;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
@Getter
@Setter
public class TravelDocumentSubmitRequestDTO {
    private Integer employeeTravelDocumentId;
    private Integer employeeId;
    private Integer travelPlanId;
    private Integer documentTypeId;
}
