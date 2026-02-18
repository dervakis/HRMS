package com.intern.hrms.dto.travel.request;

import com.intern.hrms.entity.Employee;
import com.intern.hrms.entity.travel.TravelEmployee;
import com.intern.hrms.entity.travel.TravelExpenseType;
import com.intern.hrms.enums.TravelExpenseStatusEnum;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@Getter
@Setter
public class EmployeeTravelExpenseRequestDTO {
    private Integer employeeTravelExpenseId;
    private String expenseDetail;
    private LocalDate expenseDate;
    private Double amount;
    private MultipartFile file;
    private Integer travelExpenseTypeId;
    private Integer EmployeeId;
    private Integer TravelPlanId;
}
