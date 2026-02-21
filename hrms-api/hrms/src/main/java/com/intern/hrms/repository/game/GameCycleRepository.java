package com.intern.hrms.repository.game;

import com.intern.hrms.entity.game.Game;
import com.intern.hrms.entity.game.GameCycle;
import org.springframework.data.domain.Limit;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GameCycleRepository extends JpaRepository<GameCycle, Integer> {
    GameCycle findByGame_GameId(int gameGameId, Sort sort, Limit limit);

    Optional<GameCycle> findByGameAndIsActive(Game game, Boolean isActive);

    GameCycle findByGame_GameIdAndIsActive(int gameGameId, Boolean isActive);
}
