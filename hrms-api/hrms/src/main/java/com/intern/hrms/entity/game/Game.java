package com.intern.hrms.entity.game;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
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
}
