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

    @Query("SELECT e FROM Employee e WHERE MONTH(e.dateOfBirth) = :month AND DAY(e.dateOfBirth) = :day and e.isDeleted = false")
    List<Employee> findByDateOfBirthMonthAndDay(int month, int day);

    @Query("SELECT e FROM Employee e WHERE MONTH(e.joiningDate) = :month AND DAY(e.joiningDate) = :day and e.isDeleted = false")
    List<Employee> findByJoiningDateMonthAndDay(int month, int day);

    Page<Employee> findByDepartment_DepartmentIdAndIsDeletedFalse(int departmentId, Pageable pageable);

    Page<Employee> findByRole_RoleIdAndIsDeletedFalse(int roleId, Pageable pageable);

    List<Employee> findAllByIsDeletedFalse();

    Page<Employee> findAllByIsDeletedFalse(Pageable pageable);

    Optional<Employee> findByEmailAndIsDeletedFalse(String email);
}
