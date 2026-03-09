package com.intern.hrms.utility;


import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

public class CloudinaryFileStorageServiceImpl implements IFileStorageService {
    private final Cloudinary cloudinary;

    public CloudinaryFileStorageServiceImpl(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    @Override
    public String uploadFile(String folderPath, String fileName, MultipartFile file) {
        try{
            Map result = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "public_id", folderPath+fileName,
                    "resource_type", "auto"
            ));
            System.out.println(result.keySet());
            System.out.println(result.get("secure_url").toString());
            return result.get("public_id").toString();
        }catch (Exception e) {
            throw new RuntimeException("File upload failed: " + e.getMessage());
        }
    }

    @Override
    public String updateFile(String url, MultipartFile file) {
        try {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                            "public_id", url,
                            "overwrite", true,
                            "resource_type", "auto"
            ));
            return uploadResult.get("public_id").toString();
        } catch (Exception e) {
            throw new RuntimeException("File update failed: " + e.getMessage());
        }
    }

    @Override
    public String getFileExtension(String name) {
        return name.substring(name.lastIndexOf("."));
    }

    @Override
    public String getDocument(String url) {
        return cloudinary.url()
                .secure(true)
                .generate(url);
    }
}
