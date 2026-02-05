package com.intern.hrms.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
public class Permission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int PermissionId;
    private String PermissionName;

    @OneToMany(mappedBy = "Permission")
    private List<HasPermission> HasPermissions;
}
