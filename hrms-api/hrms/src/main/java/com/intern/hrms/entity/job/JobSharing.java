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
    private int JobSharingId;
    private String Email;
    private LocalDate Date;

    @ManyToOne
    @JoinColumn(name = "SharedJobId")
    private Job SharedJob;

    @ManyToOne
    @JoinColumn(name = "SharedBy")
    private Employee SharedBy;
}
