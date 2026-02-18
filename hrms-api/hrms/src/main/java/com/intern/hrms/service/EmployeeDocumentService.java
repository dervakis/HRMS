package com.intern.hrms.service;

import com.intern.hrms.dto.travel.request.EmployeeDocumentRequestDTO;
import com.intern.hrms.dto.travel.response.EmployeeDocumentResponse;
import com.intern.hrms.entity.Employee;
import com.intern.hrms.entity.travel.DocumentType;
import com.intern.hrms.entity.travel.EmployeeDocument;
import com.intern.hrms.repository.DocumentTypeRepository;
import com.intern.hrms.repository.EmployeeDocumentRepository;
import com.intern.hrms.repository.EmployeeRepository;
import com.intern.hrms.utility.FileStorage;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@Service
public class EmployeeDocumentService {

    private final EmployeeRepository employeeRepository;
    private final DocumentTypeRepository documentTypeRepository;
    private final EmployeeDocumentRepository employeeDocumentRepository;
    private final FileStorage fileStorage;
    private final ModelMapper modelMapper;

    public EmployeeDocumentService(EmployeeRepository employeeRepository, DocumentTypeRepository documentTypeRepository, EmployeeDocumentRepository employeeDocumentRepository, FileStorage fileStorage, ModelMapper modelMapper) {
        this.employeeRepository = employeeRepository;
        this.documentTypeRepository = documentTypeRepository;
        this.employeeDocumentRepository = employeeDocumentRepository;
        this.fileStorage = fileStorage;
        this.modelMapper = modelMapper;
    }

    public EmployeeDocument addEmployeeDocument(EmployeeDocumentRequestDTO employeeDocumentRequestDTO) throws IOException {
        Employee employee = employeeRepository.findById(employeeDocumentRequestDTO.getEmployeeId()).orElseThrow(
                ()-> new RuntimeException("Employee not found with id :"+employeeDocumentRequestDTO.getEmployeeId())
        );
        DocumentType documentType = documentTypeRepository.findById(employeeDocumentRequestDTO.getDocumentTypeId()).orElseThrow(
                ()-> new RuntimeException("No such document type found with id: "+employeeDocumentRequestDTO.getDocumentTypeId())
        );

        String documentUrl = fileStorage.uploadEmployeeDocument(documentType.getDocumentTypeName(), employee.getEmployeeId(), employeeDocumentRequestDTO.getFile());
        EmployeeDocument document = new EmployeeDocument(documentUrl, LocalDate.now(), documentType, employee);
        return employeeDocumentRepository.save(document);
    }

    public Resource getEmployeeDocument(int employeeDocumentId){
        EmployeeDocument employeeDocument= employeeDocumentRepository.findById(employeeDocumentId).orElseThrow(
                ()-> new RuntimeException("No Record found for this document Id : "+employeeDocumentId)
        );
        return fileStorage.getDocument(employeeDocument.getDocumentUrl());
    }

    public Resource getDocumentByUrl(String url){
        System.out.println("coming heere");
        return fileStorage.getDocument(url);
    }

    public void updateEmployeeDocument(int employeeDocumentId, MultipartFile file) throws IOException{
        EmployeeDocument employeeDocument= employeeDocumentRepository.findById(employeeDocumentId).orElseThrow(
                ()-> new RuntimeException("No Record found for this document Id : "+employeeDocumentId)
        );
        fileStorage.UpdateFile(employeeDocument.getDocumentUrl(), file);
    }
    public List<EmployeeDocumentResponse> getEmployeeDocuments(int employeeId){
        Employee employee = employeeRepository.findById(employeeId).orElseThrow(
                ()-> new RuntimeException("Employe not exist with id : "+employeeId)
        );
        List<EmployeeDocumentResponse> response = modelMapper.map(employee.getEmployeeDocuments(), new TypeToken<List<EmployeeDocumentResponse>>(){}.getType());
        return response;
    }
}
