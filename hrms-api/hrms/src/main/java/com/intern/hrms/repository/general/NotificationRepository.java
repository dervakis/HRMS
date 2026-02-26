package com.intern.hrms.repository.general;

import com.intern.hrms.entity.Employee;
import com.intern.hrms.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    List<Notification> findAllByReceiverAndIsRead(Employee employee, Boolean isRead);
}
