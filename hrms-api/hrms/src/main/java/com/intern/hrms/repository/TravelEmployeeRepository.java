package com.intern.hrms.repository;

import com.intern.hrms.entity.Employee;
import com.intern.hrms.entity.travel.TravelEmployee;
import com.intern.hrms.entity.travel.TravelPlan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TravelEmployeeRepository extends JpaRepository<TravelEmployee, Integer> {
    TravelEmployee findByEmployeeAndTravelPlan(Employee employee, TravelPlan travelPlan);
}
