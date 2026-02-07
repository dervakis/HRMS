package com.intern.hrms.controller;

import com.intern.hrms.entity.Employee;
import com.intern.hrms.service.EmployeeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.logging.Logger;

@RestController
@RequestMapping("employee")
public class EmployeeController {
    private final EmployeeService employeeService;
    private final Logger logger = Logger.getLogger(EmployeeController.class.getName());

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping("/login")
    public ResponseEntity<String> login(@RequestParam String email, @RequestParam String password){
        String token = employeeService.login(email, password);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(token);
    }

    @GetMapping("/{employeeId}")
    public ResponseEntity<Employee> getEmployeById(@PathVariable int employeeId){
        logger.info("Employee Controller : fetching employee with id - "+employeeId);
        Employee e = employeeService.getById(employeeId);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(e);
    }
}
