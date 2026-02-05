package com.intern.hrms.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int RoleId;
    private String RoleName;
    //person role
    @OneToMany(mappedBy = "Role")
    private List<HasPermission> HasPermissions;

    @OneToMany(mappedBy = "Role")
    private  List<Employee> Employees;
}
