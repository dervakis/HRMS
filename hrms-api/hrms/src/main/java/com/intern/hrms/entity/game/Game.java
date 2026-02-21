package com.intern.hrms.entity.game;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pk_game_id")
    private int gameId;
    @Column(unique = true)
    private String gameName;
    private int durationInMinute;
    private int maxPlayer;
    private Boolean isDeleted = false;
    private LocalTime startTime;
    private LocalTime endTime;

    public Game(String gameName, int durationInMinute, int maxPlayer, LocalTime startTime, LocalTime endTime) {
        this.gameName = gameName;
        this.durationInMinute = durationInMinute;
        this.maxPlayer = maxPlayer;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}
