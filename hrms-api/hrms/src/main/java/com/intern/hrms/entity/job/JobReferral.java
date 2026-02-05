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
    private UUID JobReferralId; //random uuid as referel code also primary key
    private String Referee; // whom to going to give referral
    private String RefereeEmail;
    private String ResumeUrl;
    private ReferralStatusEnum ReferralStatus; //

    @ManyToOne
    @JoinColumn(name = "JobId")
    private Job Job;

    @ManyToOne
    @JoinColumn(name = "ReferrerId")
    private Employee Referrer;
}
