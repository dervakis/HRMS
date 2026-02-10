package com.intern.hrms.controller;

import com.intern.hrms.commonResponse.SuccessResponse;
import com.intern.hrms.entity.travel.DocumentType;
import com.intern.hrms.service.DocumentTypeService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/document-type")
@Tag(name = "Document Type Controller", description = "Endpoint for Document type")
@Validated
public class DocumentTypeController {

    private final DocumentTypeService documentTypeService;

    public DocumentTypeController(DocumentTypeService documentTypeService) {
        this.documentTypeService = documentTypeService;
    }

    @GetMapping
    public ResponseEntity<SuccessResponse<List<DocumentType>>> getAllType(){
        List<DocumentType> documentTypes = documentTypeService.getDocumentTypes();
        return ResponseEntity.ok(
                new SuccessResponse<List<DocumentType>>(null,documentTypes)
        );
    }

    @PostMapping("/{documentTypeName}")
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<SuccessResponse<DocumentType>> addType(
           @NotBlank(message = "Value should not be null for type")
           @Size(max = 20, message = "length should be < 20")
           @PathVariable String documentTypeName
    ){
        DocumentType type = documentTypeService.createDocumentType(documentTypeName);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                new SuccessResponse<DocumentType>("Document Type Added",type)
        );
    }
}
