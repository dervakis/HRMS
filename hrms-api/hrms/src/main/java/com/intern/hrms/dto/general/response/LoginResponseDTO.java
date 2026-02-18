package com.intern.hrms.dto.general.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LoginResponseDTO {
    private String authToken;
    private String role;
    private String fullName;
    private String email;
    private Integer userId;

    public LoginResponseDTO(String authToken, String role, String fullName, String email, Integer userId) {
        this.authToken = authToken;
        this.role = role;
        this.fullName = fullName;
        this.email = email;
        this.userId = userId;
    }
}
