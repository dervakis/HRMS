package com.intern.hrms.controller;

import com.intern.hrms.commonResponse.SuccessResponse;
import com.intern.hrms.entity.Role;
import com.intern.hrms.service.general.RoleService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/role")
@Tag(name = "Role Controller", description = "Endpoints for managing Role")
@Validated
public class RoleController {
    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @GetMapping
    public SuccessResponse<List<Role>> getRoles(){
        return new SuccessResponse<>(null, roleService.getRoles());
    }

    @PostMapping("/{roleName}")
    public Role addRole(@Validated @NotBlank(message = "role name can`t be blank")
                            @NotNull(message = "role name can`t be null")
                            @Size(max = 15, message = "role name must be < 15 char")
            @PathVariable String roleName){
        return roleService.createRole(roleName);
    }
}
