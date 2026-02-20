package com.intern.hrms.controller;

import com.intern.hrms.commonResponse.SuccessResponse;
import com.intern.hrms.dto.game.request.GameRequestDTO;
import com.intern.hrms.dto.game.request.SlotRequestDTO;
import com.intern.hrms.dto.game.response.InterestedEmployeeResponseDTO;
import com.intern.hrms.entity.game.Game;
import com.intern.hrms.entity.game.GameCycle;
import com.intern.hrms.service.game.GameService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Tag(name = "Game Controller")
@RequestMapping("api/game")
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }
    @PostMapping("/slot")
    public ResponseEntity<SuccessResponse<Game>> addSlot(@RequestBody SlotRequestDTO dto){
        return ResponseEntity.ok(
                new SuccessResponse<>(null, gameService.addSlot(dto.getGameId(), dto.getSlotStart()))
        );
    }

    @PostMapping
    public ResponseEntity<SuccessResponse<Game>> addGame(@Validated @RequestBody GameRequestDTO dto){
        return ResponseEntity.ok(
            new SuccessResponse<>("Game Added Successfully", gameService.addGame(dto))
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

    @PostMapping("/cycle/{gameId}")
    public ResponseEntity<SuccessResponse<GameCycle>> addCycle(@PathVariable int gameId){
        gameService.createGameCycle(gameId);
        return ResponseEntity.ok(
                new SuccessResponse<>("Cycle Created Successfully", null)
        );
    }



}
