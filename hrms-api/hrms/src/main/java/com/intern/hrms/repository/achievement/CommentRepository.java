package com.intern.hrms.repository.achievement;

import com.intern.hrms.entity.achivement.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Integer> {
    List<Comment> findByPost_PostIdAndIsActiveTrueOrderByCommentedAtAsc(int postId);
}
