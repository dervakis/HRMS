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
    @Column(name = "pk_employee_travel_document_id")
    private int employeeTravelDocumentId;
    private LocalDate actionDate;
    private DocumentStatusEnum documentStatus;

    @ManyToOne
    @JoinColumn(name = "fk_travel_employee_id", nullable = false)
    private TravelEmployee travelEmployee;

    @ManyToOne
    @JoinColumn(name = "fk_employee_document_id", nullable = false)
    private EmployeeDocument employeeDocument;

    @ManyToOne
    @JoinColumn(name = "fk_approver_employee_id")
    private Employee approver; // hr is responsible for approver
}
