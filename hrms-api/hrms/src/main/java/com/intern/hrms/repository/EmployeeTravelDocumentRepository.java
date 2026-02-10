package com.intern.hrms.repository;

import com.intern.hrms.entity.travel.EmployeeTravelDocument;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeTravelDocumentRepository extends JpaRepository<EmployeeTravelDocument, Integer> {
}
