package com.intern.hrms.controller;

import com.intern.hrms.commonResponse.SuccessResponse;
import com.intern.hrms.entity.Department;
import com.intern.hrms.entity.Role;
import com.intern.hrms.service.general.RoleService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @PreAuthorize("hasRole('HR')")
    public Role addRole(@Validated @NotBlank(message = "role name can`t be blank")
                            @NotNull(message = "role name can`t be null")
                            @Size(max = 25, message = "role name must be < 25 char")
            @PathVariable String roleName){
        return roleService.createRole(roleName);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<Role> update(@PathVariable int id, @RequestParam String name) {
        return ResponseEntity.ok(roleService.updateRole(id, name));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        roleService.deleteRole(id);
        return ResponseEntity.noContent().build();
    }
}
