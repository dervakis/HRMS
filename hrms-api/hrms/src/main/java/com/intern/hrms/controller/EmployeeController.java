package com.intern.hrms.controller;

import com.intern.hrms.commonResponse.SuccessResponse;
import com.intern.hrms.dto.general.request.EmployeeRequestDTO;
import com.intern.hrms.dto.general.request.ResetPasswordRequestDTO;
import com.intern.hrms.dto.general.response.LoginResponseDTO;
import com.intern.hrms.dto.travel.response.EmployeeDocumentResponse;
import com.intern.hrms.dto.travel.response.EmployeeResponseDTO;
import com.intern.hrms.entity.Employee;
import com.intern.hrms.service.EmployeeDocumentService;
import com.intern.hrms.service.EmployeeService;
import com.intern.hrms.utility.MailSend;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

@RestController
@RequestMapping("api/employee")
@Tag(name = "Employee Controller", description = "Endpoints for managing Employee")
public class EmployeeController {
    private final EmployeeService employeeService;
    private final Logger logger = Logger.getLogger(EmployeeController.class.getName());
    private final MailSend mailSend;
    private final EmployeeDocumentService employeeDocumentService;

    public EmployeeController(EmployeeService employeeService, MailSend mailSend, EmployeeDocumentService employeeDocumentService) {
        this.employeeService = employeeService;
        this.mailSend = mailSend;
        this.employeeDocumentService = employeeDocumentService;
    }

    @GetMapping("/login")
    public ResponseEntity<SuccessResponse<LoginResponseDTO>> login(@RequestParam String email, @RequestParam String password){
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(
                new SuccessResponse<>("Login successfully", employeeService.login(email, password))
        );
    }
    @GetMapping("/documents/{employeeId}")
    public ResponseEntity<SuccessResponse<List<EmployeeDocumentResponse>>> getEmployeeDocuments(@PathVariable int employeeId){
        return ResponseEntity.ok(
                new SuccessResponse<>(null, employeeDocumentService.getEmployeeDocuments(employeeId))
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

        mailSend.sendText(email,
                "Reset Password on HRMS Portal",
                """
                        Dear user,
                        
                        Your Reset Password Request is Arrived. Please click below link for set new password.
                        
                        Click: """+"http://localhost:5173/reset-password?token="+token
        );
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(
                new SuccessResponse<>("Token for reset Password forwarded to your mail.", null)
        );
        //remaining mail sending,s0 only mail owner get this token
    }

    @PostMapping("forget-password/{email}")
    public ResponseEntity<SuccessResponse<Object>> resetPassword(@PathVariable String email, @RequestBody ResetPasswordRequestDTO resetPasswordRequestDTO){
        employeeService.forgetPassword(email,resetPasswordRequestDTO);
        return ResponseEntity.ok(
                new SuccessResponse<>("Password Changed Successfully", null)
        );
    }

    @GetMapping
    public ResponseEntity<SuccessResponse<List<EmployeeResponseDTO>>> getEmployees(){
        return ResponseEntity.ok(
                new SuccessResponse<>(null, employeeService.getEmployees())
        );
    }
}
