package com.intern.hrms.entity.travel;

import com.intern.hrms.entity.Employee;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class ProvidedTravelDocument {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pk_provided_travel_document_id")
    private int providedTravelDocumentId;
    private LocalDate date;
    private String documentUrl;

    @ManyToOne
    @JoinColumn(name = "fk_document_type_id")
    private DocumentType documentType;

    @ManyToOne
    @JoinColumn(name = "fk_provider_id") //hr provide this ticket and etc..
    private Employee provider;

    @ManyToOne
    @JoinColumn(name = "fk_travel_employee_id")
    private TravelEmployee travelEmployee;

    public ProvidedTravelDocument(String documentUrl, DocumentType documentType, Employee provider, TravelEmployee travelEmployee) {
        this.documentUrl = documentUrl;
        this.documentType = documentType;
        this.provider = provider;
        this.travelEmployee = travelEmployee;
        this.date = LocalDate.now();
    }
}
