package com.intern.hrms.repository;

import com.intern.hrms.entity.travel.EmployeeDocument;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeDocumentRepository extends JpaRepository<EmployeeDocument, Integer> {
}
