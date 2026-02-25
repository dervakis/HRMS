import React, { useState } from 'react'
import { FeedHeader } from './component/FeedHeader'
import type { CreatePostPayload, Post, PostFilters, UpdatePostPayload } from '../../types/AchievementType'
import { PostFilterBar } from './component/PostFilterBar';
import { useCreatePost, useDeletePost, useGetPosts, useLikePost, useUnlikePost, useUpdatePost } from '../../query/AchievementQuery';
import { PostCard } from './component/PostCard';
import PostFormModal from './component/PostFormModal';
import { Button, Pagination, Spinner } from 'flowbite-react';
import { useQueryClient } from '@tanstack/react-query';
import ConfirmModal from './component/ConfirmModal';
import CommentModal from './component/CommentModal';

function Feed() {
    const queryClient = useQueryClient();
    const [filterOpen, setFilterOpen] = useState(false);
    const [filters, setFilters] = useState<PostFilters>({
        roles: [],
        departments: [],
        authorId: null,
        dateFrom: undefined,
        dateTo: undefined,
    })
    const [page, setPage] = useState<number>(1);
    const { data: filteredPost, isLoading } = useGetPosts(filters, page);
    const createPostMutation = useCreatePost();
    const updatePostMutation = useUpdatePost();
    const deletePostMutation = useDeletePost();
    const likePostMutation = useLikePost();
    const unlikePostMutation = useUnlikePost();


    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const [openModal, setOpenModal] = useState<boolean>();
    const [mode, setMode] = useState<'create' | 'edit'>();
    const [defaultValues, setDefaultValues] = useState<UpdatePostPayload | undefined>();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
    const [commentModalOpen, setCommentModalOpen] = useState(false);

    const onCreatePost = () => {
        setOpenModal(true);
        setMode('create');
    }
    const onEditPost = (post: Post) => {
        setMode("edit");
        setDefaultValues({
            postId: post.postId,
            title: post.title,
            description: post.description,
            isPublic: post.isPublic,
            tags: post.tags,
            targetDepartmentIds: post.departmentIds,
            targetRoleIds: post.roleIds,
        });
        setOpenModal(true);
    };
    const onSubmit = async (payload: CreatePostPayload | UpdatePostPayload) => {
        try {
            if (mode === "create") {
                await createPostMutation.mutateAsync(
                    payload as CreatePostPayload
                );
            } else {
                await updatePostMutation.mutateAsync(
                    payload as UpdatePostPayload
                );
            }

            setOpenModal(false);

            // Refetch posts
            queryClient.invalidateQueries({ queryKey: ["Posts"] });
        } catch (error) {
            console.error(error);
        }
    };

    const onDeletePost = async (postId: number) => {
        setSelectedPostId(postId);
        setDeleteModalOpen(true);
    };

    const onLike = async (id: number) => {
        await likePostMutation.mutateAsync(Number(id));
        queryClient.invalidateQueries({ queryKey: ["Posts"] });
    };

    const onUnlike = async (id: number) => {
        await unlikePostMutation.mutateAsync(Number(id));
        queryClient.invalidateQueries({ queryKey: ["Posts"] });
    };

    const confirmDelete = async () => {
        if (!selectedPostId) return;

        try {
            await deletePostMutation.mutateAsync(selectedPostId);
            queryClient.invalidateQueries({ queryKey: ["Posts"] });
            setDeleteModalOpen(false);
            setSelectedPostId(null);
        } catch (error) {
            console.error(error);
        }
    };

    const onComment = (postId: number) => {
        setSelectedPostId(postId);
        setCommentModalOpen(true);
    };

    return (
        <div className='h-full flex flex-col overflow-hidden -m-8 bg-background'>
            <FeedHeader onCreatePost={onCreatePost} onToggleSidebar={() => setFilterOpen(!filterOpen)} />
            <div hidden={!filterOpen} className='p-3'>
                <PostFilterBar onApply={(filter: PostFilters) => { setFilters(filter) }} />
            </div>
            <PostFormModal mode={mode!} open={openModal!} defaultValues={defaultValues} onClose={() => setOpenModal(false)} onSubmit={onSubmit} />
            <CommentModal
                postId={selectedPostId}
                open={commentModalOpen}
                onClose={() => setCommentModalOpen(false)}
            />

            <div className="flex-1 overflow-hidden">
                <div className="max-w-2xl mx-auto h-full p-4 overflow-y-auto space-y-4 px-2 hide-scrollbar">
                    {isLoading ? (
                        <div className="flex justify-center py-16">
                            <Spinner size="xl" />
                        </div>
                    ) :
                        filteredPost?.items.length === 0 ? (
                            <div className="text-center py-16">
                                <p className="text-muted-foreground text-sm">
                                    No posts match your current filters.
                                </p>
                            </div>
                        ) : (
                            <>
                                {filteredPost?.items.map((post) => (
                                    <PostCard key={post.postId} post={post}
                                        onLike={onLike}
                                        onAuthorClick={() => console.log('ac')}
                                        onUnlike={onUnlike}
                                        onDelete={onDeletePost}
                                        onEdit={onEditPost}
                                        onComment={onComment}
                                    />
                                ))}

                                {filteredPost && filteredPost.totalPages > 0 && (
                                    <div className="flex flex-col items-center gap-4 mt-6 pb-10">
                                        <p className="text-sm text-gray-500">
                                            Showing{" "}
                                            {(filteredPost.page - 1) * filteredPost.pageSize + 1}
                                            {" - "}
                                            {Math.min(
                                                filteredPost.page * filteredPost.pageSize,
                                                filteredPost.totalItems
                                            )}{" "}
                                            of {filteredPost.totalItems} posts
                                        </p>

                                        <Pagination
                                            currentPage={filteredPost.page}
                                            totalPages={filteredPost.totalPages}
                                            onPageChange={handlePageChange}
                                            showIcons
                                        />
                                    </div>
                                )}
                            </>
                        )}
                </div>
            </div>
            <ConfirmModal
                open={deleteModalOpen}
                title="Delete Post"
                message="Are you sure you want to delete this post? This action cannot be undone."
                confirmText="Yes, Delete"
                cancelText="Cancel"
                danger
                loading={deletePostMutation.isPending}
                onConfirm={confirmDelete}
                onClose={() => setDeleteModalOpen(false)}
            />
        </div>
    )
}

export default Feed