import React from "react"
import {
  Card,
  Badge,
  Dropdown,
  Button,
  DropdownItem,
} from "flowbite-react"
import {
  Heart,
  MessageCircle,
  MoreVertical,
  Briefcase,
  Building2,
  Globe,
  Lock,
  Cpu,
} from "lucide-react"
import type { Post } from "../../../types/AchievementType"
import { useSelector } from "react-redux"
import type { RootStateType } from "../../../redux-store/store"


interface PostCardProps {
  post: Post
  onLike: (id: number) => void
  onUnlike: (id: number) => void
  onEdit: (post: Post) => void
  onDelete: (id: number) => void
  onAuthorClick: (authorId: number) => void
  onComment: (postId: number) => void
  isHR?: boolean
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onUnlike,
  onEdit,
  onDelete,
  onAuthorClick,
  onComment,
  isHR = true,
}) => {
  const user = useSelector((state: RootStateType) => state.user)
  const initials =
    post.author.firstName.charAt(0).toUpperCase() +
    post.author.lastName.charAt(0).toUpperCase()
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-GB', { hour12: true, hour: '2-digit', minute: '2-digit' })

  const handleLikeClick = () => {
    if (post.isLikedByCurrentUser) {
      onUnlike(post.postId)
    } else {
      onLike(post.postId)
    }
  }

  return (
    <Card className="w-full shadow-sm hover:shadow-md transition">
      <div className="flex flex-col gap-4">

        {/* HEADER */}
        <div className="flex justify-between items-start">
          {/* LEFT */}
          <div className="flex gap-3">
            {/* Avatar */}
            <div
              onClick={() => onAuthorClick(post.author.employeeId)}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-600 text-white font-semibold cursor-pointer"
            >
              {initials}
            </div>

            {/* Author Info */}
            <div>
              <p
                onClick={() => onAuthorClick(post.author.employeeId)}
                className="font-semibold text-gray-900 dark:text-white cursor-pointer hover:underline"
              >
                {post.author.firstName} {post.author.lastName}
              </p>

              {/* Role & Department */}
              <div className="flex flex-wrap items-center gap-2 text-xs mt-1">
                <Badge color="info" icon={Briefcase}>
                  {post.author.role}
                </Badge>

                <Badge color="gray" icon={Building2}>
                  {post.author.department}
                </Badge>

                <span className="text-gray-500">
                  • {formattedDate}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2">
            {/* Visibility Badge */}
            {post.isSystemGenerated ? (
              <Badge color="purple" icon={Cpu}>
                System
              </Badge>
            ) : post.isPublic ? (
              <Badge color="success" icon={Globe}>
                Public
              </Badge>
            ) : (
              <Badge color="warning" icon={Lock}>
                Protected
              </Badge>
            )}

            {/* Dropdown */}
            {(user.userId == post.author.employeeId || user.role == 'HR') &&
              <Dropdown
                inline
                label={<MoreVertical className="w-5 h-5 cursor-pointer" />}
                arrowIcon={false}
              >
                {user.userId == post.author.employeeId && (
                  <DropdownItem onClick={() => onEdit(post)}>
                    Edit
                  </DropdownItem>
                )}
                <DropdownItem
                  onClick={() => onDelete(post.postId)}
                >
                  Delete
                </DropdownItem>
                {/* <DropdownItem>Report</DropdownItem> */}
              </Dropdown>
            }
          </div>
        </div>

        {/* CONTENT */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {post.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 whitespace-pre-line">
            {post.description}
          </p>
        </div>

        {/* TAGS */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs font-medium px-3 py-1 rounded-full 
                   bg-blue-50 text-blue-600 
                   dark:bg-blue-900/30 dark:text-blue-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* FOOTER */}
        <div className="flex items-center gap-6 pt-2 border-t">
          {/* Like */}
          <Button
            size="sm"
            color="light"
            onClick={handleLikeClick}
            className="flex items-center gap-2"
          >
            <Heart
              className={`w-4 h-4 ${post.isLikedByCurrentUser
                ? "fill-red-500 text-red-500"
                : "text-gray-500"
                }`}
            />
            <span>{post.likeCount}</span>
          </Button>

          {/* Comment */}
          <Button
            size="sm"
            color="light"
            className="flex items-center gap-2"
            onClick={() => onComment(post.postId)}
          >
            <MessageCircle className="w-4 h-4 text-gray-500" />
            <span>{post.commentCount}</span>
          </Button>
        </div>
      </div>
    </Card>
  )
}