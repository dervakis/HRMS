package com.intern.hrms.repository;

import com.intern.hrms.entity.travel.EmployeeTravelExpense;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeTravelExpenseRepository extends JpaRepository<EmployeeTravelExpense, Integer> {
}
