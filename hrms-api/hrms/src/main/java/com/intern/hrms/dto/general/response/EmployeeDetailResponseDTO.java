package com.intern.hrms.dto.general.response;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
@Getter
@Setter
public class EmployeeDetailResponseDTO {
    private Integer employeeId;
    private String firstName;
    private String lastName;
    private String email;
    private LocalDate dateOfBirth;
    private LocalDate joiningDate;
    private Integer managerId;
    private Integer departmentId;
    private String departmentName;
    private Integer roleId;
    private String roleName;
    private List<EmployeeDetailResponseDTO> childEmployee = new ArrayList<>();
}
