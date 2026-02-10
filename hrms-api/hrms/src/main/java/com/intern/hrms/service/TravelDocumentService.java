package com.intern.hrms.service;

import com.intern.hrms.dto.travel.request.TravelDocumentRequestDTO;
import com.intern.hrms.entity.Employee;
import com.intern.hrms.entity.travel.*;
import com.intern.hrms.enums.DocumentStatusEnum;
import com.intern.hrms.repository.*;
import org.springframework.stereotype.Service;

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

    public TravelDocumentService(TravelPlanRepository travelPlanRepository, EmployeeTravelDocumentRepository employeeTravelDocumentRepository, DocumentTypeRepository documentTypeRepository, EmployeeRepository employeeRepository, EmployeeDocumentRepository employeeDocumentRepository) {
        this.travelPlanRepository = travelPlanRepository;
        this.employeeTravelDocumentRepository = employeeTravelDocumentRepository;
        this.documentTypeRepository = documentTypeRepository;
        this.employeeRepository = employeeRepository;
        this.employeeDocumentRepository = employeeDocumentRepository;
    }

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
        travelPlan.getTravelEmployees().forEach(
                travelEmployee -> {
                    createSingleEmployeeTravelDocument(travelEmployee, documentTypes);
                }
        );
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
}
