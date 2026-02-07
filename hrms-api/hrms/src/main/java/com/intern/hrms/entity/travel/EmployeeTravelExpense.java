package com.intern.hrms.entity.travel;

import com.intern.hrms.entity.Employee;
import com.intern.hrms.enums.TravelExpenseStatusEnum;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Table(
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"expenseDate", "fk_travel_expense_type_id", "fk_travel_employee_id"}
        )
)
public class EmployeeTravelExpense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pk_employee_travel_expense_id")
    private int employeeTravelExpenseId;
    private LocalDate createdAt;
    private String expenseDetail;
    @Column(nullable = false)
    private LocalDate expenseDate;
    private double amount;
    private TravelExpenseStatusEnum status;
    private String remark;
    private String proofUrl;
    private LocalDate updatedAt; // approve date, update date, rejection date

    @ManyToOne
    @JoinColumn(name = "fk_approver_employee_id")
    private Employee approver; //hr is approver here

    @ManyToOne
    @JoinColumn(name = "fk_travel_expense_type_id", nullable = false)
    private TravelExpenseType travelExpenseType; //food, fun, hotel, travel

    @ManyToOne
    @JoinColumn(name = "fk_travel_employee_id", nullable = false)
    private TravelEmployee travelEmployee;
}
