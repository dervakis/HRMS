package com.intern.hrms.repository.travel;

import com.intern.hrms.entity.Employee;
import com.intern.hrms.entity.travel.TravelEmployee;
import com.intern.hrms.entity.travel.TravelPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface TravelEmployeeRepository extends JpaRepository<TravelEmployee, Integer> {
    TravelEmployee findByEmployeeAndTravelPlan(Employee employee, TravelPlan travelPlan);
    TravelEmployee findByEmployee_EmployeeIdAndTravelPlan(Integer employeeId, TravelPlan travelPlan);
    TravelEmployee findByEmployee_EmployeeIdAndTravelPlan_TravelPlanId(Integer employeeId, Integer travelPlanId);


    @Query("select count(te) > 0 from TravelEmployee te where te.employee.employeeId = :employeeId and te.travelPlan.isActive = true and :startTime < te.travelPlan.endTime and :endTime > te.travelPlan.startTime")
    boolean existsOverlappingTravelPlan(@Param("employeeId") int employeeId, @Param("startTime")LocalDateTime startTime,@Param("endTime") LocalDateTime endTime);
}
