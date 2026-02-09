package com.intern.hrms.service;

import com.intern.hrms.dto.general.request.EmployeeRequestDTO;
import com.intern.hrms.dto.general.request.ResetPasswordRequestDTO;
import com.intern.hrms.entity.Employee;
import com.intern.hrms.repository.DepartmentRepository;
import com.intern.hrms.repository.EmployeeRepository;
import com.intern.hrms.repository.RoleRepository;
import com.intern.hrms.security.JwtService;
import com.intern.hrms.utility.RandomStringGenerator;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

@Service
@Validated
public class EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final JwtService jwtService;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;
    private final DepartmentRepository departmentRepository;
    private final RoleRepository roleRepository;

    public EmployeeService(EmployeeRepository employeeRepository, JwtService jwtService, ModelMapper modelMapper, PasswordEncoder passwordEncoder, DepartmentRepository departmentRepository, RoleRepository roleRepository) {
        this.employeeRepository = employeeRepository;
        this.jwtService = jwtService;
        this.modelMapper = modelMapper;
        this.passwordEncoder = passwordEncoder;
        this.departmentRepository = departmentRepository;
        this.roleRepository = roleRepository;
    }

    public Employee addEmployee( EmployeeRequestDTO employeeRequestDTO){
        employeeRepository.findByEmail(employeeRequestDTO.getEmail()).ifPresent(
                employee -> {throw  new RuntimeException("Account with given Email already exist : "+employee.getEmail());}
        );
        departmentRepository.findById(employeeRequestDTO.getDepartmentId()).orElseThrow(
                () -> new RuntimeException("No Department found with Id: "+employeeRequestDTO.getDepartmentId())
        );
        roleRepository.findById(employeeRequestDTO.getRoleId()).orElseThrow(
                () -> new RuntimeException("No Role found with Id: "+employeeRequestDTO.getRoleId())
        );

        Employee newEmployee = new Employee();
        modelMapper.map(employeeRequestDTO, newEmployee);
        String randomPassword = RandomStringGenerator.generateString(10);
        newEmployee.setPassword(passwordEncoder.encode(randomPassword));
//        if(employeeRequestDTO.getManagerId())
        return employeeRepository.save(newEmployee);
//        return  newEmployee;
    }

    public Employee getByEmail(String email){
        return employeeRepository.findByEmail(email).orElseThrow(
                ()-> new UsernameNotFoundException("User not found with email : "+email)
        );
    }

    public String login(String email, String password){
        Employee employee = getByEmail(email);
        if(passwordEncoder.matches(password, employee.getPassword())){
            return jwtService.generateToken(email,employee.getPassword());
        }else{
            throw new RuntimeException("Wrong Credential for Login");
        }
    }

    public Employee getById(int employeeId){
        return employeeRepository.findById(employeeId).orElseThrow(
                ()-> new UsernameNotFoundException("User not found with Id : "+employeeId)
        );
    }

    public String requestForgetPassword(String email){
        Employee employee = getByEmail(email);
        return employee.getPassword();
        //remaining to send mail with this token for varificaiton
    }

    public void forgetPassword(String email, ResetPasswordRequestDTO resetPasswordRequestDTO){
        Employee employee = getByEmail(email);
        if(!resetPasswordRequestDTO.getToken().equals(employee.getPassword())){
            throw new RuntimeException("Invalid Token for reset password");
        }
        employee.setPassword(passwordEncoder.encode(resetPasswordRequestDTO.getNewPassword()));
        employeeRepository.save(employee);
    }
}
