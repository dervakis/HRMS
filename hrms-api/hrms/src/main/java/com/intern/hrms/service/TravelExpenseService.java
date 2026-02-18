package com.intern.hrms.service;

import com.intern.hrms.dto.travel.request.EmployeeTravelExpenseRequestDTO;
import com.intern.hrms.dto.travel.response.EmployeeTravelExpenseResponseDTO;
import com.intern.hrms.entity.Employee;
import com.intern.hrms.entity.travel.EmployeeTravelExpense;
import com.intern.hrms.entity.travel.TravelEmployee;
import com.intern.hrms.entity.travel.TravelExpenseType;
import com.intern.hrms.entity.travel.TravelPlan;
import com.intern.hrms.enums.TravelExpenseStatusEnum;
import com.intern.hrms.repository.*;
import com.intern.hrms.utility.FileStorage;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@Service
public class TravelExpenseService {

    private final TravelExpenseTypeRepository travelExpenseTypeRepository;
    private final ModelMapper modelMapper;
    private final EmployeeTravelExpenseRepository employeeTravelExpenseRepository;
    private final TravelEmployeeRepository travelEmployeeRepository;
    private final FileStorage fileStorage;
    private final EmployeeRepository employeeRepository;
    private final TravelPlanRepository travelPlanRepository;

    public TravelExpenseService(TravelExpenseTypeRepository travelExpenseTypeRepository, ModelMapper modelMapper, EmployeeTravelExpenseRepository employeeTravelExpenseRepository, TravelEmployeeRepository travelEmployeeRepository, FileStorage fileStorage, EmployeeRepository employeeRepository, TravelPlanRepository travelPlanRepository) {
        this.travelExpenseTypeRepository = travelExpenseTypeRepository;
        this.modelMapper = modelMapper;
        this.employeeTravelExpenseRepository = employeeTravelExpenseRepository;
        this.travelEmployeeRepository = travelEmployeeRepository;
        this.fileStorage = fileStorage;
        this.employeeRepository = employeeRepository;
        this.travelPlanRepository = travelPlanRepository;
    }

    public TravelExpenseType addExpenseType(String type, int maxAmount){
        travelExpenseTypeRepository.findByTravelExpenseTypeName(type).ifPresent(
                (expenseType) -> {throw new RuntimeException("Expense type already exist");}
        );
        return travelExpenseTypeRepository.save(new TravelExpenseType(type.toUpperCase(), maxAmount));
    }

    public List<TravelExpenseType> getExpenseType(){
        return travelExpenseTypeRepository.findAll();
    }

    public EmployeeTravelExpense draftEmployeeExpense(EmployeeTravelExpenseRequestDTO dto)throws IOException {
        EmployeeTravelExpense expense =  dto.getEmployeeTravelExpenseId() != null
                ? employeeTravelExpenseRepository.findById(dto.getEmployeeTravelExpenseId()).orElseThrow()
                : new EmployeeTravelExpense();
//        TravelEmployee travelEmployee = travelEmployeeRepository.findById(dto.getEmployeeTravelId()).orElseThrow(
//                () -> new RuntimeException("Invalid Travel Employee id passed : id"+dto.getEmployeeTravelId())
//        );
        Employee employee = employeeRepository.getReferenceById(dto.getEmployeeId());
        TravelPlan travelPlan = travelPlanRepository.getReferenceById(dto.getTravelPlanId());
        TravelEmployee travelEmployee = travelEmployeeRepository.findByEmployeeAndTravelPlan(employee, travelPlan);
        TravelExpenseType expenseType = travelExpenseTypeRepository.findById(dto.getTravelExpenseTypeId()).orElseThrow();
        modelMapper.map(dto, expense);
        expense.setTravelEmployee(travelEmployee);
        if(expense.getExpenseDate().isBefore(travelEmployee.getTravelPlan().getStartTime().toLocalDate())
        || expense.getExpenseDate().isAfter(travelEmployee.getTravelPlan().getEndTime().toLocalDate())){
            throw new RuntimeException("Invalid Expense Date must be in between travel time");
        }
        if(expense.getAmount() > expenseType.getMaxAmount()){
            throw new RuntimeException("Spent Amount Must be <"+expenseType.getMaxAmount()+" for this expense type");
        }
        if(dto.getFile() != null){
            String url= fileStorage.uploadExpenseBill(expense.getEmployeeTravelExpenseId()+"_"+expenseType.getTravelExpenseTypeName(),dto.getFile());
            expense.setProofUrl(url);
        }
//        expense.setEmployeeTravelExpenseId(dto.getEmployeeTravelExpenseId());
        expense.setStatus(TravelExpenseStatusEnum.Draft);


        return employeeTravelExpenseRepository.save(expense);
//        employeeTravelExpenseRepository.
//        return expense;
    }

    public void submitEmployeeExpense(int employeeTravelExpenseId){
        EmployeeTravelExpense expense = employeeTravelExpenseRepository.findById(employeeTravelExpenseId).orElseThrow(
                ()-> new RuntimeException("Invalid Submition not found expense entry")
        );
        if(expense.getProofUrl() == null)
            throw new RuntimeException("Proof is mandatory for submitting expense");
        expense.setStatus(TravelExpenseStatusEnum.Submitted);
        expense.setCreatedAt(LocalDate.now());

        employeeTravelExpenseRepository.save(expense);
    }

    public void verifyEmployeeExpense(int employeeTravelExpenseId, TravelExpenseStatusEnum status, String username){
        EmployeeTravelExpense expense = employeeTravelExpenseRepository.findById(employeeTravelExpenseId).orElseThrow(
                ()-> new RuntimeException("Invalid id not found expense entry")
        );
        if(expense.getStatus() != TravelExpenseStatusEnum.Submitted)
            throw new RuntimeException("Only subbmitted expenses are allow to verify");
        Employee approver = employeeRepository.getReferenceByEmail(username);
//        expense.setRemark("Default Remark for expense");
        expense.setStatus(status);
        expense.setUpdatedAt(LocalDate.now());
        expense.setApprover(approver);
        employeeTravelExpenseRepository.save(expense);
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
}
