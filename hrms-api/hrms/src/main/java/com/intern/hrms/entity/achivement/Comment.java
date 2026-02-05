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
    private int CommentId;
    private String text;
    private LocalDateTime CommentedAt;
    private boolean isActive;

    @ManyToOne
    @JoinColumn(name = "PostId")
    private Post Post;

    @ManyToOne
    @JoinColumn(name = "CommenterId")
    private Employee CommentBy;
}
