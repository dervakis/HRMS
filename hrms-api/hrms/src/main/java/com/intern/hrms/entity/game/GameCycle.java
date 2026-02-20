package com.intern.hrms.entity.game;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
    @JsonIgnore
    private Game game;

    public GameCycle(LocalDateTime startDate, int interestCount, Game game) {
        this.startDate = startDate;
        this.noOfSlot = (int) Math.ceil(interestCount/2.0);
        this.leftSlot = interestCount;
        this.game = game;
    }
}
