package com.intern.hrms.entity.game;

import com.intern.hrms.entity.Employee;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class WaitingQueue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pk_waiting_queue_id")
    private int waitingQueueId;

    @ManyToOne
    @JoinColumn(name = "fk_game_booking_id")
    private GameBooking gameBooking;

    public WaitingQueue(GameBooking gameBooking) {
        this.gameBooking = gameBooking;
    }
}
