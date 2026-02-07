package com.intern.hrms.entity.game;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;

@Entity
@Getter
@Setter
public class GameSlot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pk_game_slot_it")
    private int gameSlotId;
    private LocalTime slotTime;
    private boolean isActive;

    @ManyToOne
    @JoinColumn(name = "fk_game_id")
    private Game game;
}
