package com.intern.hrms.dto.game.request;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;

@Getter
@Setter
public class SlotRequestDTO {
    private int gameId;
    private LocalTime slotStart;
}
