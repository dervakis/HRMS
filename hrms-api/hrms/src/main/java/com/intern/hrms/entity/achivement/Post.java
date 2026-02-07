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
    @Column(name = "pk_post_id")
    private int postId;
    private String title;
    private String description;
    private LocalDateTime createdAt;
    private String imageUrl;
    private boolean isPublic;

    @ManyToOne
    @JoinColumn(name = "fk_author_employee_id")
    private Employee author;

    @ManyToMany
    @JoinTable(
            name = "roleWiseVisibility",
            joinColumns = @JoinColumn(name = "fk_post_id"),
            inverseJoinColumns = @JoinColumn(name = "fk_role_id")
    )
    private List<Role> roles; //which role can view this post like only hr or s. dev (if ispublic false)

    @ManyToMany
    @JoinTable(
            name = "departmentWiseVisibility",
            joinColumns = @JoinColumn(name = "fk_post_id"),
            inverseJoinColumns = @JoinColumn(name = "fk_department_id")
    )
    private List<Department> departments; // which department are allow to watch post (if ispublic false)

    @ManyToMany
    @JoinTable(
            name = "postLikes",
            joinColumns = @JoinColumn(name = "fk_post_id"),
            inverseJoinColumns = @JoinColumn(name = "fk_employee_id")
    )
    private List<Employee> likedBy;

    @ManyToMany
    @JoinTable(
            name = "postTags",
            joinColumns = @JoinColumn(name = "fk_post_id"),
            inverseJoinColumns = @JoinColumn(name = "fk_tag_id")
    )
    private List<Tag> postTags;

    @OneToMany(mappedBy = "post")
    private List<Comment> comments;

}
