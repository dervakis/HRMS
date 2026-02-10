package com.intern.hrms.repository;

import com.intern.hrms.entity.Employee;
import com.intern.hrms.entity.travel.EmployeeTravelDocument;
import com.intern.hrms.entity.travel.TravelEmployee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmployeeTravelDocumentRepository extends JpaRepository<EmployeeTravelDocument, Integer> {
    List<EmployeeTravelDocument> findEmployeeTravelDocumentsByTravelEmployeeEmployee(Employee travelEmployeeEmployee);
}
