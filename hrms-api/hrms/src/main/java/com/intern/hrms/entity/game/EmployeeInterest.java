package com.intern.hrms.entity.game;

import com.intern.hrms.entity.Employee;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class EmployeeInterest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int EmployeeInterestId;

    @ManyToOne
    @JoinColumn(name = "GameId")
    private Game Game;

    @ManyToOne
    @JoinColumn(name = "EmployeeId")
    private Employee Employee;
}
