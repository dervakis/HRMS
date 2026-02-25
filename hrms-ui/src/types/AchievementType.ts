export interface CreatePostPayload {
    title: string
    description: string
    isPublic: boolean
    tags: string[]
    targetRoleIds: number[]
    targetDepartmentIds: number[]
}

export interface UpdatePostPayload extends Partial<CreatePostPayload> {
    postId: number
}

export interface PostFilters {
    roles: number[]
    departments: number[]
    authorId: number | null
    dateFrom: Date | undefined
    dateTo: Date | undefined
}


export interface Employee {
    employeeId: number
    firstName: string
    lastName: string
    dateOfBirth: string
    email: string
    joiningDate: string
    department: string
    role: string
}

export interface Post {
    postId: number
    title: string
    description: string
    createdAt: string
    isPublic: boolean
    isSystemGenerated: boolean
    author: Employee
    tags: string[]
    roleIds: number[]
    departmentIds: number[]
    likeCount: number
    commentCount: number
    isLikedByCurrentUser: boolean
}

export interface PaginatedResponse<T> {
    items: T[]
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
}

export interface CreateCommentPayload {
    postId: number
    text: string
}

export interface UpdateCommentPayload {
    commentId: number
    text: string
}

export interface Comment {
    commentId: number
    text: string
    commentedAt: string
    postId: number
    commenterId: number
    commenterName: string
}