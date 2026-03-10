package com.intern.hrms.repository.travel;

import com.intern.hrms.entity.Employee;
import com.intern.hrms.entity.travel.DocumentType;
import com.intern.hrms.entity.travel.EmployeeTravelDocument;
import com.intern.hrms.entity.travel.TravelEmployee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmployeeTravelDocumentRepository extends JpaRepository<EmployeeTravelDocument, Integer> {
    List<EmployeeTravelDocument> findEmployeeTravelDocumentsByTravelEmployee(TravelEmployee travelEmployee);
    Optional<EmployeeTravelDocument> findByTravelEmployeeAndDocumentType(TravelEmployee travelEmployee, DocumentType documentType);
}
