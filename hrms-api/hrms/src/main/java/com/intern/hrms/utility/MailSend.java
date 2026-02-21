package com.intern.hrms.utility;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.List;

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

    @Async
    public void sendMail(List<String> to, List<String> cc, String subject, String body, String attachPath) {
        try{
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to.toArray(new String[0]));
            helper.setSubject(subject);
            helper.setText(body, false);

            // Optional CC
            if (cc != null && !cc.isEmpty()) {
                helper.setCc(cc.toArray(new String[0]));
            }
            // Optional Attachment
            if (attachPath != null && !attachPath.isBlank()) {
                FileSystemResource file = new FileSystemResource(
                        new File(System.getProperty("user.dir") + "/" + attachPath)
                );
                helper.addAttachment(file.getFilename(), file);
            }

            helper.setFrom("HRMS <" + mail + ">");
            javaMailSender.send(message);
        }catch (Exception e){
            System.out.println("Issue in Mail sending : "+e.getMessage());
        }
    }
}


