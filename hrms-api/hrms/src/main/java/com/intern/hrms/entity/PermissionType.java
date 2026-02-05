package com.intern.hrms.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
public class PermissionType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int PermissionTypeId;
    private String PermissionTypeName;

    @OneToMany(mappedBy = "PermissionType")
    private List<HasPermission> HasPermissions;
}
