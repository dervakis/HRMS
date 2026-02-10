package com.intern.hrms.service;

import com.intern.hrms.dto.travel.request.TravelDocumentRequestDTO;
import com.intern.hrms.entity.travel.*;
import com.intern.hrms.repository.DocumentTypeRepository;
import com.intern.hrms.repository.EmployeeTravelDocumentRepository;
import com.intern.hrms.repository.TravelPlanRepository;
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

    public TravelDocumentService(TravelPlanRepository travelPlanRepository, EmployeeTravelDocumentRepository employeeTravelDocumentRepository, DocumentTypeRepository documentTypeRepository) {
        this.travelPlanRepository = travelPlanRepository;
        this.employeeTravelDocumentRepository = employeeTravelDocumentRepository;
        this.documentTypeRepository = documentTypeRepository;
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
}
