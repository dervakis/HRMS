package com.intern.hrms.service.post;


import com.intern.hrms.entity.Employee;
import com.intern.hrms.entity.achivement.Comment;
import com.intern.hrms.entity.achivement.Post;
import com.intern.hrms.enums.NotificationTypeEnum;
import com.intern.hrms.repository.general.EmployeeRepository;
import com.intern.hrms.repository.achievement.CommentRepository;
import com.intern.hrms.repository.achievement.PostRepository;
import com.intern.hrms.service.general.NotificationService;
import com.intern.hrms.utility.IMailService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@AllArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final EmployeeRepository employeeRepository;
    private final IMailService mailService;
    private final NotificationService notificationService;

    /** List active comments for a post */
    public List<Comment> listByPost(int postId) {
        return commentRepository.findByPost_PostIdAndIsActiveTrueOrderByCommentedAtAsc(postId);
    }

    /** Create a comment for a post by current user */
    public Comment create(int postId, String text, String username) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NoSuchElementException("Post not found"));
        Employee commenter = employeeRepository.findByEmail(username)
                .orElseThrow(() -> new NoSuchElementException("Employee not found"));

        Comment c = new Comment();
        c.setText(text);
        c.setCommentedAt(LocalDateTime.now());
        c.setActive(true);
        c.setPost(post);
        c.setCommentBy(commenter);

        return commentRepository.save(c);
    }

    /** Update text of a comment (ownership checks can be added) */
    public Comment update(int commentId, String text) {
        Comment c = commentRepository.findById(commentId)
                .orElseThrow(() -> new NoSuchElementException("Comment not found"));
        c.setText(text);
        return commentRepository.save(c);
    }

    /** Soft delete comment */
    public void delete(int commentId) {
        Comment c = commentRepository.findById(commentId)
                .orElseThrow(() -> new NoSuchElementException("Comment not found"));
        c.setActive(false);
        commentRepository.save(c);
    }

    public void hrDelete(int commentId, String remark){
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new NoSuchElementException("Comment not found"));
        Employee commenter = comment.getCommentBy();
        if (commenter != null) {
            String emailBody = "Your comment on post '" + comment.getPost().getTitle() + "' has been removed by HR.\n Remark: " + remark;
            mailService.sendMail(List.of(commenter.getEmail()), null, "Comment removed by HR", emailBody, null, null, null);
        }
        comment.setActive(false);
        commentRepository.save(comment);
        notificationService.notifyUser(comment.getCommentBy().getEmployeeId(),
                NotificationTypeEnum.Warning,
                "Your comment on post '"+comment.getPost().getTitle()+"' has been Deleted By HR.");
    }
}