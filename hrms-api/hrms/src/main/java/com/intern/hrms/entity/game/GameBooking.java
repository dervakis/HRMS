package com.intern.hrms.entity.game;

import com.intern.hrms.entity.Employee;
import com.intern.hrms.enums.BookingStatusEnum;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;

import java.sql.Types;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class GameBooking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pk_game_booking_id")
    private int gameBookingId;
    private LocalDate bookingDate;
    private BookingStatusEnum bookingStatus;
    @Temporal(TemporalType.TIME)
    private LocalTime bookingTime;
    private LocalDateTime createdAt;
    @ManyToOne
    @JoinColumn(name = "fk_booked_by_employee_id")
    private Employee bookedBy;

    @ManyToOne
    @JoinColumn(name = "fk_game_id")
    private Game game;

    @ManyToMany
    @JoinTable(
            name = "playerInSlot",
            joinColumns = @JoinColumn(name = "fk_game_slot_booking_id"),
            inverseJoinColumns = @JoinColumn(name = "fk_employee_id")
    )
    private List<Employee> players;

    @ManyToOne
    @JoinColumn(name = "fk_game_cycle_id")
    private GameCycle gameCycle;

    public GameBooking(LocalDate bookingDate, LocalTime bookingTime, Employee bookedBy, Game game, List<Employee> players, GameCycle gameCycle) {
        this.bookingDate = bookingDate;
        this.bookingTime = bookingTime;
        this.createdAt = LocalDateTime.now();
        this.bookedBy = bookedBy;
        this.game = game;
        this.players = players;
        this.gameCycle = gameCycle;
    }
}
