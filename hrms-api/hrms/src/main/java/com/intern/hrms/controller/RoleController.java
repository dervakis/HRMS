package com.intern.hrms.controller;

import com.intern.hrms.entity.Role;
import com.intern.hrms.service.RoleService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/role")
@Tag(name = "Role Controller", description = "Endpoints for managing Role")
public class RoleController {
    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @GetMapping
    public List<Role> getRoles(){
        return roleService.getRoles();
    }

    @PostMapping("/{roleName}")
    public Role addRole(@PathVariable String roleName){
        return roleService.createRole(roleName);
    }
}
