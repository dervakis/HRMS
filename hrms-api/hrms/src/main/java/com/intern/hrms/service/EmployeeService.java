package com.intern.hrms.service;

import com.intern.hrms.entity.Employee;
import com.intern.hrms.repository.EmployeeRepository;
import com.intern.hrms.security.JwtService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final JwtService jwtService;

    public EmployeeService(EmployeeRepository employeeRepository, JwtService jwtService) {
        this.employeeRepository = employeeRepository;
        this.jwtService = jwtService;
    }

    public Employee getByEmail(String email){
        return employeeRepository.findByEmail(email).orElseThrow(
                ()-> new UsernameNotFoundException("User not found with email : "+email)
        );
    }

    public String login(String email, String password){
        String token = jwtService.generateToken(email,password);
        return token;
    }

    public Employee getById(int employeeId){
        return employeeRepository.findById(employeeId).orElseThrow(
                ()-> new UsernameNotFoundException("User not found with Id : "+employeeId)
        );
    }
}
