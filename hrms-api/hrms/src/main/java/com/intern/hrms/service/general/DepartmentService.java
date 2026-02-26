package com.intern.hrms.service.general;

import com.intern.hrms.entity.Department;
import com.intern.hrms.repository.general.DepartmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

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

    public List<Department> getDepartment(){
        return departmentRepository.findAll();
    }
}
