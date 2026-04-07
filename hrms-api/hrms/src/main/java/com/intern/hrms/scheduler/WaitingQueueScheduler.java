package com.intern.hrms.scheduler;

import com.intern.hrms.entity.game.Game;
import com.intern.hrms.entity.game.GameBooking;
import com.intern.hrms.enums.BookingStatusEnum;
import com.intern.hrms.repository.game.GameBookingRepository;
import com.intern.hrms.service.game.GameBookingService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class WaitingQueueScheduler {

    private final GameBookingRepository gameBookingRepository;
    private final GameBookingService gameBookingService;

    public WaitingQueueScheduler(GameBookingRepository gameBookingRepository, GameBookingService gameBookingService) {
        this.gameBookingRepository = gameBookingRepository;
        this.gameBookingService = gameBookingService;
    }

    @Scheduled(cron = "${scheduler.waiting-queue.cron}")
    @Transactional
    public void runTenMinuteCycle(){
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now().withSecond(0).withNano(0);
        LocalTime targetSlotTime = now.plusMinutes(30);
        List<GameBooking> waitingBookings = gameBookingRepository.findByBookingDateAndBookingTimeAndBookingStatus(today, targetSlotTime, BookingStatusEnum.Waiting);
        if(waitingBookings.isEmpty()){
            return;
        }
        for(GameBooking waiting : waitingBookings){
            Game game = waiting.getGame();
            boolean bookedExists = gameBookingRepository.existsByGameAndBookingDateAndBookingTimeAndBookingStatus(game, today, targetSlotTime, BookingStatusEnum.Booked);
            if(!bookedExists){
                gameBookingService.allotFromWaiting(game, today, targetSlotTime, false);
            }
        }
    }
}