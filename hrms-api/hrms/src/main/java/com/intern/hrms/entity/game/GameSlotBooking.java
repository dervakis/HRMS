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
    @Column(name = "pk_game_slot_booking_id")
    private int gameSlotBookingId;
    private LocalDate bookingDate;
    private SlotBookingStatusEnum bookingStatus;

    @ManyToOne
    @JoinColumn(name = "fk_game_slot_id")
    private GameSlot gameSlot;

    @ManyToOne
    @JoinColumn(name = "fk_booked_by_employee_id")
    private Employee bookedBy;

    @ManyToMany
    @JoinTable(
            name = "playerInSlot",
            joinColumns = @JoinColumn(name = "fk_game_slot_booking_id"),
            inverseJoinColumns = @JoinColumn(name = "fk_employee_id")
    )
    private List<Employee> players;
}
