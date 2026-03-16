package com.intern.hrms.utility;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;

@Service
public class SmtpMaliServiceImpl implements IMailService{
    @Value("${spring.mail.username}")
    private String mail;
    private final JavaMailSender javaMailSender;

    public SmtpMaliServiceImpl(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    @Override
    @Async
    public void sendMail(List<String> to, List<String>cc, String subject, String body, byte[] attachment, String fileName, String contentType) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to.toArray(new String[0]));
            helper.setSubject(subject);
            helper.setText(body, false);
            if (cc != null && !cc.isEmpty()) {
                helper.setCc(cc.toArray(new String[0]));
            }
            if(attachment != null && !fileName.isBlank() && !contentType.isBlank()){
                ByteArrayResource resource = new ByteArrayResource(attachment);
                helper.addAttachment(fileName, resource, contentType);
            }
            helper.setFrom("HRMS <" + mail + ">");
            javaMailSender.send(message);
        }catch (Exception e){
            System.out.println("Issue in Mail sending : "+e.getMessage());
        }
    }
}


