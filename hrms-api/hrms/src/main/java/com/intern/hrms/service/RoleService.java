package com.intern.hrms.service;

import com.intern.hrms.entity.Role;
import com.intern.hrms.repository.RoleRepository;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.util.List;

@Service
@Validated
public class RoleService {
    private final RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    public Role createRole(@NotBlank(message = "role name can`t be blank")
                           @NotNull(message = "role name can`t be null")
                           @Size(max = 15, message = "role name must be < 15 char") String roleName){
        roleRepository.getRolesByRoleName(roleName).ifPresent(
                role -> {throw new RuntimeException("role already exist with name : "+role.getRoleName());}
        );
        return roleRepository.save(new Role(roleName.toUpperCase()));
    }

    public List<Role> getRoles(){
        return roleRepository.findAll();
    }
}
