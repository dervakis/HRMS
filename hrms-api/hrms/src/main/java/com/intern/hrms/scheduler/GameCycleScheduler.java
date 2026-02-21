package com.intern.hrms.scheduler;

import com.intern.hrms.service.game.GameService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component

public class GameCycleScheduler {
    private final GameService gameService;

    public GameCycleScheduler(GameService gameService) {
        this.gameService = gameService;
    }

    @Scheduled(cron = "0 0 0 ? * SUN")
    public void runWeeklyCycle(){
        gameService.createGameCycle();
    }
}
