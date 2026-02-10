package com.intern.hrms.repository;

import com.intern.hrms.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Integer> {
    /**
     * find employee via email(unique)
     * @param email
     * @return employee
     */
    Optional<Employee> findByEmail(String email);
}
