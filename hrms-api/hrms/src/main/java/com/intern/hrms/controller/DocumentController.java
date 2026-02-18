package com.intern.hrms.controller;

import com.intern.hrms.commonResponse.SuccessResponse;
import com.intern.hrms.dto.travel.request.EmployeeDocumentRequestDTO;
import com.intern.hrms.dto.travel.request.ProvidedTravelDocumentRequestDTO;
import com.intern.hrms.dto.travel.request.TravelDocumentSubmitRequestDTO;
import com.intern.hrms.dto.travel.response.EmployeeTravelDocumentResponseDTO;
import com.intern.hrms.entity.travel.EmployeeDocument;
import com.intern.hrms.entity.travel.EmployeeTravelDocument;
import com.intern.hrms.enums.DocumentStatusEnum;
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

    @PostMapping("/provided")
    public ResponseEntity<SuccessResponse<Object>> addProvidedTravelDocument(ProvidedTravelDocumentRequestDTO providedTravelDocumentRequestDTO, Principal principal) throws IOException{
        travelDocumentService.submitProvidedDocument(providedTravelDocumentRequestDTO, principal.getName());
        return ResponseEntity.ok(
                new SuccessResponse<>("Document Provided to Employee for Travel", null)
        );
    }

    @PostMapping()
    public ResponseEntity<SuccessResponse<EmployeeDocument>> addDocument(@Validated EmployeeDocumentRequestDTO employeeDocumentRequestDTO) throws IOException {
        EmployeeDocument document = employeeDocumentService.addEmployeeDocument(employeeDocumentRequestDTO);
        return ResponseEntity.ok(
                new SuccessResponse<>("Document Uploaded Successfully", null)
        );
    }
//    @PutMapping("request/{employeeTravelDocumentId}")
//    public ResponseEntity<SuccessResponse<Object>> submitDocumentRequest(@PathVariable int employeeTravelDocumentId){
//        travelDocumentService.submitDocumentRequest(employeeTravelDocumentId);
//        return ResponseEntity.ok(
//                new SuccessResponse<>("Travel Document request Submitted Successfully", null)
//        );
//    }
    @PostMapping("/submit")
    public ResponseEntity<SuccessResponse<Object>> submitDocumentRequest(@RequestBody TravelDocumentSubmitRequestDTO dto){
        travelDocumentService.submitDocumentRequest(dto);
        return ResponseEntity.ok(
                new SuccessResponse<>("Document Submitted Successfully", null)
        );
    }
    @PatchMapping("verify/{employeeTravelDocumentId}/{status}")
    public ResponseEntity<SuccessResponse<Object>> verifyDocumentRequest(@PathVariable int employeeTravelDocumentId, @PathVariable DocumentStatusEnum status, Principal principal){
        travelDocumentService.verifyDocumentRequest(principal.getName(), employeeTravelDocumentId,status);
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

    @GetMapping("/{documentId}")
    public ResponseEntity<Resource> getEmployeeDocument(@PathVariable int documentId) throws IOException{
        Resource response = employeeDocumentService.getEmployeeDocument(documentId);
        String type = Files.probeContentType(response.getFile().toPath());
        return ResponseEntity.ok().contentType(MediaType.parseMediaType(type)).body(response);
        //for pdf and ohter format handling require
    }

    @GetMapping("/url/")
    public ResponseEntity<Resource> getDocumentByUrl(@RequestParam String url) throws IOException{
        Resource response = employeeDocumentService.getDocumentByUrl(url);
        String type = Files.probeContentType(response.getFile().toPath());
        return ResponseEntity.ok().contentType(MediaType.parseMediaType(type)).body(response);
    }

    @PutMapping("/{documentId}")
    public ResponseEntity<SuccessResponse<Object>> updateEmployeeDocument(@PathVariable int documentId, MultipartFile file)throws IOException{
        employeeDocumentService.updateEmployeeDocument(documentId, file);
        return  ResponseEntity.ok(
                new SuccessResponse<>("Documnet Updated Successfully", null)
        );
    }

}
