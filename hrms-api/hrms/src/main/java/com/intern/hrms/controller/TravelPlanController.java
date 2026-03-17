package com.intern.hrms.controller;

import com.intern.hrms.commonResponse.SuccessResponse;
import com.intern.hrms.dto.travel.request.TravelDocumentRequestDTO;
import com.intern.hrms.dto.travel.request.TravelEmployeeRequestDTO;
import com.intern.hrms.dto.travel.request.TravelPlanRequestDTO;
import com.intern.hrms.dto.travel.response.TravelPlanResponseDTO;
import com.intern.hrms.entity.travel.TravelPlan;
import com.intern.hrms.service.travel.TravelDocumentService;
import com.intern.hrms.service.travel.TravelPlanService;
import com.intern.hrms.validation.Update;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("api/travel-plan")
@Tag(name = "Travel Plan Controller", description = "Endpoint for managing Travel Plan")
@AllArgsConstructor
public class TravelPlanController {

    private final TravelPlanService travelPlanService;
    private final TravelDocumentService travelDocumentService;

    @GetMapping
    public ResponseEntity<SuccessResponse<Object>> getTravelPlan(){
        return ResponseEntity.ok(
                new SuccessResponse<>(null, travelPlanService.getTravelPlans())
        );
    }
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<SuccessResponse<List<TravelPlanResponseDTO>>> getTravelPlanByEmployee(@PathVariable int employeeId){
        return ResponseEntity.ok(
                new SuccessResponse<>(null, travelPlanService.getTravelPlansByEmployee(employeeId))
        );
    }
    @GetMapping("/running/{employeeId}")
    public ResponseEntity<SuccessResponse<List<TravelPlanResponseDTO>>> getTravelPlanForExpense(@PathVariable int employeeId){
        return ResponseEntity.ok(
                new SuccessResponse<>(null, travelPlanService.getTravelPlansForExpense(employeeId))
        );
    }

    @PostMapping
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<SuccessResponse<TravelPlanResponseDTO>> addTravelPlan(@Validated @RequestBody TravelPlanRequestDTO travelPlanRequestDTO, Principal principal){
        return ResponseEntity.status(HttpStatus.CREATED).body(
          new SuccessResponse<>("Travel Plan Created", travelPlanService.createTravelPlan(travelPlanRequestDTO, principal.getName()))
        );
    }
    @PutMapping
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<SuccessResponse<TravelPlanResponseDTO>> updateTravelPlan(@Validated(Update.class) @RequestBody TravelPlanRequestDTO travelPlanRequestDTO){
        return ResponseEntity.status(HttpStatus.CREATED).body(
                new SuccessResponse<>("Travel Plan Updated Successfully", travelPlanService.updateTravelPlan(travelPlanRequestDTO))
        );
    }

    @PostMapping("/employee")
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<SuccessResponse<TravelPlanResponseDTO>> manageTravelEmployee(@RequestBody @Validated TravelEmployeeRequestDTO travelEmployeeRequestDTO){
        return ResponseEntity.ok(
                new SuccessResponse<>("Employee Selection Updated Successfully", travelPlanService.manageTravelEmployee(travelEmployeeRequestDTO))
        );
    }

    @PostMapping("/employee-document")
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<SuccessResponse<TravelPlanResponseDTO>> addEmployeeTravelDocument(@RequestBody TravelDocumentRequestDTO travelDocumentRequestDTO){
        return ResponseEntity.ok(
                new SuccessResponse<>("Document Record Updated Successfully", travelDocumentService.createAllEmployeeTravelDocument(travelDocumentRequestDTO))
        );
    }

    @DeleteMapping("/{planId}")
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<SuccessResponse<Object>> deleteTravelPlan(@PathVariable int planId){
        travelPlanService.deleteTravelPlan(planId);
        return ResponseEntity.ok(
                new SuccessResponse<>("Travel Plan Deleted Successfully", null)
        );
    }
}
