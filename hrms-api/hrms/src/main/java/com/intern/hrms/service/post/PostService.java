package com.intern.hrms.service.post;

import com.intern.hrms.dto.achievement.request.PostRequestDTO;
import com.intern.hrms.dto.achievement.response.PostAuthorResponseDTO;
import com.intern.hrms.dto.achievement.response.PostResponseDTO;
import com.intern.hrms.entity.AppConfiguration;
import com.intern.hrms.entity.Department;
import com.intern.hrms.entity.Employee;
import com.intern.hrms.entity.Role;
import com.intern.hrms.entity.achivement.Comment;
import com.intern.hrms.entity.achivement.Post;
import com.intern.hrms.enums.NotificationTypeEnum;
import com.intern.hrms.repository.general.AppConfigurationRepository;
import com.intern.hrms.repository.general.DepartmentRepository;
import com.intern.hrms.repository.general.EmployeeRepository;
import com.intern.hrms.repository.general.RoleRepository;
import com.intern.hrms.repository.achievement.PostRepository;
import com.intern.hrms.service.general.NotificationService;
import com.intern.hrms.utility.IMailService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final EmployeeRepository employeeRepository;
    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;
    private final IMailService mailService;
    private final AppConfigurationRepository appConfigurationRepository;
    private final NotificationService notificationService;

    /** Create post from (title, description, isPublic, targetRoles, targetDepartments) */
    public Post createPostFromForm(PostRequestDTO dto,
                                   String username
                                   ) {
        Employee author = employeeRepository.findByEmail(username)
                .orElseThrow(() -> new IllegalArgumentException("Author not found"));

        Post post = new Post();
        post.setTitle(dto.getTitle());
        post.setDescription(dto.getDescription());
        post.setIsPublic(dto.getIsPublic());
        post.setIsSystemGenerated(false);
        post.setCreatedAt(LocalDateTime.now());
        post.setAuthor(author);
        post.setIsActive(true);

        if (dto.getTags() != null && !dto.getTags().isEmpty()) {
            String tagsAsString = dto.getTags().stream()
                    .map(String::trim)
                    .map(String::toLowerCase)
                    .distinct()
                    .collect(Collectors.joining(","));
            post.setTags(tagsAsString);
        }

        if (Boolean.FALSE.equals(dto.getIsPublic())) {
            if ((dto.getTargetRoleIds() == null || dto.getTargetRoleIds().isEmpty()) &&
                    (dto.getTargetDepartmentIds() == null || dto.getTargetDepartmentIds().isEmpty())) {
                throw new IllegalArgumentException("For private posts, targetRoles or targetDepartments is required");
            }
            if (dto.getTargetRoleIds() != null && !dto.getTargetRoleIds().isEmpty()) {
                post.setRoles(new HashSet<>(roleRepository.findAllById(dto.getTargetRoleIds())));
            }
            if (dto.getTargetDepartmentIds() != null && !dto.getTargetDepartmentIds().isEmpty()) {
                post.setDepartments(new HashSet<>(departmentRepository.findAllById(dto.getTargetDepartmentIds())));
            }
        } else {
            post.setRoles(null);
            post.setDepartments(null);
        }
        return postRepository.save(post);
    }

    /** Update post from JSON payload */
    public Post updatePost(PostRequestDTO dto, int postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NoSuchElementException("Post not found"));

        post.setTitle(dto.getTitle());
        post.setDescription(dto.getDescription());
        post.setIsPublic(dto.getIsPublic());

        if (dto.getTags() != null && !dto.getTags().isEmpty()) {
            String tagsAsString = dto.getTags().stream()
                    .map(String::trim)
                    .map(String::toLowerCase)
                    .distinct()
                    .collect(Collectors.joining(","));
            post.setTags(tagsAsString);
        }else{
            post.setTags(null);
        }

        if (Boolean.FALSE.equals(dto.getIsPublic())) {
            List<Integer> roleIds = dto.getTargetRoleIds();
            List<Integer> deptIds = dto.getTargetDepartmentIds();

            boolean rolesEmpty = (roleIds == null || roleIds.isEmpty());
            boolean deptsEmpty = (deptIds == null || deptIds.isEmpty());

            if (rolesEmpty && deptsEmpty) {
                throw new IllegalArgumentException(
                        "For private posts, targetRoles or targetDepartments is required");
            }

            post.getRoles().clear();
            post.getDepartments().clear();

            if (!rolesEmpty) {
                post.getRoles().addAll(roleRepository.findAllById(roleIds));
            }
            if (!deptsEmpty) {
                post.getDepartments().addAll(departmentRepository.findAllById(deptIds));
            }
        } else {
            post.setRoles(null);
            post.setDepartments(null);
        }
        return postRepository.save(post);
    }

    /** Soft delete a post (sets isActive=false) */
    public void softDeletePost(int postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NoSuchElementException("Post not found"));
        post.setIsActive(false);
        postRepository.save(post);
    }


    /** Like a post by current employee */
    public void likePost(int postId, String username) {
        Employee employee = employeeRepository.findByEmail(username).orElseThrow(() -> new NoSuchElementException("Employee not found"));;
        Post post = postRepository.findById(postId).orElseThrow(() -> new NoSuchElementException("Post not found"));

        if (post.getLikedBy() == null) post.setLikedBy(new HashSet<>());
        if (post.getLikedBy().stream().noneMatch(e -> e.getEmployeeId() == employee.getEmployeeId())) {
            post.getLikedBy().add(employee);
            postRepository.save(post);
        }
    }

    /** Unlike a post by current employee */
    public void unlikePost(int postId, String username) {
        Employee employee = employeeRepository.findByEmail(username).orElseThrow(() -> new NoSuchElementException("Employee not found"));;
        Post post = postRepository.findById(postId).orElseThrow(() -> new NoSuchElementException("Post not found"));

        if (post.getLikedBy() != null) {
            post.getLikedBy().removeIf(e -> e.getEmployeeId() == employee.getEmployeeId());
            postRepository.save(post);
        }
    }


    /** Fetch paginated posts with filters */
    public Page<Post> getPosts(Integer page,
                               Integer size,
                               List<Integer> roleIds,
                               List<Integer> deptIds,
                               Integer authorId,
                               LocalDate dateFrom,
                               LocalDate dateTo,
                               Employee user) {
        Pageable pageable = PageRequest.of(page != null ? page - 1 : 0, size != null ? size : 10,
                Sort.by(Sort.Direction.DESC, "createdAt"));

        Integer viewerId = user.getEmployeeId();
        Integer viewerRoleId = user.getRole().getRoleId();
        Integer viewerDeptId = user.getDepartment().getDepartmentId();

        Specification<Post> spec = PostSpecifications.isActive()
                .and(PostSpecifications.visibleTo(viewerId, viewerRoleId, viewerDeptId)) // enforce visibility
                .and(PostSpecifications.byAuthor(authorId))                              // author filter (optional)
                .and(PostSpecifications.authorInRoles(roleIds))                    // FILTER by author's role
                .and(PostSpecifications.authorInDepartments(deptIds))              // FILTER by author's dept
                .and(PostSpecifications.createdBetween(dateFrom, dateTo));

        return postRepository.findAll(spec, pageable);
    }


    /** Map Post -> PostResponseDTO */
    public PostResponseDTO toDto(Post post, Integer currentEmpId) {
        PostResponseDTO dto = new PostResponseDTO();
        dto.setPostId(post.getPostId());
        dto.setTitle(post.getTitle());
        dto.setDescription(post.getDescription());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setIsPublic(post.getIsPublic());
        dto.setIsSystemGenerated(post.getIsSystemGenerated());
        Employee author = post.getAuthor();
        dto.setAuthor(new PostAuthorResponseDTO(author.getEmployeeId(),
                author.getFirstName(),
                author.getLastName(),
                author.getDateOfBirth(),
                author.getEmail(),
                author.getJoiningDate(),
                author.getDepartment().getDepartmentName(),
                author.getRole().getRoleName()));
        if (post.getTags() != null && !post.getTags().isBlank()) {
            dto.setTags(Arrays.asList(post.getTags().split(",")));
        } else {
            dto.setTags(List.of());
        }
        dto.setRoleIds(post.getRoles() != null ? post.getRoles().stream().map(Role::getRoleId).toList() : List.of());
        dto.setDepartmentIds(post.getDepartments() != null ? post.getDepartments().stream().map(Department::getDepartmentId).toList() : List.of());
        int likeCount = post.getLikedBy() != null ? post.getLikedBy().size() : 0;
        if(post.getComments() != null){
            int activeComment = (int) post.getComments().stream().filter(Comment::isActive).count();
            dto.setCommentCount(activeComment);
        }else {
            dto.setCommentCount(0);
        }
        dto.setLikeCount(likeCount);
        boolean likedByMe = (post.getLikedBy() != null && currentEmpId != null &&
                post.getLikedBy().stream().anyMatch(e -> e.getEmployeeId() == currentEmpId));
        dto.setIsLikedByCurrentUser(likedByMe);
        return dto;
    }

    public void createSystemPostForEmployee(Employee employee, String type) {
        Post post = new Post();
        post.setTitle(type.equals("birthday") ? "Happy Birthday " + employee.getFirstName() + "!"
                : "Happy Work Anniversary " + employee.getFirstName() + "!");

        String description = type.equals("birthday")
                ? "Wishing " + employee.getFirstName() + " " + employee.getLastName() + " a very Happy Birthday!"
                : "Celebrating " + employee.getFirstName() + " " + employee.getLastName() + " work anniversary!";

        post.setDescription(description);
        post.setCreatedAt(LocalDateTime.now());
        post.setIsPublic(true);
        post.setIsSystemGenerated(true);
        post.setIsActive(true);
        String authorId = appConfigurationRepository.findByConfigKey("systempost_author").stream().map(AppConfiguration::getConfigValue).toList().get(0);
        post.setAuthor(employeeRepository.getReferenceById(Integer.valueOf(authorId)));
        post.setRoles(null);
        post.setDepartments(null);
        post.setTags(type.equals("birthday") ? "birthday" : "anniversary");
        postRepository.save(post);
    }

    public void hrDelete(int postId, String remark){
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NoSuchElementException("Post not found"));
        if (post.getAuthor() != null) {
            String emailBody = "Your post titled '" + post.getTitle() + "' has been removed by HR.\n Remark: " + remark;
            mailService.sendMail(List.of(post.getAuthor().getEmail()), null, "Post removed by HR", emailBody, null, null, null);
        }
        post.setIsActive(false);
        postRepository.save(post);
        notificationService.notifyUser(post.getAuthor().getEmployeeId(),
                NotificationTypeEnum.Warning,
                "Your Post '"+post.getTitle()+"' has been Deleted By HR.");
    }
}
