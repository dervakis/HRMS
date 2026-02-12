package com.intern.hrms.controller;

import com.intern.hrms.commonResponse.SuccessResponse;
import com.intern.hrms.dto.general.request.EmployeeRequestDTO;
import com.intern.hrms.dto.general.request.ResetPasswordRequestDTO;
import com.intern.hrms.dto.travel.request.EmployeeDocumentRequestDTO;
import com.intern.hrms.entity.Employee;
import com.intern.hrms.entity.travel.EmployeeDocument;
import com.intern.hrms.service.EmployeeDocumentService;
import com.intern.hrms.service.EmployeeService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springdoc.core.service.GenericResponseService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

@RestController
@RequestMapping("api/employee")
@Tag(name = "Employee Controller", description = "Endpoints for managing Employee")
public class EmployeeController {
    private final EmployeeService employeeService;
    private final Logger logger = Logger.getLogger(EmployeeController.class.getName());

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping("/login")
    public ResponseEntity<SuccessResponse<Map<String, String>>> login(@RequestParam String email, @RequestParam String password){
        String token = employeeService.login(email, password);
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(
                new SuccessResponse<Map<String, String>>("Login successfully", response)
        );
    }

    @GetMapping("/{employeeId}")
    public ResponseEntity<Employee> getEmployeById(@PathVariable int employeeId){
        logger.info("Employee Controller : fetching employee with id - "+employeeId);
        Employee e = employeeService.getById(employeeId);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(e);
    }

    @PostMapping
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<Employee> addEmployee(@Validated @RequestBody EmployeeRequestDTO employeeRequestDTO){
        Employee newEmployee = employeeService.addEmployee(employeeRequestDTO);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(newEmployee);
    }

    @GetMapping("/forget-password/{email}")
    public ResponseEntity<SuccessResponse<Object>> requestForgetPassword(@PathVariable String email){
        String token = employeeService.requestForgetPassword(email);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(
                new SuccessResponse<>("Token for reset Password forwarded to your mail.", null)
        );
        //remaining mail sending,s0 only mail owner get this token
    }

    @PostMapping("forget-password/{email}")
    public ResponseEntity<String> resetPassword(@PathVariable String email, @RequestBody ResetPasswordRequestDTO resetPasswordRequestDTO){
        employeeService.forgetPassword(email,resetPasswordRequestDTO);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body("Password Changed Successfully");
    }
}
