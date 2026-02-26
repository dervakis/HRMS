package com.intern.hrms.service.general;

import com.intern.hrms.entity.Role;
import com.intern.hrms.repository.general.RoleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleService {
    private final RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    public Role createRole(String roleName){
        roleRepository.getRolesByRoleName(roleName).ifPresent(
                role -> {throw new RuntimeException("role already exist with name : "+role.getRoleName());}
        );
        return roleRepository.save(new Role(roleName.toUpperCase()));
    }

    public List<Role> getRoles(){
        return roleRepository.findAll();
    }
}
