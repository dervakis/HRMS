package com.intern.hrms.entity.achivement;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
public class Tag{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int TagId;
    private String TagName;

    @ManyToMany(mappedBy = "PostTags")
    private List<Post> Posts;
}
