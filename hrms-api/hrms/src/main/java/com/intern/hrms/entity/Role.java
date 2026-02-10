package com.intern.hrms.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
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
    @JsonIgnore
    private  List<Employee> employees;

    public Role(String roleName) {
        this.roleName = roleName;
    }
}
