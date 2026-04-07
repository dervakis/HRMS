package com.intern.hrms.scheduler;

import com.intern.hrms.service.game.GameService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class GameCycleScheduler {
    private final GameService gameService;

    public GameCycleScheduler(GameService gameService) {
        this.gameService = gameService;
    }

    @Scheduled(cron = "${scheduler.game-cycle.cron}")
    public void runWeeklyCycle(){
        gameService.createGameCycle();
    }
}
