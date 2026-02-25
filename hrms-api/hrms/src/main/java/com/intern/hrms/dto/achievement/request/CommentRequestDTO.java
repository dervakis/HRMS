package com.intern.hrms.dto.achievement.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentRequestDTO {
        @NotBlank
        private String text;
}
