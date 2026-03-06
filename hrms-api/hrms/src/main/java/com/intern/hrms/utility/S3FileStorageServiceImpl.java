package com.intern.hrms.utility;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

import java.time.Duration;

public class S3FileStorageServiceImpl implements IFileStorageService{
    @Value("${aws.bucket}")
    private String bucket;
    @Value("${aws.urlExpiry}")
    private int urlExpiry;

    private final S3Client s3Client;
    private final S3Presigner s3Presigner;

    public S3FileStorageServiceImpl(S3Client s3Client, S3Presigner s3Presigner) {
        this.s3Client = s3Client;
        this.s3Presigner = s3Presigner;
    }

    @Override
    public String uploadFile(String folderPath, String fileName, MultipartFile file) {
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

    @Override
    public String updateFile(String url, MultipartFile file) {
        try{
            String oldExt = getFileExtension(url);
            String newEtx = getFileExtension(file.getOriginalFilename());
            if(!oldExt.equals(newEtx)){
                DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                        .bucket(bucket)
                        .key(url)
                        .build();
                s3Client.deleteObject(deleteObjectRequest); // delete file with different .extension
                url = url.substring(0, url.lastIndexOf(".")) + newEtx; // new one
            }
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(url)
                    .contentType(file.getContentType())
                    .build();
            s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));
            return url;
        }catch (Exception e){
            System.out.println("Error in Updating file in s3 : "+e.getMessage());
            throw new RuntimeException("Failed to Update file due to : "+e.getMessage());
        }
    }

    @Override
    public String getFileExtension(String name) {
        return name.substring(name.indexOf("."));
    }

    @Override
    public String getDocument(String url) {
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucket)
                .key(url)
                .build();
        GetObjectPresignRequest getObjectPresignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(urlExpiry))
                .getObjectRequest(getObjectRequest)
                .build();
        PresignedGetObjectRequest presignedGetObjectRequest = s3Presigner.presignGetObject(getObjectPresignRequest);
        return presignedGetObjectRequest.url().toString();
    }
}
