package com.intern.hrms.dto.game.response;

import com.intern.hrms.dto.travel.response.EmployeeResponseDTO;
import com.intern.hrms.entity.game.Game;
import com.intern.hrms.enums.BookingStatusEnum;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
public class GameBookingResponseDTO {
        private int gameBookingId;
        private LocalDate bookingDate;
        private LocalTime bookingTime;
        private String bookingStatus;
        private LocalDateTime createdAt;
        private EmployeeResponseDTO bookedBy;
        private Game game;
        private List<EmployeeResponseDTO> players;
        private int gameCycleGameCycleId;
}
