package com.intern.hrms.controller;

import com.intern.hrms.commonResponse.SuccessResponse;
import com.intern.hrms.entity.AppConfiguration;
import com.intern.hrms.service.general.AppConfigurationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("api/config")
@AllArgsConstructor
@Tag(name = "App Configuration Controller", description = "Endpoint for application parameter")
public class AppConfigurationController {
    private final AppConfigurationService appConfigurationService;

    @PostMapping("/{key}/{value}")
    public ResponseEntity<SuccessResponse<AppConfiguration>> addConfiguration(@PathVariable String key, @PathVariable String value){
        return ResponseEntity.ok(
                new SuccessResponse<>("Added Successfully",appConfigurationService.addConfiguration(key, value) )
        );
    }

    @GetMapping("/{key}")
    public ResponseEntity<SuccessResponse<List<AppConfiguration>>> getValueByKey(@PathVariable String key){
        return ResponseEntity.ok(
                new SuccessResponse<>(null,appConfigurationService.getValueByKey(key))
        );
    }

    @DeleteMapping("/{configId}")
    public ResponseEntity<SuccessResponse<Objects>> deleteConfiguration(@PathVariable int configId){
        appConfigurationService.deleteConfiguration(configId);
        return ResponseEntity.ok(
                new SuccessResponse<>("Deleted Successfully",null )
        );
    }

    @PutMapping("/{configId}/{value}")
    public ResponseEntity<SuccessResponse<AppConfiguration>> updateConfiguration(@PathVariable int configId, @PathVariable String value){
        return ResponseEntity.ok(
                new SuccessResponse<>("Updated Successfully",appConfigurationService.updateConfiguration(configId, value) )
        );
    }
}
