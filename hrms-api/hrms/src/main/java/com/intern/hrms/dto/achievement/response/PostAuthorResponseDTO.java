package com.intern.hrms.dto.achievement.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class PostAuthorResponseDTO {
    private int employeeId;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String email;
    private LocalDate joiningDate;
    private String department;
    private String role;

    public PostAuthorResponseDTO(int employeeId, String firstName, String lastName, LocalDate dateOfBirth, String email, LocalDate joiningDate, String department, String role) {
        this.employeeId = employeeId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dateOfBirth = dateOfBirth;
        this.email = email;
        this.joiningDate = joiningDate;
        this.department = department;
        this.role = role;
    }
}
