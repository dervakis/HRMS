import { useMutation, useQuery } from "@tanstack/react-query";
import type { PostFilters } from "../types/AchievementType";
import { createComment, createPost, deleteComment, deletePost, getComments, getPosts, getPostsByEmployee, likePost, unlikePost, updateComment, updatePost } from "../api/AchievementApiCall";

// Get Posts
export const useGetPosts = (filters?: PostFilters, page:number = 1) => {
    return useQuery({
        queryKey: ["Posts", page, filters],
        queryFn: () => getPosts(page, filters),
    });
};

// Get Posts By Employee
export const useGetPostsByEmployee = (employeeId: number, page: number) => {
    return useQuery({
        queryKey: ["EmployeePosts", employeeId, page],
        queryFn: () => getPostsByEmployee(employeeId, page),
        enabled: !!employeeId,
    });
};

// Create Post
export const useCreatePost = () => {
    return useMutation({
        mutationFn: createPost,
    });
};

// Update Post
export const useUpdatePost = () => {
    return useMutation({
        mutationFn: updatePost,
    });
};

// Delete Post
export const useDeletePost = () => {
    return useMutation({
        mutationFn: deletePost,
    });
};

// Like Post
export const useLikePost = () => {
    return useMutation({
        mutationFn: likePost,
    });
};

// Unlike Post
export const useUnlikePost = () => {
    return useMutation({
        mutationFn: unlikePost,
    });
};

// Get Comments
export const useGetComments = (postId: number) => {
    return useQuery({
        queryKey: ["Comments", postId],
        queryFn: () => getComments(postId),
        enabled: !!postId,
    });
};

// Create Comment
export const useCreateComment = () => {
    return useMutation({
        mutationFn: createComment,
    });
};

// Update Comment
export const useUpdateComment = () => {
    return useMutation({
        mutationFn: updateComment,
    });
};

// Delete Comment
export const useDeleteComment = () => {
    return useMutation({
        mutationFn: deleteComment,
    });
};