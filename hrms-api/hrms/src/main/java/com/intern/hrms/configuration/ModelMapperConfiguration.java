package com.intern.hrms.configuration;

import com.intern.hrms.dto.general.request.EmployeeRequestDTO;
import com.intern.hrms.dto.job.response.JobResponseDTO;
import com.intern.hrms.dto.travel.request.EmployeeTravelExpenseRequestDTO;
import com.intern.hrms.dto.travel.request.TravelPlanRequestDTO;
import com.intern.hrms.dto.travel.response.EmployeeResponseDTO;
import com.intern.hrms.dto.travel.response.TravelPlanResponseDTO;
import com.intern.hrms.entity.Employee;
import com.intern.hrms.entity.job.Job;
import com.intern.hrms.entity.job.JobReferral;
import com.intern.hrms.entity.travel.EmployeeTravelExpense;
import com.intern.hrms.entity.travel.TravelEmployee;
import com.intern.hrms.entity.travel.TravelPlan;
import org.modelmapper.*;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

class SkipPropertyMap extends PropertyMap<EmployeeTravelExpenseRequestDTO, EmployeeTravelExpense> {
    @Override
    protected void configure() {
        skip(destination.getTravelEmployee());
    }
}
class ReferralListToCount extends AbstractConverter<List<JobReferral>, Integer> {
    @Override
    protected Integer convert(List<JobReferral> source) {
        return source != null ? source.size() : 0;
    }
}

@Configuration
public class ModelMapperConfiguration {
    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.addMappings(new SkipPropertyMap());
        modelMapper.addConverter(new ReferralListToCount());
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
//        modelMapper.typeMap(Job.class, JobResponseDTO.class)
//                        .addMappings(m -> m.<Integer>map(Job::getJobReferrals, JobResponseDTO::setReferralCount));

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
