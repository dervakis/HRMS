package com.intern.hrms.service.travel;

import com.intern.hrms.dto.travel.request.TravelEmployeeRequestDTO;
import com.intern.hrms.dto.travel.request.TravelPlanRequestDTO;
import com.intern.hrms.dto.travel.response.EmployeeResponseDTO;
import com.intern.hrms.dto.travel.response.TravelPlanResponseDTO;
import com.intern.hrms.entity.Employee;
import com.intern.hrms.entity.travel.TravelEmployee;
import com.intern.hrms.entity.travel.TravelPlan;
import com.intern.hrms.enums.NotificationTypeEnum;
import com.intern.hrms.repository.general.AppConfigurationRepository;
import com.intern.hrms.repository.general.EmployeeRepository;
import com.intern.hrms.repository.travel.TravelEmployeeRepository;
import com.intern.hrms.repository.travel.TravelPlanRepository;
import com.intern.hrms.service.general.NotificationService;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class TravelPlanService {

    private final EmployeeRepository employeeRepository;
    private final ModelMapper modelMapper;
    private final TravelPlanRepository travelPlanRepository;
    private final TravelEmployeeRepository travelEmployeeRepository;
    private final NotificationService notificationService;
    private final AppConfigurationRepository appConfigurationRepository;

    public TravelPlanResponseDTO createTravelPlan(TravelPlanRequestDTO travelPlanRequestDTO, String username){
        Employee creator = employeeRepository.getReferenceByEmail(username);
        TravelPlan travelPlan = new TravelPlan();
        modelMapper.map(travelPlanRequestDTO, travelPlan);
        travelPlan.setCreatedBy(creator);
        return modelMapper.map(travelPlanRepository.save(travelPlan), TravelPlanResponseDTO.class);
    }

    public TravelPlanResponseDTO updateTravelPlan(TravelPlanRequestDTO dto){
        TravelPlan travelPlan = travelPlanRepository.findById(dto.getTravelPlanId()).orElseThrow(
                () -> new RuntimeException("Invalid Travel Plan for update id :"+dto.getTravelPlanId())
        );
        modelMapper.map(dto, travelPlan);
        travelPlanRepository.save(travelPlan);

        TravelPlanResponseDTO res = modelMapper.map(travelPlan, TravelPlanResponseDTO.class);
        res.setTravelEmployees(modelMapper.map(travelPlan.getTravelEmployees(),new TypeToken<List<EmployeeResponseDTO>>() {}.getType()));
        return res;
    }

    public void addTravelEmployee(TravelPlan travelPlan, List<Integer> employeeIds){
        for (Integer employeeId : employeeIds) {
            Employee employee = employeeRepository.findById(employeeId).orElseThrow(
                    () -> new RuntimeException("Can't Add invalid Id to travel plan")
            );
            boolean exist = travelEmployeeRepository.existsOverlappingTravelPlan(employeeId,travelPlan.getStartTime(),travelPlan.getEndTime());
            if (exist) {
                throw new RuntimeException("Employee " + employee.getFirstName() +" is already assigned to another travel plan during this period");
            }

            travelEmployeeRepository.save(new TravelEmployee(travelPlan, employee));
            notificationService.notifyUser(employeeId, NotificationTypeEnum.TravelPlan, "You are selected for travel plan : "+travelPlan.getTitle());
        }
    }

    public void removeTravelEmployee(TravelPlan travelPlan, List<Integer> employeeIds){
        List<Integer> travelEmployeeIds = new ArrayList<>();
        for (Integer employeeId : employeeIds) {
            travelEmployeeIds.add(travelEmployeeRepository.findByEmployee_EmployeeIdAndTravelPlan(employeeId, travelPlan).getTravelEmployeeId());
            notificationService.notifyUser(employeeId, NotificationTypeEnum.TravelPlan, "Your selection for travel plan : "+travelPlan.getTitle()+" , has been cancelled.");
        }
        travelEmployeeRepository.deleteAllById(travelEmployeeIds);
    }

    public TravelPlanResponseDTO manageTravelEmployee(TravelEmployeeRequestDTO travelEmployeeRequestDTO){
        TravelPlan travelPlan = travelPlanRepository.findById(travelEmployeeRequestDTO.getTravelPlanId()).orElseThrow(
                () -> new RuntimeException("No such Travel Plan found with Id : "+travelEmployeeRequestDTO.getTravelPlanId())
        );
        //let list not empty
        Set<Integer> newSet = new HashSet<>(travelEmployeeRequestDTO.getEmployeeIds());
        Set<Integer> oldSet = travelPlan.getTravelEmployees()
                .stream()
                .map(travelEmployee -> travelEmployee.getEmployee().getEmployeeId())
                .collect(Collectors.toSet());

        Set<Integer> add = new HashSet<>(newSet);
        add.removeAll(oldSet); //new added employe
        Set<Integer> remove = new HashSet<>(oldSet);
        remove.removeAll(newSet); // removed employee

        removeTravelEmployee(travelPlan,
                travelPlan.getTravelEmployees()
                .stream().filter(travelEmployee -> remove.contains(travelEmployee.getEmployee().getEmployeeId()) )
                        .map(travelEmployee -> travelEmployee.getEmployee().getEmployeeId())
                        .toList() // all id for  delete
        );

        addTravelEmployee(travelPlan, add.stream().toList());

        TravelPlanResponseDTO res = modelMapper.map(travelPlan, TravelPlanResponseDTO.class);
        res.setTravelEmployees(modelMapper.map(travelPlan.getTravelEmployees(),new TypeToken<List<EmployeeResponseDTO>>() {}.getType()));
        return res;
    }

    public List<TravelPlanResponseDTO> getTravelPlans(){
        List<TravelPlan> travelPlans = travelPlanRepository.findAllByIsActive(true);
        List<TravelPlanResponseDTO> result = travelPlans.stream().map(
                travelPlan -> {
                    TravelPlanResponseDTO res = modelMapper.map(travelPlan, TravelPlanResponseDTO.class);
                    List<EmployeeResponseDTO> emp =  modelMapper.map(travelPlan.getTravelEmployees(),new TypeToken<List<EmployeeResponseDTO>>() {}.getType());
                    res.setTravelEmployees(emp);
                    return  res;
        }).toList();
        return  result;
    }

    public List<TravelPlanResponseDTO> getTravelPlansByEmployee(int employeeId){
        Employee employee = employeeRepository.findById(employeeId).orElseThrow();
        return employee.getTravelEmployee().stream()
                .filter(travelEmployee -> travelEmployee.getTravelPlan().getIsActive())
                .map(
                travelEmployee -> {
                    TravelPlan plan = travelEmployee.getTravelPlan();
                    TravelPlanResponseDTO res = modelMapper.map(plan, TravelPlanResponseDTO.class);
                    List<EmployeeResponseDTO> emp =  modelMapper.map(plan.getTravelEmployees(),new TypeToken<List<EmployeeResponseDTO>>() {}.getType());
                    res.setTravelEmployees(emp);
                    return  res;
                }
        ).toList();
    }

    public List<TravelPlanResponseDTO> getTravelPlansForExpense(int employeeId){
        Employee employee = employeeRepository.findById(employeeId).orElseThrow();
        int deadlineInDay = Integer.parseInt(appConfigurationRepository.findByConfigKey("expense_deadline").get(0).getConfigValue());
        return employee.getTravelEmployee().stream()
                .filter(travelEmployee -> {
                    LocalDateTime deadline = travelEmployee.getTravelPlan().getEndTime().plusDays(deadlineInDay);
                    TravelPlan plan = travelEmployee.getTravelPlan();
                    return plan.getIsActive() && plan.getStartTime().isBefore(LocalDateTime.now()) && LocalDateTime.now().isBefore(deadline);
                })
                .map(
                travelEmployee -> {
                    TravelPlan plan = travelEmployee.getTravelPlan();
                    TravelPlanResponseDTO res = modelMapper.map(plan, TravelPlanResponseDTO.class);
                    List<EmployeeResponseDTO> emp =  modelMapper.map(plan.getTravelEmployees(),new TypeToken<List<EmployeeResponseDTO>>() {}.getType());
                    res.setTravelEmployees(emp);
                    return  res;
                }
        ).toList();
    }

    public void deleteTravelPlan(int planId){
        TravelPlan travelPlan = travelPlanRepository.findById(planId).orElseThrow();
        removeTravelEmployee(travelPlan, travelPlan.getTravelEmployees().stream().map(te-> te.getEmployee().getEmployeeId()).toList());
        travelPlan.setIsActive(false);
        travelPlan.setDocumentTypes(null);
        travelPlan.setTravelEmployees(null);
        travelPlanRepository.save(travelPlan);
    }
}
