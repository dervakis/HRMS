package com.intern.hrms.entity.game;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
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
    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean isActive;

    @ManyToOne
    @JoinColumn(name = "fk_game_id")
    @JsonIgnore
    private Game game;

    public GameCycle(LocalDate startDate, LocalDate endDate, Game game) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.game = game;
        this.isActive = true;
    }
}
