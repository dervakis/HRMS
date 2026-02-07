package com.intern.hrms.entity;

import com.intern.hrms.entity.achivement.Post;
import com.intern.hrms.entity.game.EmployeeInterest;
import com.intern.hrms.entity.game.GameSlotBooking;
import com.intern.hrms.entity.job.JobReferral;
import com.intern.hrms.entity.travel.EmployeeDocument;
import com.intern.hrms.entity.travel.TravelEmployee;
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
    @Column(name = "pk_employee_id")
    private int employeeId;
    private String firstName;
    private String lastName;
    @Column(unique = true, nullable = false)
    private String email;
    @Column(nullable = false)
    private String password;
    private LocalDate dateOfBirth;
    private LocalDate joiningDate;

    @ManyToOne
    @JoinColumn(name = "fk_manager_employee_id")
    private Employee manager;

    @ManyToOne
    @JoinColumn(name = "fk_department_id")
    private Department department;

    @ManyToOne
    @JoinColumn(name = "fk_role_id")
    private Role role;

    @OneToMany(mappedBy = "manager")
    private List<Employee> employees;

    @OneToMany(mappedBy = "employee")
    private List<TravelEmployee> travelEmployee;

    @OneToMany(mappedBy = "employee")
    private List<EmployeeDocument> employeeDocuments;

    @OneToMany(mappedBy = "author")
    private List<Post> posts;

    @OneToMany(mappedBy = "referrer")
    private List<JobReferral> jobReferrals;

    @OneToMany(mappedBy = "employee")
    private List<EmployeeInterest> employeeInterests; // game in whihc emp intrested

    @ManyToMany(mappedBy = "players")
    private List<GameSlotBooking> gameSlotBookings;
}
