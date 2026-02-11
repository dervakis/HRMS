package com.intern.hrms.entity.travel;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class TravelExpenseType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pk_travel_expense_type_id")
    private int travelExpenseTypeId;
    @Column(nullable = false, unique = true)
    private String travelExpenseTypeName;
    private int maxAmount;

    // max amount time

    public TravelExpenseType(String travelExpenseTypeName, int maxAmount) {
        this.travelExpenseTypeName = travelExpenseTypeName;
        this.maxAmount = maxAmount;
    }
}
