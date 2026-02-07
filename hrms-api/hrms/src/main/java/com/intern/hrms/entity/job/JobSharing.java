package com.intern.hrms.entity.job;

import com.intern.hrms.entity.Employee;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
public class JobSharing {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pk_job_sharing_id")
    private int jobSharingId;
    private String email;
    private LocalDate date;

    @ManyToOne
    @JoinColumn(name = "fk_shared_job_id")
    private Job sharedJob;

    @ManyToOne
    @JoinColumn(name = "fk_shared_by_employee_id")
    private Employee sharedBy;
}
