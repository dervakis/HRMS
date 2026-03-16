package com.intern.hrms.utility;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;


public class LocalFileStorageServiceImpl implements IFileStorageService{
    @Value("${storage.path}")
    private String path;

    @Override
    public String uploadFile(String folderPath, String fileName, MultipartFile file) {
        try{
            File directory = new File(path+folderPath);
            if(!directory.exists()){
                if(!directory.mkdirs()){
                    throw new RuntimeException("Issue in creating Directories in upload employee document.");
                }
            }
            String url = directory.getPath()+"/"+fileName+getFileExtension(file.getOriginalFilename());
            file.transferTo(new File(System.getProperty("user.dir")+"/"+url));
            return folderPath+fileName+getFileExtension(file.getOriginalFilename());
        }catch (IOException exception){
            System.out.println("Error : Issue in Uploading File : "+exception.getMessage());
            throw new RuntimeException(exception.getMessage());
        }
    }

    @Override
    public String updateFile(String url, MultipartFile file) {
        try{
            String basePath = url.substring(0, url.lastIndexOf("."));
            String newPath = basePath + getFileExtension(file.getOriginalFilename());
            File location = new File(System.getProperty("user.dir")+"/" + path + newPath);
            file.transferTo(location);
            return newPath;
        }catch (IOException exception){
            System.out.println("Error : Issue in Updating File : "+exception.getMessage());
            throw new RuntimeException(exception.getMessage());
        }
    }

    @Override
    public String getFileExtension(String name) {
        return name.substring(name.indexOf("."));
    }

    @Override
    public String getDocument(String url) {
        return "http://localhost:8080/files/"+url;
    }

    @Override
    public byte[] downloadContent(String url) {
        try{
            return Files.readAllBytes(Paths.get(System.getProperty("user.dir")+"/"+path+url));
        }catch (IOException exception){
            System.out.println("Error : Issue in Download File : "+exception.getMessage());
            throw new RuntimeException(exception.getMessage());
        }
    }
}
