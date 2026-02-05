package com.intern.hrms.entity;

import com.intern.hrms.entity.achivement.Post;
import com.intern.hrms.entity.game.EmployeeInterest;
import com.intern.hrms.entity.game.GameSlotBooking;
import com.intern.hrms.entity.job.JobReferral;
import com.intern.hrms.entity.travel.EmployeeDocument;
import com.intern.hrms.entity.travel.TravelPlan;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int EmployeeID;
    private String FirstName;
    private String LastName;
    private LocalDate DateOfBirth;
    private LocalDate JoiningDate;

    @ManyToOne
    @JoinColumn(name = "ManagerId")
    private Employee Manager;

    @ManyToOne
    @JoinColumn(name = "DepartmentId")
    private Department Department;

    @ManyToOne
    @JoinColumn(name = "RoleId")
    private Role Role;

    @OneToMany(mappedBy = "Manager")
    private List<Employee> Employees;

    @ManyToMany(mappedBy = "Employees")
    private List<TravelPlan> TravelPlans;

    @OneToMany(mappedBy = "Employee")
    private List<EmployeeDocument> EmployeeDocuments;

    @OneToMany(mappedBy = "Author")
    private List<Post> Posts;

//    @ManyToMany(mappedBy = "LikedBy")
//    private List<Post> LikedPost;

    @OneToMany(mappedBy = "Referrer")
    private List<JobReferral> JobReferrals;

    @OneToMany(mappedBy = "Employee")
    private List<EmployeeInterest> EmployeeInterests; // game in whihc emp intrested

    @ManyToMany(mappedBy = "Players")
    private List<GameSlotBooking> GameSlotBookings;
}
