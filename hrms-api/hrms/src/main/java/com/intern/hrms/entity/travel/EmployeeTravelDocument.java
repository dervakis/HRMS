package com.intern.hrms.entity.travel;

import com.intern.hrms.entity.Employee;
import com.intern.hrms.enums.DocumentStatusEnum;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
public class EmployeeTravelDocument {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int EmployeeTravelDocumentId;
    private LocalDate ActionDate;
    private DocumentStatusEnum DocumentStatus;

    @ManyToOne
    @JoinColumn(name = "TravelPlanId")
    private TravelPlan TravelPlan;

    @ManyToOne
    @JoinColumn(name = "EmployeeId")
    private Employee Employee;

    @ManyToOne
    @JoinColumn(name = "EmployeeDocumentId")
    private EmployeeDocument EmployeeDocument;

    @ManyToOne
    @JoinColumn(name = "ApproverId")
    private Employee Approver; // hr is responsible for approver
}
