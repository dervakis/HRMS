import type { Comment, CreateCommentPayload, CreatePostPayload, PaginatedResponse, Post, PostFilters, UpdateCommentPayload, UpdatePostPayload } from "../types/AchievementType";
import { Api } from "./AxiosBase";

// Get Posts with filters
export const getPosts = async (
    page: number = 1,
    filters?: PostFilters
): Promise<PaginatedResponse<Post>> => {
    const params: any = { page };

    if (filters?.roles?.length) params.roles = filters.roles.join(",");
    if (filters?.departments?.length) params.departments = filters.departments.join(",");
    if (filters?.authorId) params.authorId = filters.authorId;
    if (filters?.dateFrom) params.dateFrom = filters.dateFrom.toISOString();
    if (filters?.dateTo) params.dateTo = filters.dateTo.toISOString();

    const response = await Api.get("/posts", { params });
    return response.data;
};

// Create Post
export const createPost = async (
    payload: CreatePostPayload
): Promise<Post> => {
    const response = await Api.post("/posts", payload);
    return response.data;
};

// Update Post
export const updatePost = async (
    payload: UpdatePostPayload
): Promise<Post> => {
    const response = await Api.put(`/posts/${payload.postId}`, payload);
    return response.data;
};

// Delete Post
export const deletePost = async (id: number): Promise<void> => {
    await Api.delete(`/posts/${id}`);
};

// Like Post
export const likePost = async (id: number): Promise<void> => {
    await Api.post(`/posts/${id}/like`);
};

// Unlike Post
export const unlikePost = async (id: number): Promise<void> => {
    await Api.delete(`/posts/${id}/like`);
};

// Get Posts By Employee
export const getPostsByEmployee = async (
    employeeId: number,
    page: number = 1
): Promise<PaginatedResponse<Post>> => {
    const response = await Api.get("/posts", {
        params: { authorId: employeeId, page },
    });

    return response.data;
};

// Get Comments
export const getComments = async (postId: number): Promise<Comment[]> => {
    const response = await Api.get(`/posts/${postId}/comments`);
    return response.data;
};

// Create Comment
export const createComment = async (
    payload: CreateCommentPayload
): Promise<Comment> => {
    const response = await Api.post(
        `/posts/${payload.postId}/comments`,
        { text: payload.text }
    );
    return response.data;
};

// Update Comment
export const updateComment = async (
    payload: UpdateCommentPayload
): Promise<Comment> => {
    const response = await Api.put(`posts/comments/${payload.commentId}`, {
        text: payload.text,
    });
    return response.data;
};

// Delete Comment
export const deleteComment = async (id: number): Promise<void> => {
    await Api.delete(`posts/comments/${id}`);
};