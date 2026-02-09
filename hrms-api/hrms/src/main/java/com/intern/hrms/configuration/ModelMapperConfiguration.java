package com.intern.hrms.configuration;

import com.intern.hrms.dto.general.request.EmployeeRequestDTO;
import com.intern.hrms.entity.Employee;
import org.modelmapper.Conditions;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfiguration {
    @Bean
    public ModelMapper modelMapper(){
        ModelMapper modelMapper = new ModelMapper();
//        modelMapper.typeMap(EmployeeRequestDTO.class, Employee.class)
//                .addMappings(m -> m.skip(Employee::setEmployeeId));
        modelMapper.getConfiguration().setPropertyCondition(Conditions.isNotNull());
        modelMapper.getConfiguration().setAmbiguityIgnored(true);
        return modelMapper;
    }
}
