package com.intern.hrms.dto.game.response;

import com.intern.hrms.dto.travel.response.EmployeeResponseDTO;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InterestedEmployeeResponseDTO {
    private int employeeInterestId;
    private int slotPlayed;
    private EmployeeResponseDTO employee;
}
