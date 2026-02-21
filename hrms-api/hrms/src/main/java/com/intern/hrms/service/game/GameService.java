package com.intern.hrms.service.game;

import com.intern.hrms.dto.game.request.GameRequestDTO;
import com.intern.hrms.dto.game.request.OperationalHourRequestDTO;
import com.intern.hrms.dto.game.response.InterestedEmployeeResponseDTO;
import com.intern.hrms.entity.game.*;
import com.intern.hrms.enums.BookingStatusEnum;
import com.intern.hrms.repository.game.*;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.data.domain.Limit;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GameService {
    private final GameRepository gameRepository;
    private final GameCycleRepository gameCycleRepository;
    private final EmployeeInterestRepository employeeInterestRepository;
    private final ModelMapper modelMapper;
    private final WaitingQueueRepository waitingQueueRepository;
    private final GameBookingRepository gameBookingRepository;

    public GameService(GameRepository gameRepository, GameCycleRepository gameCycleRepository, EmployeeInterestRepository employeeInterestRepository, ModelMapper modelMapper, WaitingQueueRepository waitingQueueRepository, GameBookingRepository gameBookingRepository) {
        this.gameRepository = gameRepository;
        this.gameCycleRepository = gameCycleRepository;
        this.employeeInterestRepository = employeeInterestRepository;
        this.modelMapper = modelMapper;
        this.waitingQueueRepository = waitingQueueRepository;
        this.gameBookingRepository = gameBookingRepository;
    }

    public Game addGame(GameRequestDTO dto){
        if(dto.getStartingTime().isAfter(dto.getEndingTime())){
            throw new IllegalArgumentException("Starting time must be before ending time");
        }
        Game exist = gameRepository.findByGameName(dto.getGameName().toLowerCase());
        if(exist != null){
            if(exist.getIsDeleted() == true){
                modelMapper.map(dto, exist);
                exist.setIsDeleted(false);
                gameRepository.save(exist);
                return exist;
            }else{
                throw new RuntimeException("Already game exist with name : "+exist.getGameName());
            }
        }
        Game game = new Game(dto.getGameName().toUpperCase(), dto.getDurationInMinute(), dto.getMaxPlayer(), dto.getStartingTime(), dto.getEndingTime());
        gameRepository.save(game);
        return game;
    }

    public void deleteGame(int gameId){
        Game game = gameRepository.findById(gameId).orElseThrow(()->
                new RuntimeException("no game Exist with this Id"));
        game.setIsDeleted(true);
        gameRepository.save(game);
    }

    public List<Game> getGames(){
        return gameRepository.findByIsDeleted(false);
    }

    public Game updateOperationalHour(OperationalHourRequestDTO dto){
        if(dto.getStart().isAfter(dto.getEnd())){
            throw new IllegalArgumentException("Starting time must be before End time");
        }
        Game game = gameRepository.findById(dto.getGameId()).orElseThrow();
        game.setStartTime(dto.getStart());
        game.setEndTime(dto.getEnd());
        return gameRepository.save(game);
    }

    @Transactional
    public void createGameCycle(){
        List<Game> games = gameRepository.findByIsDeleted(false);
        for(Game game: games){
            gameCycleRepository.findByGameAndIsActive(game, true).ifPresent(
                    old -> {
                        old.setIsActive(false);
                        gameCycleRepository.save(old);
                    });
            GameCycle newCycle = new GameCycle(LocalDate.now().plusDays(1), LocalDate.now().plusDays(5),game);
            gameCycleRepository.save(newCycle);
        }

        List<EmployeeInterest> employeeInterests = employeeInterestRepository.findAll();
        for (EmployeeInterest interest: employeeInterests){
            interest.setSlotPlayed(0);
        }
        employeeInterestRepository.saveAll(employeeInterests);

        List<GameBooking> waitingBooking =  waitingQueueRepository.findAll().stream().map(WaitingQueue::getGameBooking).toList();
        for(GameBooking booking : waitingBooking){
            booking.setBookingStatus(BookingStatusEnum.Cancelled);
        }
        gameBookingRepository.saveAll(waitingBooking);

        waitingQueueRepository.deleteAll();
    }

    public GameCycle getGameCycle(int gameId){
        return gameCycleRepository.findByGame_GameIdAndIsActive(gameId, true);
    }

    public List<Game> getInterestedGame(int employeeId){
        List<EmployeeInterest> employeeInterest = employeeInterestRepository.getEmployeeInterestByEmployee_EmployeeId(employeeId);
        return employeeInterest.stream().map(EmployeeInterest::getGame).filter((game ->{
            return game.getIsDeleted() == false;
        })).collect(Collectors.toList());
    }

    public List<InterestedEmployeeResponseDTO> getInterestedEmployee(int gameId){
        List<EmployeeInterest> employees = employeeInterestRepository.findAllByGame_GameId(gameId);
        return modelMapper.map(employees, new TypeToken<List<InterestedEmployeeResponseDTO>>(){}.getType());
    }

}
