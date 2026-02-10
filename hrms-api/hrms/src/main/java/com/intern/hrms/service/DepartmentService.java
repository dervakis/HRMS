package com.intern.hrms.service;

import com.intern.hrms.entity.Department;
import com.intern.hrms.repository.DepartmentRepository;
import org.springframework.stereotype.Service;

@Service
public class DepartmentService {
    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    public Department createDepartment(String departmentName){
        departmentRepository.findByDepartmentName(departmentName).ifPresent(
                department -> {throw new RuntimeException("Department Already Exist with this name : "+department.getDepartmentName());}
        );
        return departmentRepository.save(new Department(departmentName.toUpperCase()));
    }
}
