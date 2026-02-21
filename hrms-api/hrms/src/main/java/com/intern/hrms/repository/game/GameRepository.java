package com.intern.hrms.repository.game;

import com.intern.hrms.entity.game.Game;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GameRepository extends JpaRepository<Game, Integer> {
    List<Game> findByIsDeleted(Boolean isDeleted);

    Game findByGameName(String gameName);
}
