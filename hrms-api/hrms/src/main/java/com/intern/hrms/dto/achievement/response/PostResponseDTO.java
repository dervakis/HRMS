package com.intern.hrms.dto.achievement.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

// Response DTO returned to frontend
@Getter
@Setter
public class PostResponseDTO {
    private int postId;
    private String title;
    private String description;
    private LocalDateTime createdAt;
    private Boolean isPublic;
    private Boolean isSystemGenerated;
    private PostAuthorResponseDTO author;
    private List<Integer> roleIds;
    private List<Integer> departmentIds;
    private List<String> Tags;
    private int likeCount;
    private int commentCount;
    private Boolean isLikedByCurrentUser;
}
