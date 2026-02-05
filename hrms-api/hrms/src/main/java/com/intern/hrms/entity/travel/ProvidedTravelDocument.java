package com.intern.hrms.entity.travel;

import com.intern.hrms.entity.Employee;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
public class ProvidedTravelDocument {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int ProvidedTravelDocumentId;
    private LocalDate Date;
    private String DocumentUrl;

    @ManyToOne
    @JoinColumn(name = "DocumentTypeId")
    private DocumentType DocumentType;

    @ManyToOne
    @JoinColumn(name = "ProviderId") //hr provide this ticket and etc..
    private Employee Provider;
}
