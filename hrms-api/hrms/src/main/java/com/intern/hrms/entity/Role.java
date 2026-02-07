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
    @Column(name = "pk_role_id")
    private int roleId;
    @Column(nullable = false, unique = true)
    private String roleName;
    //person role
//    @OneToMany(mappedBy = "Role")
//    private List<HasPermission> HasPermissions;

    @OneToMany(mappedBy = "role")
    private  List<Employee> employees;
}
