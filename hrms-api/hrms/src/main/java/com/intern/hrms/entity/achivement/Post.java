package com.intern.hrms.entity.achivement;

import com.intern.hrms.entity.Department;
import com.intern.hrms.entity.Employee;
import com.intern.hrms.entity.Role;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ManyToAny;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int PostId;
    private String Title;
    private String Description;
    private LocalDateTime CreatedAt;
    private String ImageUrl;
    private boolean IsPublic;

    @ManyToOne
    @JoinColumn(name = "AuthorId")
    private Employee Author;

    @ManyToMany
    @JoinTable(
            name = "RoleWiseVisibility",
            joinColumns = @JoinColumn(name = "PostId"),
            inverseJoinColumns = @JoinColumn(name = "RoleId")
    )
    private List<Role> Roles; //which role can view this post like only hr or s. dev (if ispublic false)

    @ManyToMany
    @JoinTable(
            name = "DepartmentWiseVisibility",
            joinColumns = @JoinColumn(name = "PostId"),
            inverseJoinColumns = @JoinColumn(name = "DepartmentId")
    )
    private List<Department> Departments; // which department are allow to watch post (if ispublic false)

    @ManyToMany
    @JoinTable(
            name = "PostLikes",
            joinColumns = @JoinColumn(name = "Postid"),
            inverseJoinColumns = @JoinColumn(name = "EmployeeId")
    )
    private List<Employee> LikedBy;

    @ManyToMany
    @JoinTable(
            name = "PostTags",
            joinColumns = @JoinColumn(name = "PostId"),
            inverseJoinColumns = @JoinColumn(name = "TagId")
    )
    private List<Tag> PostTags;

    @OneToMany(mappedBy = "Post")
    private List<Comment> Comments;

}
