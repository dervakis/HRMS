package com.intern.hrms.scheduler;

import com.intern.hrms.entity.Employee;
import com.intern.hrms.repository.general.EmployeeRepository;
import com.intern.hrms.service.post.PostService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class SystemPostScheduler {

    private final PostService postService;
    private final EmployeeRepository employeeRepository;

    public SystemPostScheduler(PostService postService, EmployeeRepository employeeRepository) {
        this.postService = postService;
        this.employeeRepository = employeeRepository;
    }

    /**
     * Scheduled to run every day at 8 AM
     */
    @Scheduled(cron = "${scheduler.system-post.cron}") // every day at 08:00
    @Transactional
    public void createBirthdayAndAnniversaryPosts() {
        LocalDate today = LocalDate.now();

        List<Employee> birthdayEmployees = employeeRepository.findByDateOfBirthMonthAndDay(today.getMonthValue(), today.getDayOfMonth());
        for (Employee emp : birthdayEmployees) {
            postService.createSystemPostForEmployee(emp, "birthday");
        }

        List<Employee> anniversaryEmployees = employeeRepository.findByJoiningDateMonthAndDay(today.getMonthValue(), today.getDayOfMonth());
        for (Employee emp : anniversaryEmployees) {
            postService.createSystemPostForEmployee(emp, "anniversary");
        }
    }
}
