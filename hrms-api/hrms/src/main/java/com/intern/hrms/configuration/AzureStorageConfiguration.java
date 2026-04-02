package com.intern.hrms.configuration;

import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile("storage-azure")
public class AzureStorageConfiguration {
    @Value("${azure.connection-string}")
    private String connectionString;

    @Bean
    public BlobServiceClient blobServiceClient(){
        return new BlobServiceClientBuilder().connectionString(connectionString).buildClient();
    }
}
