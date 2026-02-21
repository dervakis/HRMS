package com.intern.hrms.dto.game.request;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Setter
@Getter
public class GameBookingRequestDTO {
    @NotNull
    private Integer Game;
    @NotNull
    private LocalDate bookingDate;
    @NotNull
    private LocalTime bookingTime;
    @NotNull
    private Integer bookedBy;
    @NotNull
    private List<Integer> players;
    @NotNull
    private Integer gameCycle;
}
