package com.intern.hrms.dto.travel.request;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class TravelPlanRequestDTO {
    @NotBlank(message = "Title must be not Blank")
    private String title;
    private String description;
    @NotNull(message = "their should be some starting datetime of journey")
    @Future(message = "Invalid Date time it must be future not past")
    private LocalDateTime startTime;
    @Future(message = "Invalid Date time it must be future not past")
    private LocalDateTime endTime;
    @NotNull(message = "creator id is not specified")
    @Min(1)
    private Integer creatorId;
}
