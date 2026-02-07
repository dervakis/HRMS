package com.intern.hrms.entity.travel;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class DocumentType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "pk_document_type_id")
    private int documentTypeId;
    @Column(nullable = false, unique = true)
    private String documentTypeName;
}
