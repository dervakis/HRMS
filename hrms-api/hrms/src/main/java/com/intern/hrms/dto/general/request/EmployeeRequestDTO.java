package com.intern.hrms.dto.general.request;

import jakarta.persistence.Column;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter

public class EmployeeRequestDTO {
    @NotNull(message = "first name can't be null")
    @NotBlank(message = "first name can't be blank")
    private String firstName;

    @NotNull(message = "last name can't be null")
    @NotBlank(message = "last name can't be blank")
    private String lastName;

    @Email(message = "Invalid email syntax")
    private String email;

    private LocalDate dateOfBirth;
    @NotNull(message = "specify joining date it's mandatory")
    private LocalDate joiningDate;
    @Null
    @Min(value = 1, message = "manager Id should be > 0")
    private int managerId;
    @Min(value = 1, message = "role id Id should be > 0")
    private int roleId;
    @Null
    @Min(value = 1, message = "department Id should be > 0")
    private int departmentId;
}
