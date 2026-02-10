package com.intern.hrms.repository;

import com.intern.hrms.entity.travel.TravelPlan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TravelPlanRepository extends JpaRepository<TravelPlan, Integer> {
}
