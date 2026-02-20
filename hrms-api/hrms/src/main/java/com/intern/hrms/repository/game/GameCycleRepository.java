package com.intern.hrms.repository.game;

import com.intern.hrms.entity.game.GameCycle;
import org.springframework.data.domain.Limit;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameCycleRepository extends JpaRepository<GameCycle, Integer> {
    GameCycle findByGame_GameId(int gameGameId, Sort sort, Limit limit);
}
