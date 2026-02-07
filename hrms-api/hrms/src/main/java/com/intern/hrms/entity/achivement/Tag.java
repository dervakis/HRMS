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
    @Column(name = "pk_tag_id")
    private int tagId;
    private String tagName;

    @ManyToMany(mappedBy = "postTags")
    private List<Post> posts;
}
