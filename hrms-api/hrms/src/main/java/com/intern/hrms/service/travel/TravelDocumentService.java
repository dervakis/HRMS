package com.intern.hrms.service.travel;

import com.intern.hrms.dto.travel.request.ProvidedTravelDocumentRequestDTO;
import com.intern.hrms.dto.travel.request.TravelDocumentRequestDTO;
import com.intern.hrms.dto.travel.request.TravelDocumentSubmitRequestDTO;
import com.intern.hrms.dto.travel.response.EmployeeTravelDocumentResponseDTO;
import com.intern.hrms.dto.travel.response.ProvidedTravelDocumetnResponseDTO;
import com.intern.hrms.entity.Employee;
import com.intern.hrms.entity.travel.*;
import com.intern.hrms.enums.DocumentStatusEnum;
import com.intern.hrms.enums.NotificationTypeEnum;
import com.intern.hrms.repository.general.DocumentTypeRepository;
import com.intern.hrms.repository.general.EmployeeRepository;
import com.intern.hrms.repository.travel.*;
import com.intern.hrms.service.general.NotificationService;
import com.intern.hrms.utility.FileStorage;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

/**
 * This service for All travel related document request & varification
 * EmployeeTravelDocument & Provided Travel Document both handled here
 */
@Service
@AllArgsConstructor
public class TravelDocumentService {

    private final TravelPlanRepository travelPlanRepository;
    private final EmployeeTravelDocumentRepository employeeTravelDocumentRepository;
    private final DocumentTypeRepository documentTypeRepository;
    private final EmployeeRepository employeeRepository;
    private final EmployeeDocumentRepository employeeDocumentRepository;
    private final FileStorage fileStorage;
    private final TravelEmployeeRepository travelEmployeeRepository;
    private final ProvidedTravelDocumentRepository providedTravelDocumentRepository;
    private final ModelMapper modelMapper;
    private final NotificationService notificationService;

    public void createAllEmployeeTravelDocument(TravelDocumentRequestDTO travelDocumentRequestDTO){
        TravelPlan travelPlan = travelPlanRepository.findById(travelDocumentRequestDTO.getTravelPlanId()).orElseThrow(
                ()-> new RuntimeException("No such Travel Plan Exist for document Request Id: "+travelDocumentRequestDTO.getTravelPlanId())
        );
        List<DocumentType> documentTypes = documentTypeRepository.findAllById(travelDocumentRequestDTO.getDocumentTypeIds());
        travelPlan.setDocumentTypes(documentTypes);
        travelPlanRepository.save(travelPlan);
    }

    public List<EmployeeTravelDocumentResponseDTO> getAllDocumentRequest(int employeeId){
        Employee employee = employeeRepository.findById(employeeId).orElseThrow(
                ()-> new RuntimeException("No Employee found with this id")
        );
        List<EmployeeTravelDocument> employeeTravelDocuments =  employeeTravelDocumentRepository.findEmployeeTravelDocumentsByTravelEmployeeEmployee(employee);
        return modelMapper.map(employeeTravelDocuments, new TypeToken<List<EmployeeTravelDocumentResponseDTO>>(){}.getType());
    }

    public void submitDocumentRequest(TravelDocumentSubmitRequestDTO dto){
        TravelPlan travelPlan = travelPlanRepository.getReferenceById(dto.getTravelPlanId());
        Employee employee = employeeRepository.getReferenceById(dto.getEmployeeId());
        TravelEmployee travelEmployee = travelEmployeeRepository.findByEmployeeAndTravelPlan(employee, travelPlan);
        DocumentType documentType = documentTypeRepository.getReferenceById(dto.getDocumentTypeId());

        EmployeeDocument employeeDocument = employeeDocumentRepository.findEmployeeDocumentByEmployee_EmployeeIdAndDocumentType_DocumentTypeId(dto.getEmployeeId(), dto.getDocumentTypeId()).orElseThrow(
                ()->new RuntimeException("Employee has not Uploaded Document with specified type")
        );
        employeeTravelDocumentRepository.save(new EmployeeTravelDocument(travelEmployee, documentType, employeeDocument));
    }

    public void reSubmitDocumentRequest(int employeeTravelDocumentId){
        EmployeeTravelDocument request = employeeTravelDocumentRepository.findById(employeeTravelDocumentId).orElseThrow();
        request.setDocumentStatus(DocumentStatusEnum.Uploaded);
        employeeTravelDocumentRepository.save(request);
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
        notificationService.notifyUser(employeeTravelDocument.getTravelEmployee().getEmployee().getEmployeeId(),
                NotificationTypeEnum.TravelDocument,
                "Your Document for Travel Plan "+employeeTravelDocument.getTravelEmployee().getTravelPlan().getTitle()+" has been "+status.name());
    }

    public void submitProvidedDocument(ProvidedTravelDocumentRequestDTO providedTravelDocumentRequestDTO, String username) throws IOException {
        DocumentType type = documentTypeRepository.getReferenceById(providedTravelDocumentRequestDTO.getDocumentTypeId());
        Employee employee = employeeRepository.getReferenceById(providedTravelDocumentRequestDTO.getEmployeeId());
        TravelPlan plan = travelPlanRepository.getReferenceById(providedTravelDocumentRequestDTO.getTravelPlanId());
        TravelEmployee travelEmployee = travelEmployeeRepository.findByEmployeeAndTravelPlan(employee, plan);
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

    public List<ProvidedTravelDocumetnResponseDTO> getProvideDocumentByEmployee(int travelPlanId, int employeeId){
        Employee employee = employeeRepository.getReferenceById(employeeId);
        TravelPlan travelPlan = travelPlanRepository.getReferenceById(travelPlanId);
        List<ProvidedTravelDocument> docs = providedTravelDocumentRepository.findAllByTravelEmployee_EmployeeAndTravelEmployee_TravelPlan(employee, travelPlan);
        return modelMapper.map(docs, new TypeToken<List<ProvidedTravelDocumetnResponseDTO>>(){}.getType());
    }
}
