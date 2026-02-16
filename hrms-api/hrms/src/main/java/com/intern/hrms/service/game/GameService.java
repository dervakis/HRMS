package com.intern.hrms.service.game;

import com.intern.hrms.dto.game.request.GameRequestDTO;
import com.intern.hrms.entity.game.EmployeeInterest;
import com.intern.hrms.entity.game.Game;
import com.intern.hrms.entity.game.GameCycle;
import com.intern.hrms.entity.game.GameSlot;
import com.intern.hrms.repository.game.EmployeeInterestRepository;
import com.intern.hrms.repository.game.GameCycleRepository;
import com.intern.hrms.repository.game.GameRepository;
import com.intern.hrms.repository.game.GameSlotRepository;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class GameService {
    private final GameRepository gameRepository;
    private final GameSlotRepository gameSlotRepository;
    private final GameCycleRepository gameCycleRepository;
    private final EmployeeInterestRepository employeeInterestRepository;

    public GameService(GameRepository gameRepository, GameSlotRepository gameSlotRepository, GameCycleRepository gameCycleRepository, EmployeeInterestRepository employeeInterestRepository) {
        this.gameRepository = gameRepository;
        this.gameSlotRepository = gameSlotRepository;
        this.gameCycleRepository = gameCycleRepository;
        this.employeeInterestRepository = employeeInterestRepository;
    }

    public Game addGame(GameRequestDTO dto){
        Game game = new Game(dto.getGameName(), dto.getDurationInMinute(), dto.getMaxPlayer());
        gameRepository.save(game);
        long minutes = Duration.between(dto.getStartingTime(), dto.getEndingTime()).toMinutes();
        int duration = dto.getDurationInMinute();
        int slot = (int)minutes/duration;
        LocalTime start = dto.getStartingTime();
        List<GameSlot> gameSlots = new ArrayList<>();
        for(int i=0;i<slot;i++){
            gameSlots.add(new GameSlot(start.plusMinutes(i*duration), game));
        }
        gameSlotRepository.saveAll(gameSlots);
        return game;
    }

    public List<Game> getGames(){
        return gameRepository.findAll();
    }
    public Game addSlot(int gameId, LocalTime slotStart){
        Game game = gameRepository.findById(gameId).orElseThrow(
                ()->new RuntimeException("no game exist with id:"+gameId)
        );
        LocalTime slotEnd = slotStart.plusMinutes(game.getDurationInMinute());
        //it affecting any slot ke nai
        game.getGameSlots().forEach((gameSlot -> {
            LocalTime start = gameSlot.getSlotTime();
            LocalTime end = start.plusMinutes(game.getDurationInMinute());
            if((slotStart.isAfter(start) && slotStart.isBefore(end))
            || (slotEnd.isAfter(start) && slotStart.isBefore(end))){
                throw new RuntimeException("Already Slot Available in this duration");
            }
        }));
        gameSlotRepository.save(new GameSlot(slotStart, game));
        return game;
    }

    public GameCycle createGameCycle(int gameId){
        Game game = gameRepository.getReferenceById(gameId);
        List<EmployeeInterest> employeeInterests = employeeInterestRepository.findAllByGame(game);
        if(employeeInterests.size() <= 0)
            throw new RuntimeException("Intrested People are 0 no need to create cycle");
        return gameCycleRepository.save(new GameCycle(LocalDateTime.now(),(int) employeeInterests.size()/2, game));
    }

}
