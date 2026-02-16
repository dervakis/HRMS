package com.intern.hrms.dto.game.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;

@Getter
@Setter
public class GameRequestDTO {
    @NotNull
    private String gameName;
    @Min(1) @Max(60)
    private Integer durationInMinute;
    @Min(1) @Max(20)
    private Integer maxPlayer;
    private LocalTime startingTime;
    private LocalTime endingTime;
}
