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
    private int GameId;
    private String GameName;
    private int DurationInMinute;
    private int MaxPlayer;

    @OneToMany(mappedBy = "Game")
    private List<GameSlot> GameSlots;
}
