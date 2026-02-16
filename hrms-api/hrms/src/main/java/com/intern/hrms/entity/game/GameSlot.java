package com.intern.hrms.entity.game;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class GameSlot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pk_game_slot_it")
    private int gameSlotId;
    private LocalTime slotTime; //aa starting time
    private boolean isActive;

    @ManyToOne
    @JoinColumn(name = "fk_game_id")
    @JsonIgnore
    private Game game;

    public GameSlot(LocalTime slotTime, Game game) {
        this.slotTime = slotTime;
        this.isActive = true;
        this.game = game;
    }
}
