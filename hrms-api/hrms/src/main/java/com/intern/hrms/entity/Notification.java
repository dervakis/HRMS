package com.intern.hrms.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.intern.hrms.enums.NotificationTypeEnum;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int notificationId;
    private NotificationTypeEnum notificationType;
    private String message;
    private LocalDateTime createdAt;
    private Boolean isRead;

    @ManyToOne
    @JoinColumn(name = "fk_employee_id")
    @JsonIgnore
    private Employee receiver;

    public Notification(NotificationTypeEnum notificationType, String message, Employee receiver) {
        this.notificationType = notificationType;
        this.message = message;
        this.createdAt = LocalDateTime.now();
        this.isRead = false;
        this.receiver = receiver;
    }
}
