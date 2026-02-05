package com.intern.hrms.entity.travel;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class TravelExpenseType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int TravelExpenseTypeId;
    private String TravelExpenseTypeName;
    private int MaxAmount;

    // max amount time
}
