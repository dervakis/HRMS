package com.intern.hrms.entity.game;

import com.intern.hrms.entity.Employee;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class EmployeeInterest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pk_employee_interest_id")
    private int employeeInterestId;
    private int slotPlayed;
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "fk_game_id")
    private Game game;

    @ManyToOne
    @JoinColumn(name = "fk_employee_id")
    private Employee employee;

    public EmployeeInterest(Game game, Employee employee) {
        this.slotPlayed = 0;
        this.createdAt = LocalDateTime.now();
        this.game = game;
        this.employee = employee;
    }
}
