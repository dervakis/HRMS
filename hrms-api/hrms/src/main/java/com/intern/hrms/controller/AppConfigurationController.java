package com.intern.hrms.controller;

import com.intern.hrms.commonResponse.SuccessResponse;
import com.intern.hrms.entity.AppConfiguration;
import com.intern.hrms.service.general.AppConfigurationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("api/config")
public class AppConfigurationController {
    private final AppConfigurationService appConfigurationService;

    public AppConfigurationController(AppConfigurationService appConfigurationService) {
        this.appConfigurationService = appConfigurationService;
    }

    @PostMapping("/{key}/{value}")
    public ResponseEntity<SuccessResponse<Objects>> addConfiguration(@PathVariable String key, @PathVariable String value){
        appConfigurationService.addConfiguration(key, value);
        return ResponseEntity.ok(
                new SuccessResponse<>("Added Successfully",null )
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
    public ResponseEntity<SuccessResponse<Objects>> updateConfiguration(@PathVariable int configId, @PathVariable String value){
        appConfigurationService.updateConfiguration(configId, value);
        return ResponseEntity.ok(
                new SuccessResponse<>("Updated Successfully",null )
        );
    }
}
