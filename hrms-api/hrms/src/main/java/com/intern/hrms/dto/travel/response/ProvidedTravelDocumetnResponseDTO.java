package com.intern.hrms.dto.travel.response;

import com.intern.hrms.entity.Employee;
import com.intern.hrms.entity.travel.DocumentType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ProvidedTravelDocumetnResponseDTO {
    private int providedTravelDocumentId;
    private LocalDate date;
    private Integer documentTypeId;
    private String documentTypeName;
    private String documentUrl;
    private EmployeeResponseDTO provider;
}

