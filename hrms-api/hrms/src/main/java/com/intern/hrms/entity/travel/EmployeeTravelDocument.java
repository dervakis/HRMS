package com.intern.hrms.entity.travel;

import com.intern.hrms.entity.Employee;
import com.intern.hrms.enums.DocumentStatusEnum;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(
        uniqueConstraints = @UniqueConstraint(columnNames = {"fk_travel_employee_id","fk_document_type_id"})
)
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
    @JoinColumn(name = "fk_document_type_id", nullable = false)
    private DocumentType documentType;

    @ManyToOne
    @JoinColumn(name = "fk_employee_document_id")
    private EmployeeDocument employeeDocument;

    @ManyToOne
    @JoinColumn(name = "fk_approver_employee_id")
    private Employee approver; // hr is responsible for approver

    public EmployeeTravelDocument(TravelEmployee travelEmployee, DocumentType documentType,EmployeeDocument employeeDocument ) {
        this.actionDate = LocalDate.now();
        this.documentStatus = DocumentStatusEnum.Uploaded;
        this.travelEmployee = travelEmployee;
        this.documentType = documentType;
        this.employeeDocument = employeeDocument;
    }
}
