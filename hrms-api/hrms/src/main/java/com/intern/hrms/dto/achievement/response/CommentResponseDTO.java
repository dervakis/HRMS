package com.intern.hrms.dto.achievement.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class CommentResponseDTO {
    private int commentId;
    private String text;
    private LocalDateTime commentedAt;
    private int postId;
    private int commenterId;
    private String commenterName;
}
