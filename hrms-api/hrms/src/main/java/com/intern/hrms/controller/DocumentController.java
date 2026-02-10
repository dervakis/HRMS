package com.intern.hrms.controller;

import com.intern.hrms.commonResponse.SuccessResponse;
import com.intern.hrms.dto.travel.request.EmployeeDocumentRequestDTO;
import com.intern.hrms.entity.travel.EmployeeDocument;
import com.intern.hrms.entity.travel.EmployeeTravelDocument;
import com.intern.hrms.service.EmployeeDocumentService;
import com.intern.hrms.service.TravelDocumentService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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

    @PostMapping()
    public ResponseEntity<SuccessResponse<EmployeeDocument>> addDocument(@Validated EmployeeDocumentRequestDTO employeeDocumentRequestDTO) throws IOException {
        EmployeeDocument document = employeeDocumentService.addEmployeeDocument(employeeDocumentRequestDTO);
        return ResponseEntity.ok(
                new SuccessResponse<>("Document Uploaded Successfully", document)
        );
    }
    @PutMapping("request/{employeeTravelDocumentId}")
    public ResponseEntity<SuccessResponse<Object>> submitDocumentRequest(@PathVariable int employeeTravelDocumentId){
        travelDocumentService.submitDocumentRequest(employeeTravelDocumentId);
        return ResponseEntity.ok(
                new SuccessResponse<>("Travel Document request Submitted Successfully", null)
        );
    }
    @GetMapping("request/{employeeId}")
    public ResponseEntity<SuccessResponse<List<EmployeeTravelDocument>>> getDocumentRequest(@PathVariable int employeeId){
        return ResponseEntity.ok(
                new SuccessResponse<>(null, travelDocumentService.getAllDocumentRequest(employeeId))
        );
    }

    @GetMapping("/{documentId}")
    public ResponseEntity<Resource> getEmployeeDocument(@PathVariable int documentId){
        return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(employeeDocumentService.getEmployeeDocument(documentId));
        //for pdf and ohter format handling require
    }

    @PutMapping("/{documentId}")
    public ResponseEntity<SuccessResponse<Object>> updateEmployeeDocument(@PathVariable int documentId, MultipartFile file)throws IOException{
        employeeDocumentService.updateEmployeeDocument(documentId, file);
        return  ResponseEntity.ok(
                new SuccessResponse<>("Documnet Updated Successfully", null)
        );
    }

}
