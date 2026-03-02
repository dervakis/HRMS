package com.intern.hrms.service.general;

import com.intern.hrms.commonResponse.PaginatedResponse;
import com.intern.hrms.dto.general.request.EmployeeRequestDTO;
import com.intern.hrms.dto.general.request.ResetPasswordRequestDTO;
import com.intern.hrms.dto.general.response.EmployeeDetailResponseDTO;
import com.intern.hrms.dto.general.response.LoginResponseDTO;
import com.intern.hrms.dto.travel.response.EmployeeResponseDTO;
import com.intern.hrms.entity.Department;
import com.intern.hrms.entity.Employee;
import com.intern.hrms.entity.Role;
import com.intern.hrms.entity.game.EmployeeInterest;
import com.intern.hrms.entity.game.Game;
import com.intern.hrms.repository.general.DepartmentRepository;
import com.intern.hrms.repository.general.EmployeeRepository;
import com.intern.hrms.repository.general.RoleRepository;
import com.intern.hrms.repository.game.EmployeeInterestRepository;
import com.intern.hrms.repository.game.GameRepository;
import com.intern.hrms.security.JwtService;
import com.intern.hrms.utility.RandomStringGenerator;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.util.List;

@Service
@Validated
@AllArgsConstructor
public class EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final JwtService jwtService;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;
    private final DepartmentRepository departmentRepository;
    private final RoleRepository roleRepository;
    private final GameRepository gameRepository;
    private final EmployeeInterestRepository employeeInterestRepository;

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
        newEmployee.setManager(employeeRepository.getReferenceById(employeeRequestDTO.getManagerId()));
        String randomPassword = RandomStringGenerator.generateString(10);
        newEmployee.setPassword(passwordEncoder.encode(randomPassword));
        return employeeRepository.save(newEmployee);
    }
    public List<EmployeeResponseDTO> getEmployees(){
        List<Employee> employees =  employeeRepository.findAllByIsDeletedFalse();
        return modelMapper.map(employees, new TypeToken<List<EmployeeResponseDTO>>(){}.getType());
    }

    public Employee getByEmail(String email){
        return employeeRepository.findByEmailAndIsDeletedFalse(email).orElseThrow(
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
        employeeInterestRepository.deleteByEmployee_EmployeeIdAndGame_GameId(employee.getEmployeeId(), gameId);
        return;
    }

    public PaginatedResponse<EmployeeDetailResponseDTO> getEmployees(Integer departmentId, Integer roleId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Employee> employeePage;
        if (departmentId != null && roleId != null) {
            throw new RuntimeException("Filter either by department OR role only.");
        } else if (departmentId != null) {
            employeePage = employeeRepository.findByDepartment_DepartmentIdAndIsDeletedFalse(departmentId, pageable);
        } else if (roleId != null) {
            employeePage = employeeRepository.findByRole_RoleIdAndIsDeletedFalse(roleId, pageable);
        } else {
            employeePage = employeeRepository.findAllByIsDeletedFalse(pageable);
        }
        List<EmployeeDetailResponseDTO> responses = employeePage.getContent().stream().map(employee -> modelMapper.map(employee,EmployeeDetailResponseDTO.class)).toList();

        return new PaginatedResponse<>(
                responses,
                employeePage.getNumber(),
                employeePage.getSize(),
                employeePage.getTotalElements()
        );
    }

    public void updateEmployee(int id, EmployeeRequestDTO dto) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        if(dto.getManagerId() != null){
            Employee manager = employeeRepository.getReferenceById(dto.getManagerId());
            employee.setManager(manager);
        }
        if(dto.getRoleId() != null){
            Role role = roleRepository.getReferenceById(dto.getRoleId());
            employee.setRole(role);
        }
        if(dto.getDepartmentId() != null){
            Department department = departmentRepository.getReferenceById(dto.getDepartmentId());
            employee.setDepartment(department);
        }

        employee.setFirstName(dto.getFirstName());
        employee.setLastName(dto.getLastName());
        employee.setDateOfBirth(dto.getDateOfBirth());
        employee.setJoiningDate(dto.getJoiningDate());
        employee.setEmail(dto.getEmail());
        employeeRepository.save(employee);
    }

    public void deleteEmployee(int employeeId){
        Employee employee = employeeRepository.findById(employeeId).orElseThrow();
        employee.setIsDeleted(true);
        employeeRepository.save(employee);
    }
}
