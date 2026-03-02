package com.intern.hrms.repository.general;

import com.intern.hrms.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Integer> {
    /**
     * find employee via email(unique)
     * @param email
     * @return employee
     */
    Optional<Employee> findByEmail(String email);

    Employee getReferenceByEmail(String email);

    @Query("SELECT e FROM Employee e WHERE MONTH(e.dateOfBirth) = :month AND DAY(e.dateOfBirth) = :day")
    List<Employee> findByDateOfBirthMonthAndDay(int month, int day);

    @Query("SELECT e FROM Employee e WHERE MONTH(e.joiningDate) = :month AND DAY(e.joiningDate) = :day")
    List<Employee> findByJoiningDateMonthAndDay(int month, int day);

    Page<Employee> findByDepartment_DepartmentId(int departmentId, Pageable pageable);

    Page<Employee> findByRole_RoleId(int roleId, Pageable pageable);
}
