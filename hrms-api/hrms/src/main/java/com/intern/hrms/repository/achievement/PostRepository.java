package com.intern.hrms.repository.achievement;

import com.intern.hrms.entity.achivement.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Integer> {
    @EntityGraph(attributePaths = {"author", "roles", "departments", "likedBy"})
    Page<Post> findAll(Specification<Post> spec, Pageable pageable);
}
