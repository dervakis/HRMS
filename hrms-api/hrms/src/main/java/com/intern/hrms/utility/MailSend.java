package com.intern.hrms.utility;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.File;

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
    public void sendTextWithAttachment(String to, String subject, String body, String attachPath)throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper= new MimeMessageHelper(message, true);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(body);
        FileSystemResource file = new FileSystemResource(new File(System.getProperty("user.dir")+"/"+attachPath));
//        System.out.println();
        helper.addAttachment(file.getFilename(), file);
        javaMailSender.send(message);
    }
}
