package com.intern.hrms.repository.general;

import com.intern.hrms.entity.travel.DocumentType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DocumentTypeRepository extends JpaRepository<DocumentType, Integer> {
    Optional<DocumentType> findDocumentTypeByDocumentTypeName(String documentTypeName);
}
