package com.intern.hrms.dto.game.request;
import com.intern.hrms.entity.game.GameSlot;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Setter
@Getter
public class GameBookingRequestDTO {
    @NotNull
    private LocalDate bookingDate;
    @NotNull
    private Integer gameSlotId;
    @NotNull
    private Integer bookedBy;
    @NotNull
    private List<Integer> players;
    @NotNull
    private Integer gameCycle;
}
