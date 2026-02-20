package com.intern.hrms.service.game;

import com.intern.hrms.dto.game.request.GameBookingRequestDTO;
import com.intern.hrms.entity.game.*;
import com.intern.hrms.enums.SlotBookingStatusEnum;
import com.intern.hrms.repository.game.*;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GameBookingService {

    private final GameSlotBookingRepository gameSlotBookingRepository;
    private final EmployeeInterestRepository employeeInterestRepository;
    private final GameSlotRepository gameSlotRepository;
    private final GameCycleRepository gameCycleRepository;
    private final ModelMapper modelMapper;
    private final WaitingQueueRepository waitingQueueRepository;

    public GameBookingService(GameSlotBookingRepository gameSlotBookingRepository, EmployeeInterestRepository employeeInterestRepository, GameSlotRepository gameSlotRepository, GameCycleRepository gameCycleRepository, ModelMapper modelMapper, WaitingQueueRepository waitingQueueRepository) {
        this.gameSlotBookingRepository = gameSlotBookingRepository;
        this.employeeInterestRepository = employeeInterestRepository;
        this.gameSlotRepository = gameSlotRepository;
        this.gameCycleRepository = gameCycleRepository;
        this.modelMapper = modelMapper;
        this.waitingQueueRepository = waitingQueueRepository;
    }

    public GameSlotBooking createGameBooking(GameBookingRequestDTO dto){
        List<GameSlotBooking> existingBookings =  gameSlotBookingRepository.findByBookingDateAndGameSlot_GameSlotIdAndBookingStatus(dto.getBookingDate(), dto.getGameSlotId(), SlotBookingStatusEnum.Booked);
        GameSlot gameSlot = gameSlotRepository.getReferenceById(dto.getGameSlotId());
        EmployeeInterest interest = employeeInterestRepository.getEmployeeInterestByEmployee_EmployeeIdAndGame_GameId(dto.getBookedBy(), gameSlot.getGame().getGameId());
        GameCycle gameCycle = gameCycleRepository.findById(dto.getGameCycle()).orElseThrow();
        GameSlotBooking booking = modelMapper.map(GameBookingRequestDTO.class, GameSlotBooking.class);
        if(existingBookings ==null && interest.getSlotPlayed() == 0){
            booking.setBookingStatus(SlotBookingStatusEnum.Booked);
        }else{
            booking.setBookingStatus(SlotBookingStatusEnum.Waiting);
        }

        booking = gameSlotBookingRepository.save(booking);
        if(booking.getBookingStatus() == SlotBookingStatusEnum.Waiting){
            waitingQueueRepository.save(new WaitingQueue(booking));
        }
        return booking;
    }
}
