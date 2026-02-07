package com.intern.hrms.entity.game;

import com.intern.hrms.entity.Employee;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class WaitingQueue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pk_waiting_queue_id")
    private int waitingQueueId;
    private int playedSlotTotal;

    @ManyToOne
    @JoinColumn(name = "fk_game_slot_booking_id")
    private GameSlotBooking gameSlotBooking;
}
