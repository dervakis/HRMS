package com.intern.hrms.controller;

import com.intern.hrms.commonResponse.SuccessResponse;
import com.intern.hrms.dto.game.request.GameBookingRequestDTO;
import com.intern.hrms.dto.game.response.GameBookingResponseDTO;
import com.intern.hrms.service.game.GameBookingService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("api/booking")
@Tag(name = "Game Booking Controller", description = "Endpoint for managing game bookings")
@AllArgsConstructor
public class GameBookingController {

    private final GameBookingService gameBookingService;

    @PostMapping
    public ResponseEntity<SuccessResponse<GameBookingResponseDTO>> gameBooking(@RequestBody @Validated GameBookingRequestDTO dto){
        return ResponseEntity.ok(
                new SuccessResponse<>("Booking Request Accepted", gameBookingService.createGameBooking(dto))
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

    @GetMapping("/date/{gameId}/{date}")
    public ResponseEntity<SuccessResponse<List<GameBookingResponseDTO>>> getBookingOnDate(@PathVariable int gameId, @PathVariable LocalDate date){
        return ResponseEntity.ok(
                new SuccessResponse<>(null, gameBookingService.getBookingOnDate(gameId, date))
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
