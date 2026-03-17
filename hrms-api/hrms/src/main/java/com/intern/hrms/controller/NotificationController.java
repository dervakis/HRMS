package com.intern.hrms.controller;

import com.intern.hrms.commonResponse.SuccessResponse;
import com.intern.hrms.entity.Notification;
import com.intern.hrms.service.general.NotificationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("api/notification")
@AllArgsConstructor
@Tag(name = "Notification Controller", description = "Endpoint related to Notifications")
public class NotificationController {
    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<SuccessResponse<List<Notification>>> getNotifications(Principal principal){
        return ResponseEntity.ok(
                new SuccessResponse<>(null, notificationService.getNotifications(principal.getName()))
        );
    }

    @PutMapping("/{notificationId}")
    public void markRead(@PathVariable int notificationId){
        notificationService.markRead(notificationId);
    }
}
