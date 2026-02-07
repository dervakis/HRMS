package com.intern.hrms.security;

import com.intern.hrms.entity.Employee;
import com.intern.hrms.service.EmployeeService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class SpringUserDetailService implements UserDetailsService {

    private final EmployeeService employeeService;

    public SpringUserDetailService(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Employee employee = employeeService.getByEmail(username);
        return new SpringUserDetail(employee.getEmail(), employee.getPassword(), employee.getRole().getRoleName());
    }
}
