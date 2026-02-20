package com.intern.hrms.dto.travel.response;

import com.intern.hrms.entity.Employee;
import com.intern.hrms.entity.travel.TravelEmployee;
import com.intern.hrms.entity.travel.TravelExpenseType;
import com.intern.hrms.enums.TravelExpenseStatusEnum;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class EmployeeTravelExpenseResponseDTO {
    private int employeeTravelExpenseId;
    private LocalDate createdAt;
    private String expenseDetail;
    private LocalDate expenseDate;
    private double amount;
    private String status;
    private String remark;
    private String proofUrl;
    private LocalDate updatedAt;
    private EmployeeResponseDTO approver;
    private TravelExpenseType travelExpenseType;
    private Integer travelEmployeeEmployeeId;
    private Integer travelEmployeeTravelPlanId;
    private String travelEmployeeTravelPlanTitle;
}
