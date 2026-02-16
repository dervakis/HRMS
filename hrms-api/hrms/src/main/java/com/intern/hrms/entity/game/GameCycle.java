package com.intern.hrms.entity.game;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@NoArgsConstructor
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

    public GameCycle(LocalDateTime startDate, int noOfSlot, Game game) {
        this.startDate = startDate;
        this.noOfSlot = noOfSlot;
        this.leftSlot = 0;
        this.game = game;
    }
}
