package com.intern.hrms.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pk_department_id")
    private int departmentId;
    @Column(nullable = false, unique = true)
    private String departmentName;

    @OneToMany(mappedBy = "department")
    private List<Employee> employees;
}
