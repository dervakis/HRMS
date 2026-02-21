package com.intern.hrms.controller;

import com.intern.hrms.commonResponse.SuccessResponse;
import com.intern.hrms.dto.game.request.GameRequestDTO;
import com.intern.hrms.dto.game.request.OperationalHourRequestDTO;
import com.intern.hrms.dto.game.response.InterestedEmployeeResponseDTO;
import com.intern.hrms.entity.game.Game;
import com.intern.hrms.entity.game.GameCycle;
import com.intern.hrms.service.game.GameService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@Tag(name = "Game Controller")
@RequestMapping("api/game")
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }
    @PostMapping
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<SuccessResponse<Game>> addGame(@Validated @RequestBody GameRequestDTO dto){
        return ResponseEntity.ok(
            new SuccessResponse<>("Game Added Successfully", gameService.addGame(dto))
        );
    }

    @DeleteMapping("/{gameId}")
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<SuccessResponse<Objects>> deleteGame(@PathVariable int gameId){
        gameService.deleteGame(gameId);
        return ResponseEntity.ok(
                new SuccessResponse<>("Game deleted successfully", null)
        );
    }

    @PutMapping("/operation-hour")
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<SuccessResponse<Objects>> updateOperationalHour(@RequestBody OperationalHourRequestDTO dto){
        gameService.updateOperationalHour(dto);
        return ResponseEntity.ok(
                new SuccessResponse<>("Operational hour updated successfully", null)
        );
    }
    @GetMapping("/cycle/{gameId}")
    public ResponseEntity<SuccessResponse<GameCycle>> getGameCycle(@PathVariable int gameId){
        return ResponseEntity.ok(
                new SuccessResponse<>(null, gameService.getGameCycle(gameId))
        );
    }
    @GetMapping("/interested-employee/{gameId}")
    public ResponseEntity<SuccessResponse<List<InterestedEmployeeResponseDTO>>> getInterestedEmployee(@PathVariable int gameId){
        return ResponseEntity.ok(
                new SuccessResponse<>(null, gameService.getInterestedEmployee(gameId))
        );
    }
    @GetMapping("/interest/{employeeId}")
    public ResponseEntity<SuccessResponse<List<Game>>> getInterestedGame(@PathVariable int employeeId){
        return ResponseEntity.ok(
                new SuccessResponse<>(null, gameService.getInterestedGame(employeeId))
        );
    }
    @GetMapping
    public ResponseEntity<SuccessResponse<List<Game>>> getGames(){
        return ResponseEntity.ok(
                new SuccessResponse<>(null, gameService.getGames())
        );
    }
}
