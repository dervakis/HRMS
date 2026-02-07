package com.intern.hrms.entity.achivement;

import com.intern.hrms.entity.Employee;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pk_comment_id")
    private int commentId;
    private String text;
    private LocalDateTime commentedAt;
    private boolean isActive;

    @ManyToOne
    @JoinColumn(name = "fk_post_id")
    private Post post;

    @ManyToOne
    @JoinColumn(name = "fk_commenter_id")
    private Employee commentBy;
}
