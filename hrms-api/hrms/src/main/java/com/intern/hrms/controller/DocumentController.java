package com.intern.hrms.controller;

import com.intern.hrms.commonResponse.SuccessResponse;
import com.intern.hrms.dto.travel.request.EmployeeDocumentRequestDTO;
import com.intern.hrms.dto.travel.request.ProvidedTravelDocumentRequestDTO;
import com.intern.hrms.dto.travel.request.TravelDocumentSubmitRequestDTO;
import com.intern.hrms.dto.travel.response.EmployeeTravelDocumentResponseDTO;
import com.intern.hrms.dto.travel.response.ProvidedTravelDocumetnResponseDTO;
import com.intern.hrms.entity.travel.EmployeeDocument;
import com.intern.hrms.enums.DocumentStatusEnum;
import com.intern.hrms.service.travel.EmployeeDocumentService;
import com.intern.hrms.service.travel.TravelDocumentService;
import io.swagger.v3.oas.annotations.tags.Tag;
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
public class DocumentController {

    private final EmployeeDocumentService employeeDocumentService;
    private final TravelDocumentService travelDocumentService;

    public DocumentController(EmployeeDocumentService employeeDocumentService, TravelDocumentService travelDocumentService) {
        this.employeeDocumentService = employeeDocumentService;
        this.travelDocumentService = travelDocumentService;
    }

    @PostMapping(value = "/provided", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<SuccessResponse<Object>> addProvidedTravelDocument(ProvidedTravelDocumentRequestDTO providedTravelDocumentRequestDTO, Principal principal){
        travelDocumentService.submitProvidedDocument(providedTravelDocumentRequestDTO, principal.getName());
        return ResponseEntity.ok(
                new SuccessResponse<>("Document Provided to Employee for Travel", null)
        );
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<SuccessResponse<EmployeeDocument>> addDocument(@Validated EmployeeDocumentRequestDTO employeeDocumentRequestDTO)  {
        EmployeeDocument document = employeeDocumentService.addEmployeeDocument(employeeDocumentRequestDTO);
        return ResponseEntity.ok(
                new SuccessResponse<>("Document Uploaded Successfully", null)
        );
    }

    @PostMapping("/submit")
    public ResponseEntity<SuccessResponse<Object>> submitDocumentRequest(@RequestBody TravelDocumentSubmitRequestDTO dto){
        travelDocumentService.submitDocumentRequest(dto);
        return ResponseEntity.ok(
                new SuccessResponse<>("Document Submitted Successfully", null)
        );
    }

    @PutMapping("/resubmit/{employeeTravelDocumentId}")
    public ResponseEntity<SuccessResponse<Object>> reSubmitDocumentRequest(@PathVariable int employeeTravelDocumentId){
        travelDocumentService.reSubmitDocumentRequest(employeeTravelDocumentId);
        return ResponseEntity.ok(
                new SuccessResponse<>("Document Submitted Successfully", null)
        );
    }

    @PatchMapping("verify/{employeeTravelDocumentId}/{status}")
    public ResponseEntity<SuccessResponse<Object>> verifyDocumentRequest(@PathVariable int employeeTravelDocumentId,
                                                                         @PathVariable DocumentStatusEnum status,
                                                                         @RequestBody(required = false) String remark,
                                                                         Principal principal){
        travelDocumentService.verifyDocumentRequest(principal.getName(), employeeTravelDocumentId, status, remark);
        return ResponseEntity.ok(
                new SuccessResponse<>("Travel Document verified Successfully by " + principal.getName(), null)
        );
    }

    @GetMapping("request/{employeeId}")
    public ResponseEntity<SuccessResponse<List<EmployeeTravelDocumentResponseDTO>>> getDocumentRequest(@PathVariable int employeeId){
        return ResponseEntity.ok(
                new SuccessResponse<>(null, travelDocumentService.getAllDocumentRequest(employeeId))
        );
    }

    @GetMapping("/provided/{travelPlan}/{employeeId}")
    public ResponseEntity<SuccessResponse<List<ProvidedTravelDocumetnResponseDTO>>> getProvideDocumentByEmployee(@PathVariable int travelPlan, @PathVariable int employeeId){
        return ResponseEntity.ok(
                new SuccessResponse<>(null, travelDocumentService.getProvideDocumentByEmployee(travelPlan, employeeId))
        );
    }

    @GetMapping("/url/")
    public ResponseEntity<String> getDocumentByUrl(@RequestParam String url) throws IOException{
//        Resource response = employeeDocumentService.getDocumentByUrl(url);
//        String type = Files.probeContentType(response.getFile().toPath());
//        return ResponseEntity.ok().contentType(MediaType.parseMediaType(type)).body(response);
        return ResponseEntity.ok(employeeDocumentService.getDocumentByUrl(url));
    }

    @PutMapping(value = "/{documentId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<SuccessResponse<Object>> updateEmployeeDocument(@PathVariable int documentId, MultipartFile file){
        employeeDocumentService.updateEmployeeDocument(documentId, file);
        return  ResponseEntity.ok(
                new SuccessResponse<>("Document Updated Successfully", null)
        );
    }

}
