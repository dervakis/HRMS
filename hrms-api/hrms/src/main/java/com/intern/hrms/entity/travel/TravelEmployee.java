package com.intern.hrms.entity.travel;

import com.intern.hrms.entity.Employee;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(
        uniqueConstraints = @UniqueConstraint(columnNames = {"fk_travel_plan_id", "fk_employee_id"})
)
public class TravelEmployee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pk_travel_employee_id")
    private int travelEmployeeId;

    @ManyToOne
    @JoinColumn(name = "fk_travel_plan_id", nullable = false)
    private TravelPlan travelPlan;

    @ManyToOne
    @JoinColumn(name = "fk_employee_id", nullable = false)
    private Employee employee;
}
