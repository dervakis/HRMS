package com.intern.hrms.service.post;

import com.intern.hrms.entity.Department;
import com.intern.hrms.entity.Role;
import com.intern.hrms.entity.achivement.Post;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class PostSpecifications {

    /** Only active (soft-delete honored) */
    public static Specification<Post> isActive() {
        return (root, q, cb) -> cb.isTrue(root.get("isActive"));
    }

    /** Filter by author (exact) */
    public static Specification<Post> byAuthor(Integer authorId) {
        return (root, q, cb) -> authorId == null
                ? cb.conjunction()
                : cb.equal(root.get("author").get("employeeId"), authorId);
    }

    /**
     * Visibility to a given viewer:
     * isPublic = true OR author == viewer OR viewer.role in post.roles OR viewer.department in post.departments
     */
    public static Specification<Post> visibleTo(Integer viewerId, Integer viewerRoleId, Integer viewerDeptId) {
        return (root, q, cb) -> {
            List<Predicate> ors = new ArrayList<>();

            // Public
            ors.add(cb.isTrue(root.get("isPublic")));

            // Author == viewer
            if (viewerId != null) {
                ors.add(cb.equal(root.get("author").get("employeeId"), viewerId));
            }

            // Post visibility includes viewer's role
            Join<Post, Role> postRoles = root.join("roles", JoinType.LEFT);
            if (viewerRoleId != null) {
                ors.add(cb.equal(postRoles.get("roleId"), viewerRoleId));
            }

            // Post visibility includes viewer's department
            Join<Post, Department> postDepts = root.join("departments", JoinType.LEFT);
            if (viewerDeptId != null) {
                ors.add(cb.equal(postDepts.get("departmentId"), viewerDeptId));
            }

            // Avoid duplicates due to joins
            q.distinct(true);

            return cb.or(ors.toArray(new Predicate[0]));
        };
    }

    /**
     * Filter by *author's department(s)* (NOT by post visibility departments).
     */
    public static Specification<Post> authorInDepartments(List<Integer> departmentIds) {
        return (root, q, cb) -> {
            if (departmentIds == null || departmentIds.isEmpty()) return cb.conjunction();
            Path<Integer> authorDeptId = root.get("author").get("department").get("departmentId");
            return authorDeptId.in(departmentIds);
        };
    }

    /**
     * Filter by *author's role(s)* (NOT by post visibility roles).
     */
    public static Specification<Post> authorInRoles(List<Integer> roleIds) {
        return (root, q, cb) -> {
            if (roleIds == null || roleIds.isEmpty()) return cb.conjunction();
            Path<Integer> authorRoleId = root.get("author").get("role").get("roleId");
            return authorRoleId.in(roleIds);
        };
    }


    public static Specification<Post> inRoles(List<Integer> roleIds) {
        return (root, q, cb) -> {
            if (roleIds == null || roleIds.isEmpty()) return cb.conjunction();
            Join<Post, Role> join = root.join("roles", JoinType.LEFT);
            q.distinct(true);
            return join.get("roleId").in(roleIds);
        };
    }

    public static Specification<Post> inDepartments(List<Integer> deptIds) {
        return (root, q, cb) -> {
            if (deptIds == null || deptIds.isEmpty()) return cb.conjunction();
            Join<Post, Department> join = root.join("departments", JoinType.LEFT);
            q.distinct(true);
            return join.get("departmentId").in(deptIds);
        };
    }

    public static Specification<Post> createdBetween(LocalDate from, LocalDate to) {
        return (root, q, cb) -> {
            if (from == null && to == null) return cb.conjunction();
            if (from != null && to != null) {
                return cb.between(root.get("createdAt"), from, to);
            } else if (from != null) {
                return cb.greaterThanOrEqualTo(root.get("createdAt"), from);
            } else {
                return cb.lessThanOrEqualTo(root.get("createdAt"), to);
            }
        };
    }
}








