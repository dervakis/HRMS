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
    private int GameSlotId;
    private LocalTime SlotTime;
    private boolean IsActive;

    @ManyToOne
    @JoinColumn(name = "GameId")
    private Game Game;
}
