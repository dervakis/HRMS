package com.intern.hrms.controller;

import com.intern.hrms.commonResponse.SuccessResponse;
import com.intern.hrms.dto.game.request.GameBookingRequestDTO;
import com.intern.hrms.service.game.GameBookingService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Game Booking Controller")
@RequestMapping("api/booking")
public class GameBookingController {

    private final GameBookingService gameBookingService;

    public GameBookingController(GameBookingService gameBookingService) {
        this.gameBookingService = gameBookingService;
    }

    public ResponseEntity<SuccessResponse<Object>> gameBooking(GameBookingRequestDTO dto){
        return ResponseEntity.ok(
                new SuccessResponse<>("Booking Request Accepted", gameBookingService.createGameBooking(dto))
        );
    }
}
