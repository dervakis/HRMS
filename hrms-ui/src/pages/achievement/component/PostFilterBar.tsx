import React, { useState, useMemo } from "react"
import {
    Button,
    Dropdown,
    TextInput,
    Badge,
    Label,
    DropdownItem,
} from "flowbite-react"
import { Check, Filter, FilterX, RefreshCcw, Search, X } from "lucide-react"
import { toast } from "react-hot-toast"
import type { PostFilters } from "../../../types/AchievementType"
import { useGetDepartments, useGetEmployees, useGetRoles } from "../../../query/EmployeeQuery"

interface PostFilterBarProps {
    onApply: (filters: PostFilters) => void
}

export const PostFilterBar: React.FC<PostFilterBarProps> = ({
    onApply,
}) => {
    const [filters, setFilters] = useState<PostFilters>({
        roles: [],
        departments: [],
        authorId: null,
        dateFrom: undefined,
        dateTo: undefined,
    })
    const { data: roles } = useGetRoles();
    const { data: departments } = useGetDepartments();
    const { data: employees } = useGetEmployees();

    const [roleSearch, setRoleSearch] = useState("")
    const [deptSearch, setDeptSearch] = useState("")
    const [authorSearch, setAuthorSearch] = useState("")

    /* ===================== FILTER HELPERS ===================== */

    const toggleMultiSelect = (
        key: "roles" | "departments",
        id: number
    ) => {
        setFilters((prev) => {
            const exists = prev[key].includes(id)
            return {
                ...prev,
                [key]: exists
                    ? prev[key].filter((item) => item !== id)
                    : [...prev[key], id],
            }
        })
    }

    const handleAuthorSelect = (id: number) => {
        setFilters((prev) => ({
            ...prev,
            authorId: id,
        }))
    }

    const handleDateChange = (
        key: "dateFrom" | "dateTo",
        value: string
    ) => {
        const selectedDate = value ? new Date(value) : undefined

        setFilters((prev) => {
            const updated = { ...prev, [key]: selectedDate }

            if (
                updated.dateFrom &&
                updated.dateTo &&
                updated.dateTo < updated.dateFrom
            ) {
                toast.error("End date cannot be earlier than start date")
                return prev
            }

            return updated
        })
    }

    const handleApply = () => {
        onApply(filters)
    }
    const handleReset = () => {
        setFilters({
            roles: [],
            departments: [],
            authorId: null,
            dateFrom: undefined,
            dateTo: undefined,
        })
        onApply({
            roles: [],
            departments: [],
            authorId: null,
            dateFrom: undefined,
            dateTo: undefined,
        })
    }

    /* ===================== SEARCH FILTERED LIST ===================== */

    const filteredRoles = useMemo(
        () =>
            roles?.filter((r) =>
                r.roleName.toLowerCase().startsWith(roleSearch.toLowerCase())
            ),
        [roles, roleSearch]
    )

    const filteredDepartments = useMemo(
        () =>
            departments?.filter((d) =>
                d.departmentName.toLowerCase().startsWith(deptSearch.toLowerCase())
            ),
        [departments, deptSearch]
    )

    const filteredEmployees = useMemo(
        () =>
            employees?.filter((e) =>
                `${e.firstName} ${e.lastName}`
                    .toLowerCase()
                    .includes(authorSearch.toLowerCase())
            ),
        [employees, authorSearch]
    )

    /* ===================== COMPONENT ===================== */

    return (
        <div className="w-full bg-blue-200 dark:bg-gray-900 p-2 rounded-lg shadow-sm">
            <div className="flex flex-wrap item-end justify-between">

                {/* ROLES */}
                <div>
                    <Label>Roles</Label>
                    <Dropdown label="Select Roles" dismissOnClick={true}>
                        <div className="p-2 w-56">
                            <TextInput
                                placeholder="Search..."
                                icon={Search}
                                value={roleSearch}
                                onChange={(e) => setRoleSearch(e.target.value)}
                                className="mb-2"
                                onKeyDown={(e) => e.stopPropagation()}
                            />
                            <div className="max-h-40 overflow-y-auto">
                                {filteredRoles?.map((role) => (
                                    <DropdownItem
                                        key={role.roleId}
                                        onClick={() => toggleMultiSelect("roles", role.roleId)}
                                        className="cursor-pointer px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                    >
                                        {role.roleName}
                                    </DropdownItem>
                                ))}
                            </div>
                        </div>
                    </Dropdown>


                </div>

                {/* DEPARTMENTS */}
                <div>
                    <Label>Departments</Label>
                    <Dropdown label="Select Departments" dismissOnClick={true}>
                        <div className="p-2 w-56">
                            <TextInput
                                placeholder="Search..."
                                icon={Search}
                                value={deptSearch}
                                onChange={(e) => setDeptSearch(e.target.value)}
                                className="mb-2"
                                onKeyDown={(e) => e.stopPropagation()}
                            />
                            <div className="max-h-40 overflow-y-auto">
                                {filteredDepartments?.map((dept) => (
                                    <DropdownItem
                                        key={dept.departmentId}
                                        onClick={() =>
                                            toggleMultiSelect("departments", dept.departmentId)
                                        }
                                        className="cursor-pointer px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                    >
                                        {dept.departmentName}
                                    </DropdownItem>
                                ))}
                            </div>
                        </div>
                    </Dropdown>
                </div>

                {/* AUTHOR */}
                <div>
                    <Label>Author</Label>
                    <Dropdown label="Select Author" >
                        <div className="p-2 w-56">
                            <TextInput
                                placeholder="Search employee..."
                                icon={Search}
                                value={authorSearch}
                                onChange={(e) => setAuthorSearch(e.target.value)}
                                className="mb-2"
                                onKeyDown={(e) => e.stopPropagation()}
                            />
                            <div className="max-h-40 overflow-y-auto">
                                {filteredEmployees?.map((emp) => (
                                    <DropdownItem
                                        key={emp.employeeId}
                                        onClick={() =>
                                            handleAuthorSelect(emp.employeeId)
                                        }
                                        className="cursor-pointer px-2 py-1 hover:bg-gray-100 rounded text-sm"
                                    >
                                        {emp.firstName} {emp.lastName}
                                    </DropdownItem>
                                ))}
                            </div>
                        </div>
                    </Dropdown>
                </div>

                {/* DATE FROM */}
                <div>
                    <Label>From</Label>
                    <TextInput
                        type="date"
                        onChange={(e) =>
                            handleDateChange("dateFrom", e.target.value)
                        }
                    />
                </div>

                {/* DATE TO */}
                <div>
                    <Label>To</Label>
                    <TextInput
                        type="date"
                        onChange={(e) =>
                            handleDateChange("dateTo", e.target.value)
                        }
                    />
                </div>

                {/* APPLY BUTTON */}
                <div className="flex flex-col">
                    <div className="p-1">
                        <Filter color="blue" onClick={handleApply} />
                    </div>
                    <div className="p-1">
                        <RefreshCcw onClick={handleReset} />
                    </div>
                </div>
            </div>
            <div>
                {/* Selected Roles */}
                <div className="flex flex-wrap gap-1">
                    {filters.roles.map((id) => {
                        const role = roles?.find((r) => r.roleId === id)
                        if (!role) return null
                        return (
                            <Badge key={id} icon={Check} className="pr-4" color="info" onClick={() => toggleMultiSelect("roles", id)}>
                                {role.roleName}
                            </Badge>
                        )
                    })}

                    {filters.departments.map((id) => {
                        const dept = departments?.find((d) => d.departmentId == id)
                        if (!dept) return null
                        return (
                            <Badge key={id} icon={Check} className="pr-4" color="gray" onClick={() => toggleMultiSelect("departments", id)}>
                                {dept.departmentName}
                            </Badge>
                        )
                    })}

                    {filters.authorId && (
                        <Badge icon={Check} className="pr-4" color="blue" onClick={() =>
                            setFilters((prev) => ({
                                ...prev,
                                authorId: null,
                            })
                            )}>
                            {employees?.find((e) => e.employeeId === filters.authorId)?.firstName}</Badge>
                    )}
                </div>
            </div>
        </div>
    )
}