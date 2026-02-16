package com.intern.hrms.repository.game;

import com.intern.hrms.entity.game.Game;
import com.intern.hrms.entity.game.GameSlot;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameSlotRepository extends JpaRepository<GameSlot, Integer> {
}
