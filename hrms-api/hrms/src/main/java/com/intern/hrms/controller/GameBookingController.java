package com.intern.hrms.controller;

import com.intern.hrms.commonResponse.SuccessResponse;
import com.intern.hrms.dto.game.request.GameBookingRequestDTO;
import com.intern.hrms.dto.game.response.GameBookingResponseDTO;
import com.intern.hrms.service.game.GameBookingService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Tag(name = "Game Booking Controller")
@RequestMapping("api/booking")
public class GameBookingController {

    private final GameBookingService gameBookingService;

    public GameBookingController(GameBookingService gameBookingService) {
        this.gameBookingService = gameBookingService;
    }

    @PostMapping
    public ResponseEntity<SuccessResponse<Object>> gameBooking(@RequestBody @Validated GameBookingRequestDTO dto){
        gameBookingService.createGameBooking(dto);
        return ResponseEntity.ok(
                new SuccessResponse<>("Booking Request Accepted", null)
        );
    }

    @PutMapping("/cancel/{bookingId}")
    public ResponseEntity<SuccessResponse<Object>>cancelBooking(@PathVariable int bookingId){
        gameBookingService.cancelBooking(bookingId);
        return ResponseEntity.ok(
                new SuccessResponse<>("Booking Cancelled", null)
        );
    }

    @GetMapping("/today-booked/{gameId}")
    public ResponseEntity<SuccessResponse<List<GameBookingResponseDTO>>> getTodayBookedForGame(@PathVariable int gameId){
        return ResponseEntity.ok(
                new SuccessResponse<>(null, gameBookingService.getTodayBookedForGame(gameId))
        );
    }

    @GetMapping("/cycle/{gameId}/{employeeId}")
    public ResponseEntity<SuccessResponse<List<GameBookingResponseDTO>>> getEmployeeBookingsInCurrentCycle(@PathVariable int gameId, @PathVariable int employeeId){
        return ResponseEntity.ok(
                new SuccessResponse<>(null, gameBookingService.getEmployeeBookingsInCurrentCycle(gameId, employeeId))
        );
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<SuccessResponse<Page<GameBookingResponseDTO>>> getAllEmployeeBookings(@PathVariable int employeeId, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size){
        return ResponseEntity.ok(
                new SuccessResponse<>(null, gameBookingService.getAllEmployeeBookings(employeeId, page, size))
        );
    }
}
