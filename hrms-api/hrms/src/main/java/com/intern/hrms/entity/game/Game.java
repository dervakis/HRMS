package com.intern.hrms.entity.game;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    private String gameName;
    private int durationInMinute;
    private int maxPlayer;

    @OneToMany(mappedBy = "game")
    private List<GameSlot> gameSlots;

    public Game(String gameName, int durationInMinute, int maxPlayer) {
        this.gameName = gameName;
        this.durationInMinute = durationInMinute;
        this.maxPlayer = maxPlayer;
    }
}
