package com.intern.hrms.entity.travel;

import com.intern.hrms.entity.Employee;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Time;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
public class TravelPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int TravelPlanId;
    private String Title;
    private String Description;
    private LocalDateTime StartTime;
    private LocalDateTime EndTime;

    @ManyToOne
    @JoinColumn(name = "CreatedBy") // hr id who has created plan
    private Employee CreatedBy;

    @ManyToMany //employee are going to travel
    @JoinTable(name = "EmployeeTravel",
    joinColumns = @JoinColumn(name = "TravelPlanId"),
    inverseJoinColumns = @JoinColumn(name = "EmployeeId"))
    private List<Employee> Employees;


}
