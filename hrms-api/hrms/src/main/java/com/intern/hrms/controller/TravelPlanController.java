package com.intern.hrms.controller;

import com.intern.hrms.commonResponse.SuccessResponse;
import com.intern.hrms.dto.travel.request.TravelDocumentRequestDTO;
import com.intern.hrms.dto.travel.request.TravelEmployeeRequestDTO;
import com.intern.hrms.dto.travel.request.TravelPlanRequestDTO;
import com.intern.hrms.entity.travel.TravelPlan;
import com.intern.hrms.service.TravelDocumentService;
import com.intern.hrms.service.TravelPlanService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/travel-plan")
@Tag(name = "Travel Plan Controller", description = "Endpoint for managing Travel Plan")
public class TravelPlanController {

    private final TravelPlanService travelPlanService;
    private final TravelDocumentService travelDocumentService;

    public TravelPlanController(TravelPlanService travelPlanService, TravelDocumentService travelDocumentService) {
        this.travelPlanService = travelPlanService;
        this.travelDocumentService = travelDocumentService;
    }

    @PostMapping
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<SuccessResponse<TravelPlan>> addTravelPlan(@Validated @RequestBody TravelPlanRequestDTO travelPlanRequestDTO){
        TravelPlan travelPlan = travelPlanService.createTravelPlan(travelPlanRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(
          new SuccessResponse<TravelPlan>("Travel Plan Created", travelPlan)
        );
    }

    @PostMapping("/employee")
    public ResponseEntity<SuccessResponse<TravelPlan>> manageTravelEmploye(@RequestBody @Validated TravelEmployeeRequestDTO travelEmployeeRequestDTO){
        return ResponseEntity.ok(
                new SuccessResponse<>("Employee Manuplation Done", travelPlanService.manageTravelEmployee(travelEmployeeRequestDTO))
        );
    }

    @PostMapping("/employee-document")
    public ResponseEntity<SuccessResponse<Object>> addEmployeeTravelDocument(@RequestBody TravelDocumentRequestDTO travelDocumentRequestDTO){
        travelDocumentService.createAllEmployeeTravelDocument(travelDocumentRequestDTO);
        return ResponseEntity.ok(
                new SuccessResponse<>("Employee Travel Document Request Created", null)
        );
    }


}
