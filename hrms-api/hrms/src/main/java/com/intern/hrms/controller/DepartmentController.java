package com.intern.hrms.controller;

import com.intern.hrms.commonResponse.SuccessResponse;
import com.intern.hrms.entity.Department;
import com.intern.hrms.service.DepartmentService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/department")
@Validated
@Tag(name = "Department Controller", description = "Endpoints for handling department")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @PostMapping("/{departmentName}")
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<SuccessResponse<Department>> addDepartment(@NotBlank(message = "provide appropriate department name")
                                                                        @Size(max = 20, message = "size of department name must be <20")
                                                                        @PathVariable String departmentName){
        Department department = departmentService.createDepartment(departmentName);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                new SuccessResponse<Department>("Department Created Successfully",department)
        );
    }
}
