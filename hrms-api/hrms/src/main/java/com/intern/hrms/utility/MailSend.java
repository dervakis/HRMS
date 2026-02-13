package com.intern.hrms.utility;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailSend {
    @Value("${frontend.url}")
    private String frontendUrl;
    @Value("${spring.mail.username}")
    private String mail;
    private final JavaMailSender javaMailSender;

    public MailSend(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public void sendText(String to, String subject, String body){
        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        simpleMailMessage.setSubject(subject);
        simpleMailMessage.setTo(to);
        simpleMailMessage.setText(body);
        simpleMailMessage.setFrom("HRMS <"+mail+">");
        javaMailSender.send(simpleMailMessage);
    }
}
