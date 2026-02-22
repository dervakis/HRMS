package com.intern.hrms.repository;

import com.intern.hrms.entity.AppConfiguration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppConfigurationRepository extends JpaRepository<AppConfiguration, Integer> {
    List<AppConfiguration> findByConfigKey(String configKey);
}
