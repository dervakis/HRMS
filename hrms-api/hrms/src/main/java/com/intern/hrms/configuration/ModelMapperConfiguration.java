package com.intern.hrms.configuration;

import com.intern.hrms.dto.general.request.EmployeeRequestDTO;
import com.intern.hrms.dto.travel.request.EmployeeTravelExpenseRequestDTO;
import com.intern.hrms.dto.travel.request.TravelPlanRequestDTO;
import com.intern.hrms.dto.travel.response.EmployeeResponseDTO;
import com.intern.hrms.dto.travel.response.TravelPlanResponseDTO;
import com.intern.hrms.entity.Employee;
import com.intern.hrms.entity.travel.EmployeeTravelExpense;
import com.intern.hrms.entity.travel.TravelEmployee;
import com.intern.hrms.entity.travel.TravelPlan;
import org.modelmapper.Conditions;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.modelmapper.PropertyMap;

class SkipPropertyMap extends PropertyMap<EmployeeTravelExpenseRequestDTO, EmployeeTravelExpense> {
    @Override
    protected void configure() {
        skip(destination.getTravelEmployee());
    }
}

@Configuration
public class ModelMapperConfiguration {
    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.addMappings(new SkipPropertyMap());
        modelMapper.typeMap(TravelPlanRequestDTO.class, TravelPlan.class)
                .addMappings(m -> m.skip(TravelPlan::setTravelPlanId));
        modelMapper.getConfiguration().setPropertyCondition(Conditions.isNotNull());
        modelMapper.getConfiguration().setPreferNestedProperties(false).setMatchingStrategy(MatchingStrategies.STANDARD);
        modelMapper.getConfiguration().setFieldAccessLevel(org.modelmapper.config.Configuration.AccessLevel.PRIVATE);
//        modelMapper.typeMap(EmployeeTravelExpenseRequestDTO.class, EmployeeTravelExpense.class)
//                .addMappings(m -> m.<Integer>map(EmployeeTravelExpenseRequestDTO::getEmployeeTravelId,
//                        (expense, value)-> expense.getTravelEmployee().setTravelEmployeeId(value)));
//        modelMapper.typeMap(EmployeeTravelExpenseRequestDTO.class, EmployeeTravelExpense.class)
//                        .addMappings(m -> m.skip();
//        modelMapper.createTypeMap(EmployeeTravelExpenseRequestDTO.class, EmployeeTravelExpense.class)
//                .addMappings(m -> m.skip(EmployeeTravelExpense::setTravelEmployee))
//                .implicitMappings();
        modelMapper.typeMap(TravelEmployee.class, EmployeeResponseDTO.class)
                .addMappings(m -> {
                    m.map((src) -> src.getEmployee().getEmployeeId(), EmployeeResponseDTO::setEmployeeId);
                    m.map((src) -> src.getEmployee().getFirstName(), EmployeeResponseDTO::setFirstName);
                    m.map((src) -> src.getEmployee().getLastName(), EmployeeResponseDTO::setLastName);
                    m.map((src) -> src.getEmployee().getEmail(), EmployeeResponseDTO::setEmail);
                });
        modelMapper.getConfiguration().setAmbiguityIgnored(true);
        return modelMapper;
    }
}
