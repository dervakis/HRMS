package com.intern.hrms.repository;

import com.intern.hrms.entity.travel.TravelEmployee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TravelEmployeeRepository extends JpaRepository<TravelEmployee, Integer> {
}
