package com.intern.hrms.controller;

import com.intern.hrms.commonResponse.SuccessResponse;
import com.intern.hrms.dto.travel.request.EmployeeDocumentRequestDTO;
import com.intern.hrms.dto.travel.request.ProvidedTravelDocumentRequestDTO;
import com.intern.hrms.dto.travel.request.TravelDocumentSubmitRequestDTO;
import com.intern.hrms.dto.travel.response.EmployeeDocumentResponse;
import com.intern.hrms.dto.travel.response.EmployeeTravelDocumentResponseDTO;
import com.intern.hrms.dto.travel.response.ProvidedTravelDocumetnResponseDTO;
import com.intern.hrms.entity.travel.EmployeeDocument;
import com.intern.hrms.enums.DocumentStatusEnum;
import com.intern.hrms.service.travel.EmployeeDocumentService;
import com.intern.hrms.service.travel.TravelDocumentService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("api/document")
@Tag(name = "Document Controller", description = "Endpoints for managing Document")
@AllArgsConstructor
public class DocumentController {

    private final EmployeeDocumentService employeeDocumentService;
    private final TravelDocumentService travelDocumentService;

    @PostMapping(value = "/provided", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<SuccessResponse<ProvidedTravelDocumetnResponseDTO>> addProvidedTravelDocument(ProvidedTravelDocumentRequestDTO providedTravelDocumentRequestDTO, Principal principal){
        return ResponseEntity.ok(
                new SuccessResponse<>("Document Provided to Employee for Travel", travelDocumentService.submitProvidedDocument(providedTravelDocumentRequestDTO, principal.getName()))
        );
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<SuccessResponse<EmployeeDocumentResponse>> addDocument(@Validated EmployeeDocumentRequestDTO employeeDocumentRequestDTO)  {
        return ResponseEntity.ok(
                new SuccessResponse<>("Document Uploaded Successfully", employeeDocumentService.addEmployeeDocument(employeeDocumentRequestDTO))
        );
    }

    @PostMapping("/submit")
    public ResponseEntity<SuccessResponse<EmployeeTravelDocumentResponseDTO>> submitDocumentRequest(@RequestBody TravelDocumentSubmitRequestDTO dto){
        return ResponseEntity.ok(
                new SuccessResponse<>("Document Submitted Successfully", travelDocumentService.submitDocumentRequest(dto))
        );
    }

    @PutMapping("/resubmit/{employeeTravelDocumentId}")
    public ResponseEntity<SuccessResponse<EmployeeTravelDocumentResponseDTO>> reSubmitDocumentRequest(@PathVariable int employeeTravelDocumentId){
        return ResponseEntity.ok(
                new SuccessResponse<>("Document Submitted Successfully", travelDocumentService.reSubmitDocumentRequest(employeeTravelDocumentId))
        );
    }

    @PreAuthorize("hasRole('HR')")
    @PatchMapping("verify/{employeeTravelDocumentId}/{status}")
    public ResponseEntity<SuccessResponse<EmployeeTravelDocumentResponseDTO>> verifyDocumentRequest(@PathVariable int employeeTravelDocumentId,
                                                                         @PathVariable DocumentStatusEnum status,
                                                                         @RequestBody(required = false) String remark,
                                                                         Principal principal){
        return ResponseEntity.ok(
                new SuccessResponse<>("Travel Document verified Successfully by " + principal.getName(), travelDocumentService.verifyDocumentRequest(principal.getName(), employeeTravelDocumentId, status, remark))
        );
    }

    @GetMapping("request/{planId}/{employeeId}")
    public ResponseEntity<SuccessResponse<List<EmployeeTravelDocumentResponseDTO>>> getDocumentRequest(@PathVariable int planId,@PathVariable int employeeId){
        return ResponseEntity.ok(
                new SuccessResponse<>(null, travelDocumentService.getAllDocumentRequest(employeeId, planId))
        );
    }

    @GetMapping("/provided/{travelPlan}/{employeeId}")
    public ResponseEntity<SuccessResponse<List<ProvidedTravelDocumetnResponseDTO>>> getProvideDocumentByEmployee(@PathVariable int travelPlan, @PathVariable int employeeId){
        return ResponseEntity.ok(
                new SuccessResponse<>(null, travelDocumentService.getProvideDocumentByEmployee(travelPlan, employeeId))
        );
    }

    @GetMapping("/url/")
    public ResponseEntity<String> getDocumentByUrl(@RequestParam String url){
        return ResponseEntity.ok(employeeDocumentService.getDocumentByUrl(url));
    }

    @PutMapping(value = "/{documentId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<SuccessResponse<EmployeeDocumentResponse>> updateEmployeeDocument(@PathVariable int documentId, MultipartFile file){
        return  ResponseEntity.ok(
                new SuccessResponse<>("Document Updated Successfully", employeeDocumentService.updateEmployeeDocument(documentId, file))
        );
    }

}
