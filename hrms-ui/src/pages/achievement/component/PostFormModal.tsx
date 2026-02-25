import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import {
    Modal,
    Button,
    Label,
    TextInput,
    Textarea,
    ToggleSwitch,
    Badge,
    Dropdown,
    Spinner,
    ModalHeader,
    ModalBody,
    DropdownItem,
    ModalFooter,
} from "flowbite-react"
import { Hash, X } from "lucide-react"
import type { CreatePostPayload, UpdatePostPayload } from "../../../types/AchievementType"
import { useGetDepartments, useGetRoles } from "../../../query/EmployeeQuery"
import { useSelector } from "react-redux"
import type { RootStateType } from "../../../redux-store/store"

type Props = {
    open: boolean
    onClose: () => void
    mode: "create" | "edit"
    defaultValues?: UpdatePostPayload
    onSubmit: (data: any) => void
    isLoading?: boolean
}

export default function PostFormModal({
    open,
    onClose,
    mode,
    defaultValues,
    onSubmit,
    isLoading,
}: Props) {
    const { data: roles } = useGetRoles()
    const { data: departments } = useGetDepartments()

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm<CreatePostPayload>({
        defaultValues: {
            title: "",
            description: "",
            isPublic: true,
            tags: [],
            targetRoleIds: [],
            targetDepartmentIds: [],
        },
    })

    const isPublic = watch("isPublic")
    const selectedTags = watch("tags")
    const selectedRoleIds = watch("targetRoleIds")
    const selectedDeptIds = watch("targetDepartmentIds")

    const [tagInput, setTagInput] = useState("")
    const [roleSearch, setRoleSearch] = useState("")
    const [deptSearch, setDeptSearch] = useState("")

    // Prefill for edit
    useEffect(() => {
        if (mode === "edit" && defaultValues) {
            reset(defaultValues)
        }
    }, [defaultValues, mode, reset])

    // ---------------- TAG HANDLING ----------------

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault()

            const cleanTag = tagInput.replace("#", "").trim().toLowerCase()
            if (!cleanTag) return

            if (!selectedTags.includes(cleanTag)) {
                setValue("tags", [...selectedTags, cleanTag])
            }

            setTagInput("")
        }
    }

    const removeTag = (tag: string) => {
        setValue(
            "tags",
            selectedTags.filter((t) => t !== tag)
        )
    }

    // ---------------- FILTER ----------------

    const filteredRoles = useMemo(() => {
        return roles?.filter((r: any) =>
            r.roleName.toLowerCase().includes(roleSearch.toLowerCase())
        )
    }, [roles, roleSearch])

    const filteredDepartments = useMemo(() => {
        return departments?.filter((d: any) =>
            d.departmentName.toLowerCase().includes(deptSearch.toLowerCase())
        )
    }, [departments, deptSearch])

    // ---------------- TOGGLE SELECTION ----------------

    const toggleRole = (id: number) => {
        if (selectedRoleIds.includes(id)) {
            setValue(
                "targetRoleIds",
                selectedRoleIds.filter((r) => r !== id)
            )
        } else {
            setValue("targetRoleIds", [...selectedRoleIds, id])
        }
    }

    const toggleDepartment = (id: number) => {
        if (selectedDeptIds.includes(id)) {
            setValue(
                "targetDepartmentIds",
                selectedDeptIds.filter((d) => d !== id)
            )
        } else {
            setValue("targetDepartmentIds", [...selectedDeptIds, id])
        }
    }

    // ---------------- SUBMIT ----------------

    const submitHandler = (data: CreatePostPayload) => {
        const payload =
            mode === "edit"
                ? { ...data, postId: defaultValues?.postId }
                : data

        onSubmit(payload)
        reset()
    }

    return (
        <Modal show={open} onClose={onClose} size="2xl">
            <ModalHeader>
                {mode === "create" ? "Create Post" : "Edit Post"}
            </ModalHeader>

            <ModalBody>
                <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">

                    {/* Title */}
                    <div>
                        <Label>Title</Label>
                        <TextInput
                            {...register("title", { required: "Title is required" })}
                            placeholder="Post title"
                            color={errors.title ? "failure" : "gray"}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <Label>Description</Label>
                        <Textarea
                            rows={4}
                            {...register("description", {
                                required: "Description is required",
                            })}
                            placeholder="Write something..."
                        />
                    </div>

                    {/* TAG INPUT */}
                    <div>
                        <Label>Tags</Label>
                        <TextInput
                            icon={Hash}
                            placeholder="#TypeTagAndPressEnter"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagKeyDown}
                        />

                        <div className="flex flex-wrap gap-2 mt-3">
                            {selectedTags.map((tag) => (
                                <Badge
                                    key={tag}
                                    color="info"
                                    className="cursor-pointer flex items-center gap-1"
                                    onClick={() => removeTag(tag)}
                                >
                                    #{tag}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Public Toggle */}
                    <ToggleSwitch
                        checked={isPublic}
                        label="Public Post"
                        onChange={(val) => setValue("isPublic", val)}
                    />

                    {/* Conditional Section */}
                    {!isPublic && (
                        <div className="flex justify-between">

                            {/* Role Dropdown */}
                            <div>
                                <Label>Select Roles</Label>
                                <Dropdown label="Choose Roles" dismissOnClick={true}>
                                    <div className="px-3 pb-2">
                                        <TextInput
                                            placeholder="Search role..."
                                            value={roleSearch}
                                            onKeyDown={(e) => e.stopPropagation()}
                                            onChange={(e) => setRoleSearch(e.target.value)}
                                        />
                                    </div>

                                    {filteredRoles?.map((role: any) => (
                                        <DropdownItem
                                            key={role.roleId}
                                            onClick={() => toggleRole(role.roleId)}
                                        >
                                            {role.roleName}
                                        </DropdownItem>
                                    ))}
                                </Dropdown>

                                <div className="flex flex-wrap gap-2 mt-2">
                                    {selectedRoleIds.map((id) => {
                                        const role = roles?.find((r: any) => r.roleId === id)
                                        return (
                                            <Badge
                                                key={id}
                                                color="purple"
                                                className="cursor-pointer"
                                                onClick={() => toggleRole(id)}
                                            >
                                                {role?.roleName}
                                            </Badge>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Department Dropdown */}
                            <div>
                                <Label>Select Departments</Label>
                                <Dropdown label="Choose Departments" dismissOnClick={true}>
                                    <div className="px-3 pb-2">
                                        <TextInput
                                            placeholder="Search department..."
                                            value={deptSearch}
                                            onKeyDown={(e) => e.stopPropagation()}
                                            onChange={(e) => setDeptSearch(e.target.value)}
                                        />
                                    </div>

                                    {filteredDepartments?.map((dept: any) => (
                                        <DropdownItem
                                            key={dept.departmentId}
                                            onClick={() => toggleDepartment(dept.departmentId)}
                                        >
                                            {dept.departmentName}
                                        </DropdownItem>
                                    ))}
                                </Dropdown>

                                <div className="flex flex-wrap gap-2 mt-2">
                                    {selectedDeptIds.map((id) => {
                                        const dept = departments?.find(
                                            (d: any) => d.departmentId === id
                                        )
                                        return (
                                            <Badge
                                                key={id}
                                                color="success"
                                                className="cursor-pointer"
                                                onClick={() => toggleDepartment(id)}
                                            >
                                                {dept?.departmentName}
                                            </Badge>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </form>
            </ModalBody>

            <ModalFooter>
                <Button color="gray" onClick={onClose}>
                    Cancel
                </Button>

                <Button onClick={handleSubmit(submitHandler)}>
                    {isLoading ? (
                        <Spinner size="sm" />
                    ) : mode === "create" ? (
                        "Create"
                    ) : (
                        "Update"
                    )}
                </Button>
            </ModalFooter>
        </Modal>
    )
}