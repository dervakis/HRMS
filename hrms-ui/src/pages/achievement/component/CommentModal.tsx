// components/common/CommentModaltsx
import React, { useEffect, useRef, useState } from "react";
import { Modal, Button, TextInput, Spinner, ModalHeader, ModalBody } from "flowbite-react";
import { Edit2, Trash2, Check, X, MessageCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateComment, useDeleteComment, useGetComments, useUpdateComment } from "../../../query/AchievementQuery";
import { useSelector } from "react-redux";
import type { RootStateType } from "../../../redux-store/store";

interface CommentModalProps {
    postId: number | null;
    open: boolean;
    onClose: () => void;
}

interface EditableComment {
    commentId: number;
    text: string;
}

const CommentModal: React.FC<CommentModalProps> = ({ postId, open, onClose }) => {
    const queryClient = useQueryClient();
    const scrollRef = useRef<HTMLDivElement>(null);

    const { data: comments, isLoading } = useGetComments(postId || 0);
    const user = useSelector((state: RootStateType) => state.user)

    const createCommentMutation = useCreateComment();
    const updateCommentMutation = useUpdateComment();
    const deleteCommentMutation = useDeleteComment();

    const [newComment, setNewComment] = useState("");
    const [editingComment, setEditingComment] = useState<EditableComment | null>(null);

    const handleAddComment = async () => {
        if (!newComment.trim() || !postId) return;
        await createCommentMutation.mutateAsync({ postId, text: newComment });
        setNewComment("");
        queryClient.invalidateQueries({ queryKey: ["Comments", postId] });
    };

    const handleUpdateComment = async (commentId: number) => {
        if (!editingComment) return;
        await updateCommentMutation.mutateAsync({ commentId, text: editingComment.text });
        setEditingComment(null);
        queryClient.invalidateQueries({ queryKey: ["Comments", postId] });
    };

    const handleDeleteComment = async (commentId: number) => {
        if (!postId) return;
        await deleteCommentMutation.mutateAsync(commentId);
        queryClient.invalidateQueries({ queryKey: ["Comments", postId] });
    };

    const formatInitials = (name: string) => {
        const parts = name.split(" ");
        if (parts.length >= 2) return parts[0][0] + parts[1][0];
        return name.substring(0, 2).toUpperCase();
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [comments])

    return (
        <Modal show={open} size="lg" onClose={onClose} popup>
            <ModalHeader />
            <ModalBody>
                <div className="flex flex-col h-[70vh]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Comments
                        </h3>

                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                            ✕
                        </button>
                    </div>

                    <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 mb-4 hide-scrollbar">
                        {isLoading ? (
                            <div className="flex justify-center py-16"><Spinner size="xl" /></div>
                        ) : (
                            comments?.map((c) => {
                                const isMine = c.commenterId === user.userId;
                                const isEditing = editingComment?.commentId === c.commentId;

                                return (
                                    <div
                                        key={c.commentId}
                                        className={`flex items-start gap-3 ${isMine ? "justify-end" : "justify-start"}`}
                                    >
                                        {!isMine && (
                                            <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold">
                                                {formatInitials(c.commenterName.toString())}
                                            </div>
                                        )}

                                        <div className={`max-w-xs p-2 rounded-lg ${isMine ? "bg-green-100 text-right" : "bg-gray-100"} flex flex-col`}>
                                            {isEditing ? (
                                                <div className="flex items-center gap-2">
                                                    <TextInput
                                                        value={editingComment.text}
                                                        onChange={(e) => setEditingComment({ ...editingComment, text: e.target.value })}
                                                        sizing="sm"
                                                    />
                                                    <Button size="sm" color="green" onClick={() => handleUpdateComment(c.commentId)}><Check size={16} /></Button>
                                                    <Button size="sm" color="gray" onClick={() => setEditingComment(null)}><X size={16} /></Button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex flex-col">
                                                        {!isMine && (
                                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                                {c.commenterName}
                                                            </span>
                                                        )}
                                                        <span className="break-words whitespace-pre-wrap">{c.text}</span>
                                                        {isMine && (
                                                            <div className="flex justify-end gap-2 mt-1">
                                                                <Button size="xs" color="blue" onClick={() => setEditingComment({ commentId: c.commentId, text: c.text })}><Edit2 size={14} /></Button>
                                                                <Button size="xs" color="red" onClick={() => handleDeleteComment(c.commentId)}><Trash2 size={14} /></Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        {isMine && (
                                            <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold">
                                                {formatInitials(c.commenterName.toString())}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Input */}
                    <div className="flex gap-2">
                        <TextInput
                            className="w-full"
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                        />
                        <Button onClick={handleAddComment} size="sm">
                            <MessageCircle size={16} />
                        </Button>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    );
};

export default CommentModal;