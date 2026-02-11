package com.intern.hrms.configuration;

import com.intern.hrms.dto.general.request.EmployeeRequestDTO;
import com.intern.hrms.dto.travel.request.EmployeeTravelExpenseRequestDTO;
import com.intern.hrms.dto.travel.request.TravelPlanRequestDTO;
import com.intern.hrms.entity.Employee;
import com.intern.hrms.entity.travel.EmployeeTravelExpense;
import com.intern.hrms.entity.travel.TravelPlan;
import org.modelmapper.Conditions;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.modelmapper.spi.MatchingStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfiguration {
    @Bean
    public ModelMapper modelMapper(){
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.typeMap(TravelPlanRequestDTO.class, TravelPlan.class)
                .addMappings(m -> m.skip(TravelPlan::setTravelPlanId));
        modelMapper.getConfiguration().setPropertyCondition(Conditions.isNotNull());
        modelMapper.getConfiguration().setPreferNestedProperties(false).setMatchingStrategy(MatchingStrategies.STRICT);
        modelMapper.typeMap(EmployeeTravelExpenseRequestDTO.class, EmployeeTravelExpense.class)
                .addMappings(m -> m.<Integer>map(EmployeeTravelExpenseRequestDTO::getEmployeeTravelId,
                        (expense, value)-> expense.getTravelEmployee().setTravelEmployeeId(value)));
        modelMapper.getConfiguration().setAmbiguityIgnored(true);
        return modelMapper;
    }
}
