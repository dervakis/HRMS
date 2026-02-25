package com.intern.hrms.dto.achievement.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class PostRequestDTO {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "isPublic is required")
    private Boolean isPublic;
    private List<String> tags;
    private List<Integer> targetRoleIds;        // Only required if isPublic = false
    private List<Integer> targetDepartmentIds;  // Only required if isPublic = false
    private List<Integer> tagIds;

}
