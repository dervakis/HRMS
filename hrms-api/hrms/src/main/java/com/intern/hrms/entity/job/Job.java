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
    private int JobId;
    private String Title;
    private boolean IsOpen;
    private LocalDate OpenedAt;
    private int Salary;
    private int Requirment;
    private int Location; //remote  or office
    private String JobDescriptionUrl;

    @ManyToOne
    @JoinColumn(name = "CreatorId")
    private Employee CreatedBy; //recruiter open position for that


    @OneToMany(mappedBy = "Job")
    private List<JobReferral> JobReferrals;
}
