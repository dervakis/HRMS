package com.intern.hrms.service;

import com.intern.hrms.dto.travel.request.ProvidedTravelDocumentRequestDTO;
import com.intern.hrms.dto.travel.request.TravelDocumentRequestDTO;
import com.intern.hrms.entity.Employee;
import com.intern.hrms.entity.travel.*;
import com.intern.hrms.enums.DocumentStatusEnum;
import com.intern.hrms.repository.*;
import com.intern.hrms.utility.FileStorage;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

/**
 * This service for All travel related document request & varification
 * EmployeeTravelDocument & Provided Travel Document both handled here
 */
@Service
public class TravelDocumentService {

    private final TravelPlanRepository travelPlanRepository;
    private final EmployeeTravelDocumentRepository employeeTravelDocumentRepository;
    private final DocumentTypeRepository documentTypeRepository;
    private final EmployeeRepository employeeRepository;
    private final EmployeeDocumentRepository employeeDocumentRepository;
    private final FileStorage fileStorage;
    private final TravelEmployeeRepository travelEmployeeRepository;
    private final ProvidedTravelDocumentRepository providedTravelDocumentRepository;

    public TravelDocumentService(TravelPlanRepository travelPlanRepository, EmployeeTravelDocumentRepository employeeTravelDocumentRepository, DocumentTypeRepository documentTypeRepository, EmployeeRepository employeeRepository, EmployeeDocumentRepository employeeDocumentRepository, FileStorage fileStorage, TravelEmployeeRepository travelEmployeeRepository, ProvidedTravelDocumentRepository providedTravelDocumentRepository) {
        this.travelPlanRepository = travelPlanRepository;
        this.employeeTravelDocumentRepository = employeeTravelDocumentRepository;
        this.documentTypeRepository = documentTypeRepository;
        this.employeeRepository = employeeRepository;
        this.employeeDocumentRepository = employeeDocumentRepository;
        this.fileStorage = fileStorage;
        this.travelEmployeeRepository = travelEmployeeRepository;
        this.providedTravelDocumentRepository = providedTravelDocumentRepository;
    }
    //below both are request for request creation for employee like this many document needs
    public void createSingleEmployeeTravelDocument(TravelEmployee travelEmployee, List<DocumentType> documentTypes){
        List<EmployeeTravelDocument> travelDocuments = new ArrayList<>();
        documentTypes.forEach(type ->{
            travelDocuments.add(new EmployeeTravelDocument(travelEmployee, type));
        });
        employeeTravelDocumentRepository.saveAll(travelDocuments);
    }
    public void createAllEmployeeTravelDocument(TravelDocumentRequestDTO travelDocumentRequestDTO){
        TravelPlan travelPlan = travelPlanRepository.findById(travelDocumentRequestDTO.getTravelPlanId()).orElseThrow(
                ()-> new RuntimeException("No such Travel Plan Exist for document Request Id: "+travelDocumentRequestDTO.getTravelPlanId())
        );
        List<DocumentType> documentTypes = documentTypeRepository.findAllById(travelDocumentRequestDTO.getDocumentTypeIds());
//        travelPlan.getTravelEmployees().forEach(
//                travelEmployee -> {
//                    createSingleEmployeeTravelDocument(travelEmployee, documentTypes);
//                }
//        );
        travelPlan.setDocumentTypes(documentTypes);
        travelPlanRepository.save(travelPlan);
    }
    public List<EmployeeTravelDocument> getAllDocumentRequest(int employeeId){
        Employee employee = employeeRepository.findById(employeeId).orElseThrow(
                ()-> new RuntimeException("No Employee found with this id")
        );
        return  employeeTravelDocumentRepository.findEmployeeTravelDocumentsByTravelEmployeeEmployee(employee);
    }

    public void submitDocumentRequest(int employeeTravelDocumentId){
        EmployeeTravelDocument documentRequest = employeeTravelDocumentRepository.findById(employeeTravelDocumentId).orElseThrow(
                ()-> new RuntimeException("No such travel Document record found for employee, Id "+employeeTravelDocumentId)
        );
        int employeeId = documentRequest.getTravelEmployee().getEmployee().getEmployeeId();
        int documentTypeId = documentRequest.getDocumentType().getDocumentTypeId();

        EmployeeDocument employeeDocument = employeeDocumentRepository.findEmployeeDocumentByEmployee_EmployeeIdAndDocumentType_DocumentTypeId(employeeId, documentTypeId).orElseThrow(
                ()->new RuntimeException("Employee has not Uploaded Document with specified type")
        );

        documentRequest.setDocumentStatus(DocumentStatusEnum.Uploaded);
        documentRequest.setEmployeeDocument(employeeDocument);
        employeeTravelDocumentRepository.save(documentRequest);
    }

    public void verifyDocumentRequest(String username, int employeeTravelDocumentId, DocumentStatusEnum status){
        EmployeeTravelDocument employeeTravelDocument = employeeTravelDocumentRepository.findById(employeeTravelDocumentId).orElseThrow(
                ()-> new RuntimeException("No such travel Document Entry found with Id :"+employeeTravelDocumentId)
        );
        if(employeeTravelDocument.getDocumentStatus() != DocumentStatusEnum.Uploaded){
            throw new RuntimeException("No Verification Allowed Without Document Upload");
        }
        employeeTravelDocument.setApprover(employeeRepository.getReferenceByEmail(username));
        employeeTravelDocument.setDocumentStatus(status);
        employeeTravelDocumentRepository.save(employeeTravelDocument);
    }

    public void submitProvidedDocument(ProvidedTravelDocumentRequestDTO providedTravelDocumentRequestDTO, String username) throws IOException {
        DocumentType type = documentTypeRepository.getReferenceById(providedTravelDocumentRequestDTO.getDocumentTypeId());
        TravelEmployee travelEmployee = travelEmployeeRepository.getReferenceById(providedTravelDocumentRequestDTO.getTravelEmployeeId());
        Employee provider = employeeRepository.getReferenceByEmail(username);
        String url = fileStorage.uploadProvidedDocument(type.getDocumentTypeName(),travelEmployee.getTravelEmployeeId(),providedTravelDocumentRequestDTO.getFile());
        ProvidedTravelDocument providedTravelDocument = new ProvidedTravelDocument(
                url,
                type,
                provider,
                travelEmployee
        );
        providedTravelDocumentRepository.save(providedTravelDocument);
    }
}
