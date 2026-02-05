package com.intern.hrms.entity.game;

import com.intern.hrms.entity.Employee;
import com.intern.hrms.enums.SlotBookingStatusEnum;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
public class GameSlotBooking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int GameSlotBookingId;
    private LocalDate BookingDate;
    private SlotBookingStatusEnum BookingStatus;

    @ManyToOne
    @JoinColumn(name = "GameSlotId")
    private GameSlot GameSlot;

    @ManyToOne
    @JoinColumn(name = "BookedBy")
    private Employee BookedBy;

    @ManyToMany
    @JoinTable(
            name = "PlayerInSlot",
            joinColumns = @JoinColumn(name = "GameSlotBookingId"),
            inverseJoinColumns = @JoinColumn(name = "EmployeeId")
    )
    private List<Employee> Players;
}
