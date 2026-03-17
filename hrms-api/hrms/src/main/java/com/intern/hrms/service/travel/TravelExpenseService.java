package com.intern.hrms.service.travel;

import com.intern.hrms.dto.travel.request.EmployeeTravelExpenseRequestDTO;
import com.intern.hrms.dto.travel.response.EmployeeTravelExpenseResponseDTO;
import com.intern.hrms.entity.Employee;
import com.intern.hrms.entity.travel.EmployeeTravelExpense;
import com.intern.hrms.entity.travel.TravelEmployee;
import com.intern.hrms.entity.travel.TravelExpenseType;
import com.intern.hrms.entity.travel.TravelPlan;
import com.intern.hrms.enums.NotificationTypeEnum;
import com.intern.hrms.enums.TravelExpenseStatusEnum;
import com.intern.hrms.repository.general.EmployeeRepository;
import com.intern.hrms.repository.travel.EmployeeTravelExpenseRepository;
import com.intern.hrms.repository.travel.TravelEmployeeRepository;
import com.intern.hrms.repository.travel.TravelExpenseTypeRepository;
import com.intern.hrms.repository.travel.TravelPlanRepository;
import com.intern.hrms.service.general.NotificationService;
import com.intern.hrms.utility.IFileStorageService;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@AllArgsConstructor
public class TravelExpenseService {

    private final TravelExpenseTypeRepository travelExpenseTypeRepository;
    private final ModelMapper modelMapper;
    private final EmployeeTravelExpenseRepository employeeTravelExpenseRepository;
    private final TravelEmployeeRepository travelEmployeeRepository;
    private final IFileStorageService fileStorageService;
    private final EmployeeRepository employeeRepository;
    private final TravelPlanRepository travelPlanRepository;
    private final NotificationService notificationService;

    public TravelExpenseType addExpenseType(String type, int maxAmount){
        travelExpenseTypeRepository.findByTravelExpenseTypeName(type).ifPresent(
                (expenseType) -> {throw new RuntimeException("Expense type already exist");}
        );
        return travelExpenseTypeRepository.save(new TravelExpenseType(type.toUpperCase(), maxAmount));
    }

    public List<TravelExpenseType> getExpenseType(){
        return travelExpenseTypeRepository.findAll();
    }

    public EmployeeTravelExpenseResponseDTO draftEmployeeExpense(EmployeeTravelExpenseRequestDTO dto) {
        EmployeeTravelExpense expense =  dto.getEmployeeTravelExpenseId() != null
                ? employeeTravelExpenseRepository.findById(dto.getEmployeeTravelExpenseId()).orElseThrow()
                : new EmployeeTravelExpense();
        Employee employee = employeeRepository.getReferenceById(dto.getEmployeeId());
        TravelPlan travelPlan = travelPlanRepository.getReferenceById(dto.getTravelPlanId());
        TravelEmployee travelEmployee = travelEmployeeRepository.findByEmployeeAndTravelPlan(employee, travelPlan);
        TravelExpenseType expenseType = travelExpenseTypeRepository.findById(dto.getTravelExpenseTypeId()).orElseThrow();

        expense.setExpenseDate(dto.getExpenseDate());
        expense.setExpenseDetail(dto.getExpenseDetail());
        expense.setAmount(dto.getAmount());
        expense.setTravelExpenseType(expenseType);
        expense.setTravelEmployee(travelEmployee);

        if(expense.getExpenseDate().isBefore(travelEmployee.getTravelPlan().getStartTime().toLocalDate())
        || expense.getExpenseDate().isAfter(travelEmployee.getTravelPlan().getEndTime().toLocalDate())){
            throw new RuntimeException("Invalid Expense Date must be in between travel time");
        }
        if(expense.getAmount() > expenseType.getMaxAmount()){
            throw new RuntimeException("Spent Amount Must be <"+expenseType.getMaxAmount()+" for this expense type");
        }
        if(dto.getFile() != null){
            expense = employeeTravelExpenseRepository.save(expense);
            String url = fileStorageService.uploadFile("expense-bills/",expense.getEmployeeTravelExpenseId()+"_"+expenseType.getTravelExpenseTypeName(), dto.getFile());
            expense.setProofUrl(url);
        }

        expense.setStatus(TravelExpenseStatusEnum.Draft);
        return modelMapper.map(employeeTravelExpenseRepository.save(expense), EmployeeTravelExpenseResponseDTO.class);
    }

    public EmployeeTravelExpenseResponseDTO submitEmployeeExpense(int employeeTravelExpenseId){
        EmployeeTravelExpense expense = employeeTravelExpenseRepository.findById(employeeTravelExpenseId).orElseThrow(
                ()-> new RuntimeException("Invalid Submission not found expense entry")
        );
        if(expense.getProofUrl() == null)
            throw new RuntimeException("Proof is mandatory for submitting expense");
        boolean exist = employeeTravelExpenseRepository.existsByExpenseDateAndStatusInAndTravelExpenseTypeAndTravelEmployee(expense.getExpenseDate(), List.of(TravelExpenseStatusEnum.Submitted, TravelExpenseStatusEnum.Approved), expense.getTravelExpenseType(), expense.getTravelEmployee());
        if(exist){
            throw new RuntimeException("Expense for this date & type already added, only one entry per day allowed");
        }

        expense.setStatus(TravelExpenseStatusEnum.Submitted);
        expense.setCreatedAt(LocalDate.now());
        return modelMapper.map(employeeTravelExpenseRepository.save(expense), EmployeeTravelExpenseResponseDTO.class);
    }

    public EmployeeTravelExpenseResponseDTO verifyEmployeeExpense(int employeeTravelExpenseId, TravelExpenseStatusEnum status, String remark, String username){
        EmployeeTravelExpense expense = employeeTravelExpenseRepository.findById(employeeTravelExpenseId).orElseThrow(
                ()-> new RuntimeException("Invalid id not found expense entry")
        );
        if(expense.getStatus() != TravelExpenseStatusEnum.Submitted)
            throw new RuntimeException("Only Submitted expenses are allow to verify");

        Employee approver = employeeRepository.getReferenceByEmail(username);
        expense.setStatus(status);
        expense.setUpdatedAt(LocalDate.now());
        expense.setApprover(approver);
        expense.setRemark(remark);

        notificationService.notifyUser(expense.getTravelEmployee().getEmployee().getEmployeeId(),
                NotificationTypeEnum.TravelExpense,
                "Your Expense for Travel Plan "+expense.getTravelEmployee().getTravelPlan().getTitle()+" has been "+status.name());

        return modelMapper.map(employeeTravelExpenseRepository.save(expense), EmployeeTravelExpenseResponseDTO.class);
    }

    public List<EmployeeTravelExpenseResponseDTO> getExpenseByEmployee(int employeeId){
        Employee employee = employeeRepository.findById(employeeId).orElseThrow();
        List<EmployeeTravelExpense> expenses =employeeTravelExpenseRepository.findAllByTravelEmployee_Employee(employee);
        return modelMapper.map(expenses, new TypeToken<List<EmployeeTravelExpenseResponseDTO>>(){}.getType());
    }

    public List<EmployeeTravelExpenseResponseDTO> getExpenseByTravelPlan(int travelPlanId){
        List<EmployeeTravelExpense> expenses =employeeTravelExpenseRepository.findAllByTravelEmployee_TravelPlan_TravelPlanIdAndStatusNot(travelPlanId,TravelExpenseStatusEnum.Draft);
        return modelMapper.map(expenses, new TypeToken<List<EmployeeTravelExpenseResponseDTO>>(){}.getType());
    }

    public void deleteDraft(int expenseId){
        EmployeeTravelExpense expense = employeeTravelExpenseRepository.findById(expenseId).orElseThrow();
        if(expense.getStatus() != TravelExpenseStatusEnum.Draft){
            throw new RuntimeException("Delete allowed on draft entry only.");
        }
        employeeTravelExpenseRepository.deleteById(expenseId);
    }
}
