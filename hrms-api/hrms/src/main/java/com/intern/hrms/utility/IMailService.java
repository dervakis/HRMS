package com.intern.hrms.utility;

import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.InputStream;
import java.util.List;

public interface IMailService {
    void sendMail(List<String> to, List<String>cc, String subject, String body, byte[] attachment, String fileName, String contentType);
}
