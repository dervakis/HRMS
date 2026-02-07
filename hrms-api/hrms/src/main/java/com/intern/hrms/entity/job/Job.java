package com.intern.hrms.entity.job;

import com.intern.hrms.entity.Employee;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pk_job_id")
    private int jobId;
    private String title;
    private boolean isOpen;
    private LocalDate openedAt;
    private int salary;
    private int requirment;
    private int location; //remote  or office
    private String jobDescriptionUrl;

    @ManyToOne
    @JoinColumn(name = "fk_created_by_employee_id")
    private Employee createdBy; //recruiter open position for that


    @OneToMany(mappedBy = "job")
    private List<JobReferral> jobReferrals;
}
