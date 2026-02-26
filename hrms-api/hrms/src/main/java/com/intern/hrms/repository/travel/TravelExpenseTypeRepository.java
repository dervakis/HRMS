package com.intern.hrms.repository.travel;

import com.intern.hrms.entity.travel.TravelExpenseType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TravelExpenseTypeRepository extends JpaRepository<TravelExpenseType, Integer> {
    Optional<TravelExpenseType> findByTravelExpenseTypeName(String travelExpenseTypeName);
}
