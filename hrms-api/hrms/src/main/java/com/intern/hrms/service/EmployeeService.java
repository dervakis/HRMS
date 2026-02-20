package com.intern.hrms.service;

import com.intern.hrms.dto.general.request.EmployeeRequestDTO;
import com.intern.hrms.dto.general.request.ResetPasswordRequestDTO;
import com.intern.hrms.dto.general.response.EmployeeDetailResponseDTO;
import com.intern.hrms.dto.general.response.LoginResponseDTO;
import com.intern.hrms.dto.travel.response.EmployeeResponseDTO;
import com.intern.hrms.entity.Employee;
import com.intern.hrms.entity.game.EmployeeInterest;
import com.intern.hrms.entity.game.Game;
import com.intern.hrms.repository.DepartmentRepository;
import com.intern.hrms.repository.EmployeeRepository;
import com.intern.hrms.repository.RoleRepository;
import com.intern.hrms.repository.game.EmployeeInterestRepository;
import com.intern.hrms.repository.game.GameRepository;
import com.intern.hrms.security.JwtService;
import com.intern.hrms.utility.RandomStringGenerator;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.modelmapper.internal.bytebuddy.description.method.MethodDescription;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.util.List;
import java.util.Stack;

@Service
@Validated
public class EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final JwtService jwtService;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;
    private final DepartmentRepository departmentRepository;
    private final RoleRepository roleRepository;
    private final GameRepository gameRepository;
    private final EmployeeInterestRepository employeeInterestRepository;

    public EmployeeService(EmployeeRepository employeeRepository, JwtService jwtService, ModelMapper modelMapper, PasswordEncoder passwordEncoder, DepartmentRepository departmentRepository, RoleRepository roleRepository, GameRepository gameRepository, EmployeeInterestRepository employeeInterestRepository) {
        this.employeeRepository = employeeRepository;
        this.jwtService = jwtService;
        this.modelMapper = modelMapper;
        this.passwordEncoder = passwordEncoder;
        this.departmentRepository = departmentRepository;
        this.roleRepository = roleRepository;
        this.gameRepository = gameRepository;
        this.employeeInterestRepository = employeeInterestRepository;
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
    public List<EmployeeResponseDTO> getEmployees(){
        List<Employee> employees =  employeeRepository.findAll();
        return modelMapper.map(employees, new TypeToken<List<EmployeeResponseDTO>>(){}.getType());
    }

    public Employee getByEmail(String email){
        return employeeRepository.findByEmail(email).orElseThrow(
                ()-> new UsernameNotFoundException("User not found with email : "+email)
        );
    }

    public LoginResponseDTO login(String email, String password){
        Employee employee = getByEmail(email);
        if(passwordEncoder.matches(password, employee.getPassword())){
            String authToken = jwtService.generateToken(email,employee.getPassword());
            return new LoginResponseDTO(authToken, employee.getRole().getRoleName(), employee.getFirstName()+" "+employee.getLastName(), employee.getEmail(), employee.getEmployeeId());
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

    public EmployeeDetailResponseDTO getOrganisationChartData(int employeeId){
        Employee employee = employeeRepository.findById(employeeId).orElseThrow();
        EmployeeDetailResponseDTO prev = modelMapper.map(employee, EmployeeDetailResponseDTO.class);
        if(employee.getEmployees() != null){
            prev.setChildEmployee(
                    //emp na child emp
                    modelMapper.map(employee.getEmployees(), new TypeToken<List<EmployeeDetailResponseDTO>>(){}.getType())
            );
        }
        Employee parent = employee.getManager();
        while(parent!= null){
            EmployeeDetailResponseDTO tem = modelMapper.map(parent, EmployeeDetailResponseDTO.class);
            tem.getChildEmployee().add(prev);
            prev = tem;
            parent = parent.getManager();
        }
        return prev;
    }
    public void addEmployeeInterest(int gameId, String username){
        Game game = gameRepository.getReferenceById(gameId);
        Employee employee = employeeRepository.getReferenceByEmail(username);
        employeeInterestRepository.save(new EmployeeInterest(game,employee));
        return;
    }
    public void removeEmployeeInterest(int gameId, String username){
        Employee employee = employeeRepository.getReferenceByEmail(username);
        employeeInterestRepository.deleteByEmployee_EmployeeIdAndGame_GameId(gameId, employee.getEmployeeId());
        return;
    }
}
