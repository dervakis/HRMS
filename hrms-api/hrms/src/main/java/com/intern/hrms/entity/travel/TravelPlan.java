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
    @Column(name = "pk_travel_plan_id")
    private int travelPlanId;
    @Column(nullable = false)
    private String title;
    @Column(nullable = false)
    private String description;
    @Column(nullable = false)
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @ManyToOne
    @JoinColumn(name = "fk_created_by_employee_id", nullable = false) // hr id who has created plan
    private Employee createdBy;

    @OneToMany(mappedBy = "travelPlan")
    private List<TravelEmployee> travelEmployees;

}
