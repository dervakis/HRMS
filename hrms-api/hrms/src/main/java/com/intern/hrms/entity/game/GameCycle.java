package com.intern.hrms.entity.game;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class GameCycle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pk_game_cycle_id")
    private int gameCycleId;
    private LocalDateTime startDate;
    private int noOfSlot;
    private int leftSlot;

    @ManyToOne
    @JoinColumn(name = "fk_game_id")
    private Game game;
}
