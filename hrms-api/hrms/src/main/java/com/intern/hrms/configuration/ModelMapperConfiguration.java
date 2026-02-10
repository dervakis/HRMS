package com.intern.hrms.configuration;

import com.intern.hrms.dto.general.request.EmployeeRequestDTO;
import com.intern.hrms.dto.travel.request.TravelPlanRequestDTO;
import com.intern.hrms.entity.Employee;
import com.intern.hrms.entity.travel.TravelPlan;
import org.modelmapper.Conditions;
import org.modelmapper.ModelMapper;
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
        modelMapper.getConfiguration().setAmbiguityIgnored(true);
        return modelMapper;
    }
}
