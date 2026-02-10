package com.intern.hrms.dto.travel.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TravelEmployeeRequestDTO {
    @NotBlank(message = "Must specify travel id")
    private Integer travelPlanId;
    private List<Integer> employeeIds;
}
