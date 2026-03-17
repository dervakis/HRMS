package com.intern.hrms.utility;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.models.BlobHttpHeaders;
import com.azure.storage.blob.sas.BlobSasPermission;
import com.azure.storage.blob.sas.BlobServiceSasSignatureValues;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.time.OffsetDateTime;

public class AzureFileStorageServiceImpl implements IFileStorageService{
    @Value("${azure.container}")
    private String container;
    @Value("${azure.url-expiry}")
    private int expiry;
    private final BlobServiceClient blobServiceClient;

    public AzureFileStorageServiceImpl(BlobServiceClient blobServiceClient) {
        this.blobServiceClient = blobServiceClient;
    }

    @Override
    public String uploadFile(String folderPath, String fileName, MultipartFile file) {
        try {
            String key = folderPath + fileName + getFileExtension(file.getOriginalFilename());
            BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(container);
            BlobClient blobClient = containerClient.getBlobClient(key);
            BlobHttpHeaders headers = new BlobHttpHeaders()
                    .setContentType(file.getContentType())
                    .setContentDisposition("inline");

            blobClient.upload(file.getInputStream(), file.getSize(), true);
            blobClient.setHttpHeaders(headers);
            return key;
        } catch (Exception e) {
            System.out.println("Error storing file in Azure Blob : " + e.getMessage());
            throw new RuntimeException("Failed to store file due to : " + e.getMessage());
        }
    }

    @Override
    public String updateFile(String url, MultipartFile file) {
        try {
            String oldExt = getFileExtension(url);
            String newExt = getFileExtension(file.getOriginalFilename());
            BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(container);
            if (!oldExt.equals(newExt)) {
                BlobClient oldBlob = containerClient.getBlobClient(url);
                oldBlob.delete();
                url = url.substring(0, url.lastIndexOf(".")) + newExt;
            }
            BlobClient blobClient = containerClient.getBlobClient(url);
            BlobHttpHeaders headers = new BlobHttpHeaders()
                    .setContentType(file.getContentType())
                    .setContentDisposition("inline");

            blobClient.upload(file.getInputStream(), file.getSize(), true);
            blobClient.setHttpHeaders(headers);
            return url;
        } catch (Exception e) {
            System.out.println("Error updating file in Azure Blob : " + e.getMessage());
            throw new RuntimeException("Failed to update file due to : " + e.getMessage());
        }
    }

    @Override
    public String getFileExtension(String name) {
        return name.substring(name.lastIndexOf("."));
    }

    @Override
    public String getDocument(String url) {
        BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(container);
        BlobClient blobClient = containerClient.getBlobClient(url);
        BlobSasPermission permission = new BlobSasPermission().setReadPermission(true);
        BlobServiceSasSignatureValues values = new BlobServiceSasSignatureValues(OffsetDateTime.now().plusMinutes(expiry), permission);
        String sasToken = blobClient.generateSas(values);
        return blobClient.getBlobUrl() + "?" + sasToken;
    }

    @Override
    public byte[] downloadContent(String url) {
        BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(container);
        BlobClient blobClient = containerClient.getBlobClient(url);
        ByteArrayOutputStream stream = new ByteArrayOutputStream();
        blobClient.downloadStream(stream);
        return stream.toByteArray();
    }
}
