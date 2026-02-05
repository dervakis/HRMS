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
public class EmployeeTravelExpense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int EmployeeTravelExpenseId;
    private LocalDate CreatedAt;
    private String ExpenseTitle;
    private double Amount;
    private TravelExpenseStatusEnum Status;
    private String Remark;
    private String ProofUrl;
    private LocalDate UpdatedAt; // approve date, update date, rejection date

    @ManyToOne
    @JoinColumn(name = "ApproverId")
    private Employee Approver; //hr is approver here

    @ManyToOne
    @JoinColumn(name = "TravelExpenseTypeId")
    private TravelExpenseType TravelExpenseType; //food, fun, hotel, travel

    //travel id bkai
}
