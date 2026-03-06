package com.intern.hrms.service.travel;

import com.intern.hrms.dto.travel.request.EmployeeDocumentRequestDTO;
import com.intern.hrms.dto.travel.response.EmployeeDocumentResponse;
import com.intern.hrms.entity.Employee;
import com.intern.hrms.entity.travel.DocumentType;
import com.intern.hrms.entity.travel.EmployeeDocument;
import com.intern.hrms.repository.general.DocumentTypeRepository;
import com.intern.hrms.repository.travel.EmployeeDocumentRepository;
import com.intern.hrms.repository.general.EmployeeRepository;
import com.intern.hrms.utility.IFileStorageService;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@Service
@AllArgsConstructor
public class EmployeeDocumentService {

    private final EmployeeRepository employeeRepository;
    private final DocumentTypeRepository documentTypeRepository;
    private final EmployeeDocumentRepository employeeDocumentRepository;
    private final IFileStorageService fileStorageService;
    private final ModelMapper modelMapper;

    public EmployeeDocument addEmployeeDocument(EmployeeDocumentRequestDTO dto){
        Employee employee = employeeRepository.findById(dto.getEmployeeId()).orElseThrow(
                ()-> new RuntimeException("Employee not found with id :"+dto.getEmployeeId())
        );
        DocumentType documentType = documentTypeRepository.findById(dto.getDocumentTypeId()).orElseThrow(
                ()-> new RuntimeException("No such document type found with id: "+dto.getDocumentTypeId())
        );
        String documentUrl = fileStorageService.uploadFile("documents/"+employee.getEmployeeId()+"/", documentType.getDocumentTypeName(), dto.getFile());
        EmployeeDocument document = new EmployeeDocument(documentUrl, LocalDate.now(), documentType, employee);
        return employeeDocumentRepository.save(document);
    }

    public String getDocumentByUrl(String url){
        if(url == null){
            throw new RuntimeException("Requesting resource with null url");
        }
        return fileStorageService.getDocument(url);
    }

    public void updateEmployeeDocument(int employeeDocumentId, MultipartFile file){
        EmployeeDocument employeeDocument= employeeDocumentRepository.findById(employeeDocumentId).orElseThrow(
                ()-> new RuntimeException("No Record found for this document Id : "+employeeDocumentId)
        );
        String newUrl = fileStorageService.updateFile(employeeDocument.getDocumentUrl(), file);
        employeeDocument.setDocumentUrl(newUrl);
        employeeDocument.setUploadedAt(LocalDate.now());
        employeeDocumentRepository.save(employeeDocument);
    }

    public List<EmployeeDocumentResponse> getEmployeeDocuments(int employeeId){
        Employee employee = employeeRepository.findById(employeeId).orElseThrow(
                ()-> new RuntimeException("Employe not exist with id : "+employeeId)
        );
        List<EmployeeDocumentResponse> response = modelMapper.map(employee.getEmployeeDocuments(), new TypeToken<List<EmployeeDocumentResponse>>(){}.getType());
        return response;
    }
}
