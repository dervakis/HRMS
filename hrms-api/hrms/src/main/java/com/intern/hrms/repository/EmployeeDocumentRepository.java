package com.intern.hrms.repository;

import com.intern.hrms.entity.travel.EmployeeDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmployeeDocumentRepository extends JpaRepository<EmployeeDocument, Integer> {
    Optional<EmployeeDocument> findEmployeeDocumentByEmployee_EmployeeIdAndDocumentType_DocumentTypeId(int employeeEmployeeId, int documentTypeDocumentTypeId);
}
