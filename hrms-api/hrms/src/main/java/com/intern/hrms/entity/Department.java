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
    private int DepartmentId;
    private String DepartmentName;

    @OneToMany(mappedBy = "Department")
    private List<Employee> Employees;
}
