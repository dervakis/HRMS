package com.intern.hrms.dto.travel.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TravelDocumentRequestDTO {
    private Integer travelPlanId;
    private List<Integer> documentTypeIds;
}
