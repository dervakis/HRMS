package com.intern.hrms.controller;

import com.intern.hrms.commonResponse.PaginatedResponse;
import com.intern.hrms.dto.achievement.request.CommentRequestDTO;
import com.intern.hrms.dto.achievement.request.PostRequestDTO;
import com.intern.hrms.dto.achievement.response.CommentResponseDTO;
import com.intern.hrms.dto.achievement.response.PostResponseDTO;
import com.intern.hrms.entity.Employee;
import com.intern.hrms.entity.achivement.Comment;
import com.intern.hrms.entity.achivement.Post;
import com.intern.hrms.service.EmployeeService;
import com.intern.hrms.service.post.CommentService;
import com.intern.hrms.service.post.PostService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;
    private final EmployeeService employeeService;
    private final CommentService commentService;

    public PostController(PostService postService, EmployeeService employeeService, CommentService commentService) {
        this.postService = postService;
        this.employeeService = employeeService;
        this.commentService = commentService;
    }

    /** GET /posts/{postId}/comments -> Comment[] */
    @GetMapping("/{postId}/comments")
    public List<CommentResponseDTO> list(@PathVariable int postId) {
        return commentService.listByPost(postId).stream()
                .map(this::toDto)
                .toList();
    }

    /** GET /posts?roles=1,2&departments=3&authorId=5&dateFrom=ISO&dateTo=ISO&page=1 */
    @GetMapping
    public PaginatedResponse<PostResponseDTO> getPosts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(required = false) String roles,
            @RequestParam(required = false) String departments,
            @RequestParam(required = false) Integer authorId,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            Principal principal
    ) {
        List<Integer> roleIds = parseCsvToIntList(roles);
        List<Integer> deptIds = parseCsvToIntList(departments);
        Employee employee = employeeService.getByEmail(principal.getName());

        Page<Post> pageData = postService.getPosts(page, 10, roleIds, deptIds, authorId, dateFrom, dateTo, employee);
        List<PostResponseDTO> items = pageData.getContent().stream()
                .map(p -> postService.toDto(p,employee.getEmployeeId()))
                .toList();

        return new PaginatedResponse<>(items, page, pageData.getSize(), pageData.getTotalElements());
    }

    /** POST /posts/{postId}/comments { text } -> Comment */
    @PostMapping("/{postId}/comments")
    public CommentResponseDTO create(@PathVariable int postId, @Valid @RequestBody CommentRequestDTO body, Principal principal) {
        return toDto(commentService.create(postId, body.getText(), principal.getName()));
    }

    /** POST /posts  */
    @PostMapping()
    public PostResponseDTO createPost(@RequestBody PostRequestDTO dto, Principal principal) {
        Post saved = postService.createPostFromForm(dto, principal.getName());
        return postService.toDto(saved, saved.getAuthor().getEmployeeId());
    }

    /** PUT /comments/{id} { text } -> Comment */
    @PutMapping("/comments/{id}")
    public CommentResponseDTO update(@PathVariable int id, @Valid @RequestBody CommentRequestDTO body) {
        return toDto(commentService.update(id, body.getText()));
    }

    /** PUT /posts/{id}  */
    @PutMapping("/{postId}")
    public PostResponseDTO updatePost(@PathVariable int postId, @Valid @RequestBody PostRequestDTO body) {
        Post saved = postService.updatePost(body, postId);
        return postService.toDto(saved, saved.getAuthor().getEmployeeId());
    }

    /** DELETE /posts/{id} -> void */
    @DeleteMapping("/{postId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePost(@PathVariable int postId) {
        postService.softDeletePost(postId);
    }

    /** POST /posts/{id}/like -> void */
    @PostMapping("/{postId}/like")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void like(@PathVariable int postId, Principal principal) {
        postService.likePost(postId, principal.getName());
    }

    /** DELETE /comments/{id} -> void */
    @DeleteMapping("/comments/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable int id) {
        commentService.delete(id);
    }

    /** DELETE /posts/{id}/like -> void */
    @DeleteMapping("/{postId}/like")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void unlike(@PathVariable int postId, Principal principal) {
        postService.unlikePost(postId, principal.getName());
    }

    // Helpers
    private List<Integer> parseCsvToIntList(String csv) {
        if (csv == null || csv.isBlank()) return List.of();
        return Arrays.stream(csv.split(","))
                .filter(s -> !s.isBlank())
                .map(String::trim)
                .map(Integer::parseInt)
                .toList();
    }

    private CommentResponseDTO toDto(Comment c) {
        CommentResponseDTO dto = new CommentResponseDTO();
        dto.setCommentId(c.getCommentId());
        dto.setText(c.getText());
        dto.setCommentedAt(c.getCommentedAt());
        dto.setPostId(c.getPost().getPostId());
        if (c.getCommentBy() != null) {
            dto.setCommenterId(c.getCommentBy().getEmployeeId());
            dto.setCommenterName(c.getCommentBy().getFirstName() + " " + c.getCommentBy().getLastName());
        }
        return dto;
    }
}
