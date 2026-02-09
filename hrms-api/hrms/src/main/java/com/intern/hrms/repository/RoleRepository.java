package com.intern.hrms.repository;

import com.intern.hrms.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Integer> {
    /**
     * find role via role name
     * @param roleName
     * @return Role
     */
    Optional<Role> getRolesByRoleName(String roleName);
}
