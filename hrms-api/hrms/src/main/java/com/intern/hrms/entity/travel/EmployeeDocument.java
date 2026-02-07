package com.intern.hrms.entity.travel;

import com.intern.hrms.entity.Employee;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Table(
        uniqueConstraints = @UniqueConstraint(columnNames = {"fk_document_type_id","fk_employee_id"})
)
public class EmployeeDocument {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pk_employee_document_id")
    private int employeeDocumentId;
    @Column(nullable = false)
    private String documentUrl;
    @Column(nullable = false)
    private LocalDate uploadedAt;

    @ManyToOne
    @JoinColumn(name = "fk_document_type_id", nullable = false)
    private DocumentType documentType;

    @ManyToOne
    @JoinColumn(name = "fk_employee_id", nullable = false)
    private Employee employee;

}
