package com.intern.hrms.entity.travel;

import com.intern.hrms.entity.Employee;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
public class EmployeeDocument {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int EmployeeDocumentId;
    private String DocumentUrl;
    private LocalDate UploadedAt;

    @ManyToOne
    @JoinColumn(name = "DocumentTypeId")
    private DocumentType DocumentType;

    @ManyToOne
    @JoinColumn(name = "EmployeeId")
    private Employee Employee;

}
