package com.intern.hrms.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class HasPermission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int HasPermissionId;
    @ManyToOne
    @JoinColumn(name = "RoleId", nullable = false)
    private Role Role;
    @ManyToOne
    @JoinColumn(name = "PermissionId", nullable = false)
    private Permission Permission;
    @ManyToOne
    @JoinColumn(name = "PermissionTypeId", nullable = false)
    private PermissionType PermissionType;
}
