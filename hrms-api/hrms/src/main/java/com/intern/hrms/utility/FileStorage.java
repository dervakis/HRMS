package com.intern.hrms.utility;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

@Component
public class FileStorage {
    @Value("${storage.path}")
    private String path;

    public String uploadEmployeeDocument(String documentType, int employeeId, MultipartFile file) throws IOException {
        File directory = new File(path+"documents/"+employeeId+"/");
//        boolean result=false;
        if(!directory.exists()){
//            result = directory.mkdirs();
            if(!directory.mkdirs()){
                throw new RuntimeException("Issue in creating Directories in upload employee document.");
            }
        }
//        System.out.println(result);
        String url =path+"documents/"+employeeId+"/"+documentType+getFileExtension(file.getOriginalFilename());
        file.transferTo(new File(System.getProperty("user.dir")+"/"+url));
        return url;
    }

    public String uploadProvidedDocument(String documentType, int travelEmployeeId, MultipartFile file) throws IOException{
        File directory = new File(path+"provided-documents/");
        if(!directory.exists()){
            if(!directory.mkdirs()){
                throw new RuntimeException("Issue in creating Directories in upload employee document.");
            }
        }
        String url = path+"provided-documents/"+travelEmployeeId+"_"+documentType+getFileExtension(file.getOriginalFilename());
        file.transferTo(new File(System.getProperty("user.dir")+"/"+url));
        return url;
    }

    public void UpdateFile(String url, MultipartFile file)throws IOException{
        file.transferTo(new File(System.getProperty("user.dir")+"/"+url));
    }

    public String getFileExtension(String name){

        return name.substring(name.indexOf("."));
//        return "jpg";
    }

    public Resource getDocument(String url){
        Path documentpath = Paths.get(System.getProperty("user.dir")+"/"+url);
        try {
            Resource document = new UrlResource(documentpath.toUri());
            if(!document.exists())
                throw new RuntimeException("document not exist in folder");
            return document;
        }catch(Exception e){
            throw new RuntimeException(e.getMessage());
        }
    }
}
