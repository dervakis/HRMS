package com.intern.hrms.service.general;

import com.intern.hrms.entity.AppConfiguration;
import com.intern.hrms.repository.general.AppConfigurationRepository;
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

    public AppConfiguration updateConfiguration(int configId, String value){
        AppConfiguration config =  appConfigurationRepository.findById(configId).orElseThrow();
        config.setConfigValue(value);
        return appConfigurationRepository.save(config);
    }

    public List<AppConfiguration> getValueByKey(String key){
        return appConfigurationRepository.findByConfigKey(key);
    }
}
