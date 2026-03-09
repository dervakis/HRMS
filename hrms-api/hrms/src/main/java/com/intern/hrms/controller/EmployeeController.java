package com.intern.hrms.controller;

import com.intern.hrms.commonResponse.PaginatedResponse;
import com.intern.hrms.commonResponse.SuccessResponse;
import com.intern.hrms.dto.general.request.EmployeeRequestDTO;
import com.intern.hrms.dto.general.request.ResetPasswordRequestDTO;
import com.intern.hrms.dto.general.response.EmployeeDetailResponseDTO;
import com.intern.hrms.dto.general.response.LoginResponseDTO;
import com.intern.hrms.dto.job.response.JobReferralResponseDTO;
import com.intern.hrms.dto.travel.response.EmployeeDocumentResponse;
import com.intern.hrms.dto.travel.response.EmployeeResponseDTO;
import com.intern.hrms.entity.Employee;
import com.intern.hrms.service.general.ActivityLogService;
import com.intern.hrms.service.travel.EmployeeDocumentService;
import com.intern.hrms.service.general.EmployeeService;
import com.intern.hrms.service.job.JobService;
import com.intern.hrms.utility.MailSend;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.logging.Logger;

@RestController
@RequestMapping("api/employee")
@Tag(name = "Employee Controller", description = "Endpoints for managing Employee")
public class EmployeeController {
    private final EmployeeService employeeService;
    private final Logger logger = Logger.getLogger(EmployeeController.class.getName());
    private final MailSend mailSend;
    private final EmployeeDocumentService employeeDocumentService;
    private final JobService jobService;
    private final ActivityLogService activityLogService;

    public EmployeeController(EmployeeService employeeService, MailSend mailSend, EmployeeDocumentService employeeDocumentService, JobService jobService, ActivityLogService activityLogService) {
        this.employeeService = employeeService;
        this.mailSend = mailSend;
        this.employeeDocumentService = employeeDocumentService;
        this.jobService = jobService;
        this.activityLogService = activityLogService;
    }

    @GetMapping("/login")
    public ResponseEntity<SuccessResponse<LoginResponseDTO>> login(@RequestParam String email,
                                                                   @RequestParam String password,
                                                                   HttpServletRequest request,
                                                                   @RequestHeader("User-Agent") String agent){
        LoginResponseDTO dto = employeeService.login(email, password);
        activityLogService.addLog(request, dto.getEmail(),agent,"LOGGED_IN" );
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(
                new SuccessResponse<>("Login successfully", dto)
        );
    }
    @GetMapping("/documents/{employeeId}")
    public ResponseEntity<SuccessResponse<List<EmployeeDocumentResponse>>> getEmployeeDocuments(@PathVariable int employeeId){
        return ResponseEntity.ok(
                new SuccessResponse<>(null, employeeDocumentService.getEmployeeDocuments(employeeId))
        );
    }

    @GetMapping("/referral/{employeeId}")
    public ResponseEntity<SuccessResponse<List<JobReferralResponseDTO>>> getJobReferralByEmployee(@PathVariable int employeeId){
        return ResponseEntity.ok(
                new SuccessResponse<>(null,jobService.getJobReferralByEmployee(employeeId))
        );
    }

    @GetMapping("/chart/{employeeId}")
    public ResponseEntity<SuccessResponse<EmployeeDetailResponseDTO>> getChartByEmployee(@PathVariable int employeeId){
        return ResponseEntity.ok(
                new SuccessResponse<>(null, employeeService.getOrganisationChartData(employeeId))
        );
    }

    @GetMapping("/{employeeId}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable int employeeId){
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

        mailSend.sendMail(List.of(email), null,
                "Reset Password on HRMS Portal",
                """
                        Dear user,
                        
                        Your Reset Password Request is Arrived. Please click below link for set new password.
                        
                        Click: """+"http://localhost:5173/reset-password?token="+token,
                null
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
    @PostMapping("/interest/{gameId}")
    public ResponseEntity<SuccessResponse<Object>> addEmployeeInterest(@PathVariable int gameId, Principal principal){
        employeeService.addEmployeeInterest(gameId, principal.getName());
        return ResponseEntity.ok(
          new SuccessResponse<>("Employee Interest Added Successfully", null)
        );
    }
    @DeleteMapping("/interest/{gameId}")
    public ResponseEntity<SuccessResponse<Object>> removeEmployeeInterest(@PathVariable int gameId, Principal principal){
        employeeService.removeEmployeeInterest(gameId, principal.getName());
        return ResponseEntity.ok(
                new SuccessResponse<>("Employee Interest Removed", null)
        );
    }

    @GetMapping("/page")
    public ResponseEntity<PaginatedResponse<EmployeeDetailResponseDTO>> getEmployeesPages(
            @RequestParam(required = false) Integer departmentId,
            @RequestParam(required = false) Integer roleId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(employeeService.getEmployees(departmentId, roleId, page, size));
    }

    @GetMapping
    public ResponseEntity<SuccessResponse<List<EmployeeResponseDTO>>> getEmployees(){
        return ResponseEntity.ok(
                new SuccessResponse<>(null, employeeService.getEmployees())
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<Void> update(
            @PathVariable int id,
            @RequestBody @Validated EmployeeRequestDTO request) {
        employeeService.updateEmployee(id, request);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{employeeId}")
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<Void> delete(@PathVariable int employeeId){
        employeeService.deleteEmployee(employeeId);
        return ResponseEntity.noContent().build();
    }
}
