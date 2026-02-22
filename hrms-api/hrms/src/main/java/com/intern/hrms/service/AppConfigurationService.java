package com.intern.hrms.service;

import com.intern.hrms.entity.AppConfiguration;
import com.intern.hrms.repository.AppConfigurationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppConfigurationService {
    private final AppConfigurationRepository appConfigurationRepository;

    public AppConfigurationService(AppConfigurationRepository appConfigurationRepository) {
        this.appConfigurationRepository = appConfigurationRepository;
    }

    public AppConfiguration addConfiguration(String key, String value){
        AppConfiguration config = new AppConfiguration(key, value);
        return appConfigurationRepository.save(config);
    }

    public void deleteConfiguration(int configId){
        appConfigurationRepository.deleteById(configId);
    }

    public List<AppConfiguration> getValueByKey(String key){
        return appConfigurationRepository.findByConfigKey(key);
    }
}
