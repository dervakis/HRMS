package com.intern.hrms.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class ActivityLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int activityLogId;
    private String username;
    private String ip;
    private String action;
    private LocalDateTime timestamp;
    private String userAgent;

    public ActivityLog(String username, String ip, String action, LocalDateTime timestamp, String userAgent) {
        this.username = username;
        this.ip = ip;
        this.action = action;
        this.timestamp = timestamp;
        this.userAgent = userAgent;
    }
}
