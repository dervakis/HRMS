package com.intern.hrms.service.general;

import com.intern.hrms.entity.ActivityLog;
import com.intern.hrms.repository.general.ActivityLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@AllArgsConstructor
public class ActivityLogService {
    private final ActivityLogRepository activityLogRepository;

    public void addLog(HttpServletRequest request, String username, String agent, String action){
        String ipAddress = request.getHeader("X-Forwarded-For");
        if (ipAddress == null || ipAddress.isEmpty()) {
            ipAddress = request.getRemoteAddr();
        }
        if (ipAddress != null && ipAddress.contains(",")) {
            ipAddress = ipAddress.split(",")[0].trim();
        }
        if ("0:0:0:0:0:0:0:1".equals(ipAddress)) {
            ipAddress = "127.0.0.1";
        }

        activityLogRepository.save(new ActivityLog(username, ipAddress, action,LocalDateTime.now(), agent));
    }
}
