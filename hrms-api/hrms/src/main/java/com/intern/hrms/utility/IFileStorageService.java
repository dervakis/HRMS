package com.intern.hrms.utility;

import org.springframework.web.multipart.MultipartFile;

public interface IFileStorageService {
    String uploadFile(String folderPath, String fileName, MultipartFile file);
    String updateFile(String url, MultipartFile file);
    String getFileExtension(String name);
    String getDocument(String url);
}
