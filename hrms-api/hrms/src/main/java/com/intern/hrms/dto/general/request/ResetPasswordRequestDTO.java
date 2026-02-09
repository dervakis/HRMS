package com.intern.hrms.dto.general.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetPasswordRequestDTO {
    @NotNull(message = "there should be not null token")
    @NotBlank(message = "token can not be blank")
    private String token;
    @NotBlank(message = "Blank password not allowed")
    @NotNull(message = "password can not be null")
    @Size(min = 6, max = 30, message = "password should in range 6 to 30 char")
    private String newPassword;
}
