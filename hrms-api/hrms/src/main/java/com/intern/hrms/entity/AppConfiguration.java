package com.intern.hrms.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class AppConfiguration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int appConfigurationId;
    @Column(nullable = false)
    private String configKey;
    @Column(nullable = false)
    private String configValue;

    public AppConfiguration(String configKey, String configValue) {
        this.configKey = configKey;
        this.configValue = configValue;
    }
}
