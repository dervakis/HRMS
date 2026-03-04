package com.intern.hrms.utility;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectAclRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;

@Component
public class FileStorage {
    @Value("${storage.path}")
    private String path;
    @Value("${aws.bucket}")
    private String bucket;
    @Value("${aws.urlExpiry}")
    private int urlExpiry;

    private final S3Client s3Client;
    private final S3Presigner s3Presigner;

    public FileStorage(S3Client s3Client, S3Presigner s3Presigner) {
        this.s3Client = s3Client;
        this.s3Presigner = s3Presigner;
    }

//    public String uploadFile(String folderPath, String fileName, MultipartFile file){
//        try{
//            File directory = new File(path+folderPath);
//            if(!directory.exists()){
//                if(!directory.mkdirs()){
//                    throw new RuntimeException("Issue in creating Directories in upload employee document.");
//                }
//            }
//            String url = directory.getPath()+"/"+fileName+getFileExtension(file.getOriginalFilename());
//            file.transferTo(new File(System.getProperty("user.dir")+"/"+url));
//            return url;
//        }catch (IOException exception){
//            System.out.println("Error : Issue in Uploading File : "+exception.getMessage());
//            throw new RuntimeException(exception.getMessage());
//        }
//    }

//    public String updateFile(String url, MultipartFile file){
//        try{
//            String basePath = url.substring(0, url.lastIndexOf("."));
//            String newPath = basePath + getFileExtension(file.getOriginalFilename());
//            File location = new File(System.getProperty("user.dir") + "/" + newPath);
//            file.transferTo(location);
//            return newPath;
//        }catch (IOException exception){
//            System.out.println("Error : Issue in Updating File : "+exception.getMessage());
//            throw new RuntimeException(exception.getMessage());
//        }
//    }

    public String getFileExtension(String name){
        return name.substring(name.indexOf("."));
    }

//    public Resource getDocument(String url){
//        Path documentpath = Paths.get(System.getProperty("user.dir")+"/"+url);
//        try {
//            Resource document = new UrlResource(documentpath.toUri());
//            if(!document.exists())
//                throw new RuntimeException("document not exist in folder");
//            return document;
//        }catch(Exception e){
//            throw new RuntimeException(e.getMessage());
//        }
//    }

    // aws storage service

    public String uploadFileS3(String folderPath, String fileName, MultipartFile file){
        try{
            String key = folderPath + fileName + getFileExtension(file.getOriginalFilename());
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(key)
                    .contentType(file.getContentType())
                    .build();
            s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));
            return key;
        }catch (Exception e){
            System.out.println("Error in storing file in s3 : "+e.getMessage());
            throw new RuntimeException("Failed to store file due to : "+e.getMessage());
        }
    }

    public String updateFileS3(String key, MultipartFile file){
        try{
            String oldExt = getFileExtension(key);
            String newEtx = getFileExtension(file.getOriginalFilename());
            if(!oldExt.equals(newEtx)){
                DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                        .bucket(bucket)
                        .key(key)
                        .build();
                s3Client.deleteObject(deleteObjectRequest); // delete file with different .extension
                key = key.substring(0, key.lastIndexOf(".")) + newEtx; // new one
            }
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(key)
                    .contentType(file.getContentType())
                    .build();
            s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));
            return key;
        }catch (Exception e){
            System.out.println("Error in Updating file in s3 : "+e.getMessage());
            throw new RuntimeException("Failed to Update file due to : "+e.getMessage());
        }
    }

    public String getDocumentS3(String key){
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .build();
        GetObjectPresignRequest getObjectPresignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(urlExpiry))
                .getObjectRequest(getObjectRequest)
                .build();
        PresignedGetObjectRequest presignedGetObjectRequest = s3Presigner.presignGetObject(getObjectPresignRequest);
        return presignedGetObjectRequest.url().toString();
    }
}
