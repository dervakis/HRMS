package com.intern.hrms.controller;

import com.intern.hrms.commonResponse.SuccessResponse;
import com.intern.hrms.dto.travel.request.EmployeeTravelExpenseRequestDTO;
import com.intern.hrms.entity.travel.EmployeeTravelExpense;
import com.intern.hrms.entity.travel.TravelExpenseType;
import com.intern.hrms.enums.TravelExpenseStatusEnum;
import com.intern.hrms.service.TravelExpenseService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("api/expense")
@Tag(name = "Travel Expense Controller", description = "Endpoint to handle Expense")
public class TravelExpenseController {

    private final TravelExpenseService travelExpenseService;

    public TravelExpenseController(TravelExpenseService travelExpenseService) {
        this.travelExpenseService = travelExpenseService;
    }

    @PostMapping("/type")
    public ResponseEntity<SuccessResponse<TravelExpenseType>> addExpenseType(@RequestParam String name, @RequestParam Integer maxAmount){
        return ResponseEntity.ok(
                new SuccessResponse<>("Travel Expense Created Successfully", travelExpenseService.addExpenseType(name, maxAmount))
        );
    }

    @GetMapping("/type")
    public ResponseEntity<SuccessResponse<List<TravelExpenseType>>> getExpenseTypes(){
        return ResponseEntity.ok(
                new SuccessResponse<>(null, travelExpenseService.getExpenseType())
        );
    }
    @PatchMapping("/submit/{employeeTravelExpenseId}")
    public ResponseEntity<SuccessResponse<Object>> submitTravelExpense(@PathVariable int employeeTravelExpenseId){
        travelExpenseService.submitEmployeeExpense(employeeTravelExpenseId);
        return ResponseEntity.ok(
                new SuccessResponse<>("Expense Submitted Successfully", null)
        );
    }

    @PatchMapping("/verify/{employeeTravelExpenseId}/{status}")
    public ResponseEntity<SuccessResponse<Object>> verifyTravelExpense(@PathVariable int employeeTravelExpenseId, @PathVariable TravelExpenseStatusEnum status, Principal principal){
        travelExpenseService.verifyEmployeeExpense(employeeTravelExpenseId, status, principal.getName());
        return ResponseEntity.ok(
                new SuccessResponse<>("Expense Verified Successfully", null)
        );
    }

    @PostMapping()
    public ResponseEntity<SuccessResponse<EmployeeTravelExpense>> addTravelExpense(EmployeeTravelExpenseRequestDTO dto) throws IOException {
        travelExpenseService.draftEmployeeExpense(dto);
        return ResponseEntity.ok(
          new SuccessResponse<>("Travel expense saved successfully", null)
        );
    }

    @GetMapping("/travel-plan/{travelPlanId}")
    public ResponseEntity<SuccessResponse<Object>> getExpenseByTravelPlan(@PathVariable int travelPlanId){
        return ResponseEntity.ok(
                new SuccessResponse<>(null, travelExpenseService.getExpenseByTravelPlan(travelPlanId))
        );
    }
    @GetMapping("/{employeeId}")
    public ResponseEntity<SuccessResponse<Object>> getExpenseByEmployee(@PathVariable int employeeId){
        return ResponseEntity.ok(
                new SuccessResponse<>(null, travelExpenseService.getExpenseByEmployee(employeeId))
        );
    }

}
