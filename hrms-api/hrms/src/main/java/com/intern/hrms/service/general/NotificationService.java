package com.intern.hrms.service.general;

import com.intern.hrms.entity.Employee;
import com.intern.hrms.entity.Notification;
import com.intern.hrms.enums.NotificationTypeEnum;
import com.intern.hrms.repository.general.EmployeeRepository;
import com.intern.hrms.repository.general.NotificationRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate simpleMessagingTemplate;
    private final EmployeeRepository employeeRepository;

    public NotificationService(NotificationRepository notificationRepository, SimpMessagingTemplate simpleMessagingTemplate, EmployeeRepository employeeRepository) {
        this.notificationRepository = notificationRepository;
        this.simpleMessagingTemplate = simpleMessagingTemplate;
        this.employeeRepository = employeeRepository;
    }

    public void notifyUser(int receiverId, NotificationTypeEnum type, String message){
        Employee receiver = employeeRepository.getReferenceById(receiverId);
        Notification notification = new Notification(type, message, receiver);
        notificationRepository.save(notification);
        simpleMessagingTemplate.convertAndSend(
                "/topic/"+receiverId,
                notification
        );
    }

    public void notifyUsers(List<Integer> receiverIds, NotificationTypeEnum type, String message){
        for (Integer receiver :receiverIds){
            notifyUser(receiver, type, message);
        }
    }

    public List<Notification> getNotifications(String username){
        Employee user = employeeRepository.getReferenceByEmail(username);
        return notificationRepository.findAllByReceiverAndIsRead(user, false);
    }

    public void markRead(int notificationId){
        Notification notification = notificationRepository.findById(notificationId).orElseThrow();
        notification.setIsRead(true);
        notificationRepository.save(notification);
    }
}
