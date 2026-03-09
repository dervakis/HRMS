package com.intern.hrms.repository.general;


import com.intern.hrms.entity.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, Integer> {
}
