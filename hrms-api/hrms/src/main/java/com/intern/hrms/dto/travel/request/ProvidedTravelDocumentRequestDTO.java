package com.intern.hrms.dto.travel.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class ProvidedTravelDocumentRequestDTO {
    @Min(1)
    @NotNull(message = "document type can not be null")
    private Integer documentTypeId;
    @NotNull(message = "employee id is mandatory field")
//    private Integer travelEmployeeId;
    private Integer employeeId;
    private Integer travelPlanId;
    private MultipartFile file;
}
