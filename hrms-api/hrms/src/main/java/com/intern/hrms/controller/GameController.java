package com.intern.hrms.controller;

import com.intern.hrms.commonResponse.SuccessResponse;
import com.intern.hrms.dto.game.request.GameRequestDTO;
import com.intern.hrms.dto.game.request.SlotRequestDTO;
import com.intern.hrms.entity.game.Game;
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

    @PostMapping
    public ResponseEntity<SuccessResponse<Game>> addGame(@Validated @RequestBody GameRequestDTO dto){
        return ResponseEntity.ok(
            new SuccessResponse<>("Game Added Successfully", gameService.addGame(dto))
        );
    }

    @GetMapping
    public ResponseEntity<SuccessResponse<List<Game>>> getGames(){
        return ResponseEntity.ok(
                new SuccessResponse<>(null, gameService.getGames())
        );
    }

    @PostMapping("/slot")
    public ResponseEntity<SuccessResponse<Game>> addSlot(@RequestBody SlotRequestDTO dto){
        return ResponseEntity.ok(
                new SuccessResponse<>(null, gameService.addSlot(dto.getGameId(), dto.getSlotStart()))
        );
    }
}
