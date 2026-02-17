package com.intern.hrms.service;

import com.intern.hrms.dto.travel.request.TravelEmployeeRequestDTO;
import com.intern.hrms.dto.travel.request.TravelPlanRequestDTO;
import com.intern.hrms.dto.travel.response.EmployeeResponseDTO;
import com.intern.hrms.dto.travel.response.TravelPlanResponseDTO;
import com.intern.hrms.entity.Employee;
import com.intern.hrms.entity.travel.TravelEmployee;
import com.intern.hrms.entity.travel.TravelPlan;
import com.intern.hrms.repository.EmployeeRepository;
import com.intern.hrms.repository.TravelEmployeeRepository;
import com.intern.hrms.repository.TravelPlanRepository;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class TravelPlanService {

    private final EmployeeRepository employeeRepository;
    private final ModelMapper modelMapper;
    private final TravelPlanRepository travelPlanRepository;
    private final TravelEmployeeRepository travelEmployeeRepository;

    public TravelPlanService(EmployeeRepository employeeRepository, ModelMapper modelMapper, TravelPlanRepository travelPlanRepository, TravelEmployeeRepository travelEmployeeRepository) {
        this.employeeRepository = employeeRepository;
        this.modelMapper = modelMapper;
        this.travelPlanRepository = travelPlanRepository;
        this.travelEmployeeRepository = travelEmployeeRepository;
    }

    public TravelPlan createTravelPlan(TravelPlanRequestDTO travelPlanRequestDTO, String username){
        Employee creator = employeeRepository.getReferenceByEmail(username);
        TravelPlan travelPlan = new TravelPlan();
        modelMapper.map(travelPlanRequestDTO, travelPlan);
        travelPlan.setCreatedBy(creator);
        return travelPlanRepository.save(travelPlan);
        //dto for response should
    }

    public TravelPlan updateTravelPlan(TravelPlanRequestDTO dto){
        TravelPlan travelPlan = travelPlanRepository.findById(dto.getTravelPlanId()).orElseThrow(
                () -> new RuntimeException("Invalid Travel Plan for update id :"+dto.getTravelPlanId())
        );
        modelMapper.map(dto, travelPlan);
        travelPlanRepository.save(travelPlan);
        return travelPlan;
    }
    public void addTravelEmployee(TravelPlan travelPlan, List<Integer> employeeIds){
        for(int i=0;i<employeeIds.size();i++){
            Employee employee =  employeeRepository.findById(employeeIds.get(i)).orElseThrow(
                    ()-> new RuntimeException("Can't Add invalid Id to travel plan")
            );
            travelEmployeeRepository.save(new TravelEmployee(travelPlan, employee));
//            System.out.println(employeeIds.get(i));
        }
    }
    public void removeTravelEmployee(List<Integer> travelEmployeeIds){
        travelEmployeeRepository.deleteAllById(travelEmployeeIds);
//        travelEmployeeIds.forEach(System.out::println);
    }

    public TravelPlan manageTravelEmployee(TravelEmployeeRequestDTO travelEmployeeRequestDTO){
        TravelPlan travelPlan = travelPlanRepository.findById(travelEmployeeRequestDTO.getTravelPlanId()).orElseThrow(
                () -> new RuntimeException("No such Travel Plan found wiht Id : "+travelEmployeeRequestDTO.getTravelPlanId())
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

        removeTravelEmployee(
                travelPlan.getTravelEmployees()
                .stream().filter(travelEmployee -> remove.contains(travelEmployee.getEmployee().getEmployeeId()) )
                        .map(TravelEmployee::getTravelEmployeeId)
                        .toList() // all id for  delete
        );

        addTravelEmployee(travelPlan, add.stream().toList());
        return travelPlan;
    }
    public List<TravelPlanResponseDTO> getTravelPlans(){
        List<TravelPlan> travelPlans = travelPlanRepository.findAll();
//        List<TravelPlanResponseDTO> result = modelMapper.map(travelPlans, new TypeToken<List<TravelPlanResponseDTO>>(){}.getType());
//        result
        List<TravelPlanResponseDTO> result = travelPlans.stream().map(
                travelPlan -> {
                    TravelPlanResponseDTO res = modelMapper.map(travelPlan, TravelPlanResponseDTO.class);
                    List<EmployeeResponseDTO> emp =  modelMapper.map(travelPlan.getTravelEmployees(),new TypeToken<List<EmployeeResponseDTO>>() {}.getType());
                    res.setTravelEmployees(emp);
//                    res.setEmployees(modelMapper.map(TravelPlan::getTravelEmployees,new TypeToken<List<EmployeeResponseDTO>>(){}.getType()));
                    return  res;
        }).toList();
        return  result;
    }
    public List<TravelPlanResponseDTO> getTravelPlansByEmployee(int employeeId){
        Employee employee = employeeRepository.findById(employeeId).orElseThrow();
        return employee.getTravelEmployee().stream().map(
                travelEmployee -> {
                    TravelPlan plan = travelEmployee.getTravelPlan();
                    TravelPlanResponseDTO res = modelMapper.map(plan, TravelPlanResponseDTO.class);
                    List<EmployeeResponseDTO> emp =  modelMapper.map(plan.getTravelEmployees(),new TypeToken<List<EmployeeResponseDTO>>() {}.getType());
                    res.setTravelEmployees(emp);
                    return  res;
                }
        ).toList();
    }
}
