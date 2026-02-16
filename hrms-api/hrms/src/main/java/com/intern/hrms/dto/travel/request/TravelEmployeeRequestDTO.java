package com.intern.hrms.dto.travel.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TravelEmployeeRequestDTO {
    @NotNull(message = "Must specify travel id")
    private Integer travelPlanId;
    private List<Integer> employeeIds;
}
