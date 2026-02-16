package com.intern.hrms.dto.travel.response;


import com.intern.hrms.entity.travel.DocumentType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class TravelPlanResponseDTO {
    private int travelPlanId;
    private String title;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private EmployeeResponseDTO createdBy;
    private List<EmployeeResponseDTO> travelEmployees;
    private List<DocumentType> documentTypes;
}
