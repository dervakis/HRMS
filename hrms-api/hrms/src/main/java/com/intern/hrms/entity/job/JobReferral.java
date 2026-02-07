package com.intern.hrms.entity.job;

import com.intern.hrms.entity.Employee;
import com.intern.hrms.enums.ReferralStatusEnum;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Getter
@Setter
public class JobReferral {
    @Id
    @Column(name = "pk_job_referral_id")
    private UUID jobReferralId; //random uuid as referel code also primary key
    private String referee; // whom to going to give referral
    private String refereeEmail;
    private String resumeUrl;
    private ReferralStatusEnum referralStatus; //

    @ManyToOne
    @JoinColumn(name = "fk_job_id")
    private Job job;

    @ManyToOne
    @JoinColumn(name = "fk_referrer_employee_id")
    private Employee referrer;
}
