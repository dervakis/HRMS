package com.intern.hrms.configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;
import org.hibernate.annotations.ConcreteProxy;

@OpenAPIDefinition(
        info = @Info(
                title = "HRMS API",
                version = "1.0",
                description = "This API Documentation for HRMS Project"
        ),
        servers = {
                @Server(url = "http://localhost:8080/", description = "LocalHost")
        }
)
@ConcreteProxy
public class SwaggerConfiguration {
}
