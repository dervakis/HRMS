package com.intern.hrms.repository;

import com.intern.hrms.entity.Employee;
import com.intern.hrms.entity.travel.ProvidedTravelDocument;
import com.intern.hrms.entity.travel.TravelPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProvidedTravelDocumentRepository extends JpaRepository<ProvidedTravelDocument, Integer> {
    List<ProvidedTravelDocument> findAllByTravelEmployee_Employee(Employee travelEmployeeEmployee);

    List<ProvidedTravelDocument> findAllByTravelEmployee_EmployeeAndTravelEmployee_TravelPlan(Employee travelEmployeeEmployee, TravelPlan travelEmployeeTravelPlan);
}
