import { useState } from "react";
import { useCreateDepartment, useCreateEmployee, useCreateRole, useDeleteDepartment, useDeleteEmployee, useDeleteRole, useGetDepartments, useGetEmployees, useGetEmployeesPage, useGetRoles, useUpdateDepartment, useUpdateEmployee, useUpdateRole } from "../../query/EmployeeQuery";
import type { DepartmentType, EmployeeRequestType, RoleType } from "../../types/CommonType";
import toast from "react-hot-toast";
import type { ApiErrorType } from "../../types/ApiResponse";
import { Button, Card, Select, Spinner, TextInput } from "flowbite-react";
import { Check, Edit, Trash2, X } from "lucide-react";
import Loader from "../../common/Loader";
import { useQueryClient } from "@tanstack/react-query";
import { data } from "react-router-dom";

const EmployeeConfiguration = () => {
    const queryClient = useQueryClient();
    const { data: allEmployees, refetch: refetchEmp } = useGetEmployees();

    const { data: departments, isLoading: depFetching } = useGetDepartments();
    const createDepartment = useCreateDepartment();
    const updateDepartment = useUpdateDepartment();
    const deleteDepartment = useDeleteDepartment();

    const [departmentEditIndex, setDepartmentEditIndex] = useState<number | null>(null);
    const [departmentNewName, setDepartmentNewName] = useState("");
    const [departmentUpdateName, setDepartmentUpdateName] = useState<string | null>(null);

    const { data: roles, isLoading: roleFetching } = useGetRoles();
    const createRoleMutation = useCreateRole();
    const updateRoleMutation = useUpdateRole();
    const deleteRoleMutation = useDeleteRole();

    const [roleEditIndex, setRoleEditIndex] = useState<number | null>(null);
    const [roleNewName, setRoleNewName] = useState("");
    const [roleUpdateName, setRoleUpdateName] = useState<string | null>(null);

    const [filterRoleId, setFilterRoleId] = useState<number | undefined>(undefined);
    const [filterDeptId, setFilterDeptId] = useState<number | undefined>(undefined);
    const [page, setPage] = useState(0);

    const { data: employeePage, refetch: refetchEmployees, isFetching: empFetching } = useGetEmployeesPage({ page, size: 10, roleId: filterRoleId, departmentId: filterDeptId });
    // console.log(employeePage)
    const createEmployeeMutation = useCreateEmployee();
    const updateEmployeeMutation = useUpdateEmployee();
    const deleteEmployeeMutation = useDeleteEmployee();

    const [employeeEditId, setEmployeeEditId] = useState<number | null>(null);
    const [newEmployee, setNewEmployee] = useState<EmployeeRequestType>({
        firstName: "",
        lastName: "",
        email: "",
        dateOfBirth: "",
        joiningDate: "",
        departmentId: undefined,
        roleId: undefined,
        managerId: undefined
    });

    const resetNewEmployee = () => {
        setNewEmployee({
            firstName: "",
            lastName: "",
            email: "",
            dateOfBirth: "",
            joiningDate: "",
            departmentId: undefined,
            roleId: undefined,
            managerId: undefined,
        });
    };
    const handleCreateDepartment = () => {
        if (!departmentNewName) return;
        createDepartment.mutate(departmentNewName, {
            onSuccess: (data) => {
                setDepartmentNewName("");
                queryClient.setQueryData(['Departments'], (oldData: DepartmentType[]) => [...oldData, data])
            },
            onError: (err) => toast.error(err.message)
        })
    };

    const handleCreateRole = async () => {
        if (!roleNewName) return;
        createRoleMutation.mutate(roleNewName, {
            onSuccess: (data) => {
                queryClient.setQueryData(['Roles'], (oldData: RoleType[]) => [...oldData, data]);
                setRoleNewName("");
            },
            onError: (err) => toast.error(err.message)
        })
    };

    const handleCreateEmployee = async () => {
        await createEmployeeMutation.mutateAsync(newEmployee, {
            onError: (error: unknown) => toast.error((error as ApiErrorType).details?.join(' , ')!)
        });
        setNewEmployee({
            firstName: "",
            lastName: "",
            email: "",
            dateOfBirth: "",
            joiningDate: "",
            departmentId: undefined,
            roleId: undefined,
            managerId: undefined
        });
        refetchEmployees();
        refetchEmp();
    };

    const totalPages = employeePage?.totalPages || 0;

    return (
        <div className="p-4 space-y-4">
            <Card>
                <h2 className="text-xl font-bold">Departments Configuration</h2>
                <div className="overflow-x-auto">
                    <table className="w-full table-auto text-center">
                        <thead className='border-b'>
                            <tr>
                                <th className="px-3 py-3">#</th>
                                <th className="px-3 py-3">Department Name</th>
                                <th className="px-3 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {depFetching ? <div className='flex items-center justify-center'><Spinner /></div> :
                                departments?.map((dept, index) => (
                                    <tr key={dept.departmentId} className="border-b">
                                        <td className="px-4 py-2">{index + 1}</td>
                                        <td className="px-4 py-2">
                                            {departmentEditIndex === index ? (
                                                <TextInput
                                                    value={departmentUpdateName!}
                                                    onChange={(e) => setDepartmentUpdateName(e.target.value)}
                                                />
                                            ) : (
                                                dept.departmentName
                                            )}
                                        </td>
                                        <td className="px-4 py-2">
                                            {departmentEditIndex === index ? (
                                                <div className="flex gap-2 justify-center">
                                                    <Button
                                                        size="sm"
                                                        color='green'
                                                        onClick={async () => {
                                                            updateDepartment.mutate({ departmentId: dept.departmentId, departmentName: departmentUpdateName! }, {
                                                                onSuccess: (data) => {
                                                                    queryClient.setQueryData(['Departments'], (oldData: DepartmentType[]) => oldData.map(item => item.departmentId != data.departmentId ? item : data));
                                                                    setDepartmentEditIndex(null);
                                                                },
                                                                onError: (err) => toast.error(err.message)
                                                            })
                                                        }}
                                                    ><Check /></Button>
                                                    <Button size="sm" color='gray' onClick={() => setDepartmentEditIndex(null)}><X /></Button>
                                                </div>
                                            ) : (
                                                <div className="flex gap-2 justify-center">
                                                    <Button
                                                        size="sm"
                                                        color='gray'
                                                        onClick={() => {
                                                            setDepartmentEditIndex(index);
                                                            setDepartmentUpdateName(dept.departmentName);
                                                        }}
                                                    ><Edit /></Button>
                                                    <Button size="sm" color='red' onClick={async () => {
                                                        deleteDepartment.mutate(dept.departmentId, {
                                                            onSuccess: (data) => queryClient.setQueryData(['Departments'], (oldData: DepartmentType[]) => oldData.filter(item => item.departmentId != dept.departmentId)),
                                                            onError: (err) => toast.error(err.message)
                                                        })
                                                    }}
                                                    ><Trash2 /></Button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}

                            <tr >
                                <td></td>
                                <td className="px-4 py-2">
                                    <TextInput
                                        placeholder="New Department"
                                        value={departmentNewName!}
                                        onChange={(e) => setDepartmentNewName(e.target.value)}
                                    />
                                </td>
                                <td className="px-4 py-2 flex justify-center">
                                    <Button size="sm" onClick={handleCreateDepartment}>Add</Button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Card>

            <Card>
                <h2 className="text-xl font-bold">Roles Configuration</h2>
                <div className="overflow-x-auto">
                    <table className="w-full table-auto text-center">
                        <thead className="border-b">
                            <tr>
                                <th className="px-3 py-3">#</th>
                                <th className="px-3 py-3">Role Name</th>
                                <th className="px-3 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roleFetching ? <Spinner /> :
                                roles?.map((role, index) => (
                                    <tr key={role.roleId} className="border-b">
                                        <td className="px-4 py-2">{index + 1}</td>
                                        <td className="px-4 py-2">
                                            {roleEditIndex === index ? (
                                                <TextInput
                                                    value={roleUpdateName!}
                                                    onChange={(e) => setRoleUpdateName(e.target.value)}
                                                />
                                            ) : (
                                                role.roleName
                                            )}
                                        </td>
                                        <td className="px-4 py-2">
                                            {roleEditIndex === index ? (
                                                <div className="flex gap-2 justify-center">
                                                    <Button size="sm" color="green"
                                                        onClick={async () => {
                                                            updateRoleMutation.mutate({ roleId: role.roleId, roleName: roleUpdateName! }, {
                                                                onSuccess: (data) => {
                                                                    queryClient.setQueryData(['Roles'], (oldData: RoleType[]) => oldData.map(item => item.roleId != data.roleId ? item : data))
                                                                    setRoleEditIndex(null);
                                                                },
                                                                onError: (err) => toast.error(err.message)
                                                            })
                                                            updateRoleMutation
                                                        }}
                                                    >
                                                        <Check />
                                                    </Button>
                                                    <Button size="sm" color="gray" onClick={() => setRoleEditIndex(null)}><X /></Button>
                                                </div>
                                            ) : (
                                                <div className="flex gap-2 justify-center">
                                                    <Button size="sm" color="gray"
                                                        onClick={() => {
                                                            setRoleEditIndex(index);
                                                            setRoleUpdateName(role.roleName);
                                                        }}
                                                    >
                                                        <Edit />
                                                    </Button>

                                                    <Button size="sm" color="red"
                                                        onClick={async () => {
                                                            deleteRoleMutation.mutate(role.roleId, {
                                                                onSuccess: (data) => {
                                                                    queryClient.setQueryData(['Roles'], (oldData: RoleType[]) => oldData.filter(item => item.roleId != role.roleId));
                                                                }
                                                            })
                                                        }}
                                                    >
                                                        <Trash2 />
                                                    </Button>

                                                </div>
                                            )}
                                        </td>

                                    </tr>
                                ))}
                            <tr>
                                <td></td>
                                <td className="px-4 py-2">
                                    <TextInput placeholder="New Role" value={roleNewName} onChange={(e) => setRoleNewName(e.target.value)} />
                                </td>
                                <td className="px-4 py-2 flex justify-center">
                                    <Button size="sm" onClick={handleCreateRole}>Add</Button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Card>

            <Card>
                <h2 className="text-xl font-bold">Employees</h2>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <Select value={filterRoleId || ""}
                        onChange={(e) => {
                            setFilterRoleId(Number(e.target.value) || undefined);
                            setPage(0);
                            setFilterDeptId(undefined)
                        }}
                    >
                        <option value="">Filter by Role</option>
                        {roles?.map((r) => (
                            <option key={r.roleId} value={r.roleId}>
                                {r.roleName}
                            </option>
                        ))}
                    </Select>

                    <Select value={filterDeptId || ""}
                        onChange={(e) => {
                            setFilterDeptId(Number(e.target.value) || undefined);
                            setPage(0);
                            setFilterRoleId(undefined)
                        }}
                    >
                        <option value="">Filter by Department</option>
                        {departments?.map((d) => (
                            <option key={d.departmentId} value={d.departmentId}>
                                {d.departmentName}
                            </option>
                        ))}
                    </Select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full table-auto text-sm md:text-base text-center">
                        <thead className="border-b">
                            <tr>
                                <th className="px-3 py-3">#</th>
                                <th className="px-3 py-3">Name</th>
                                <th className="px-3 py-3">Email</th>
                                <th className="px-3 py-3">DOB</th>
                                <th className="px-3 py-3">Joining</th>
                                <th className="px-3 py-3">Department</th>
                                <th className="px-3 py-3">Role</th>
                                <th className="px-3 py-3">Manager</th>
                                <th className="px-3 py-3">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {empFetching ? <Spinner /> :
                                employeePage?.items.map((emp, idx) => (
                                    <tr key={emp.employeeId} className="border-b">
                                        <td className="px-4 py-2">{idx + 1 + page * 10}</td>

                                        {employeeEditId === emp.employeeId ? (
                                            <>
                                                <td className="px-4 py-2 space-y-2">
                                                    <TextInput value={newEmployee.firstName}
                                                        onChange={(e) =>
                                                            setNewEmployee({
                                                                ...newEmployee,
                                                                firstName: e.target.value,
                                                            })
                                                        }
                                                    />
                                                    <TextInput value={newEmployee.lastName}
                                                        onChange={(e) =>
                                                            setNewEmployee({
                                                                ...newEmployee,
                                                                lastName: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </td>

                                                <td className="px-4 py-2">
                                                    <TextInput value={newEmployee.email}
                                                        onChange={(e) =>
                                                            setNewEmployee({
                                                                ...newEmployee,
                                                                email: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </td>

                                                <td className="px-4 py-2">
                                                    <TextInput type="date"
                                                        value={newEmployee.dateOfBirth}
                                                        onChange={(e) =>
                                                            setNewEmployee({
                                                                ...newEmployee,
                                                                dateOfBirth: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </td>

                                                <td className="px-4 py-2">
                                                    <TextInput type="date" value={newEmployee.joiningDate}
                                                        onChange={(e) =>
                                                            setNewEmployee({
                                                                ...newEmployee,
                                                                joiningDate: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </td>

                                                <td className="px-4 py-2">
                                                    <Select value={newEmployee.departmentId || ""}
                                                        onChange={(e) =>
                                                            setNewEmployee({
                                                                ...newEmployee,
                                                                departmentId:
                                                                    Number(e.target.value) || undefined,
                                                            })
                                                        }
                                                    >
                                                        <option value="">Select</option>
                                                        {departments?.map((d) => (
                                                            <option key={d.departmentId} value={d.departmentId}>
                                                                {d.departmentName}
                                                            </option>
                                                        ))}
                                                    </Select>
                                                </td>

                                                <td className="px-4 py-2">
                                                    <Select value={newEmployee.roleId || ""}
                                                        onChange={(e) =>
                                                            setNewEmployee({
                                                                ...newEmployee,
                                                                roleId:
                                                                    Number(e.target.value) || undefined,
                                                            })
                                                        }
                                                    >
                                                        <option value="">Select</option>
                                                        {roles?.map((r) => (
                                                            <option key={r.roleId} value={r.roleId}>
                                                                {r.roleName}
                                                            </option>
                                                        ))}
                                                    </Select>
                                                </td>

                                                <td className="px-4 py-2">
                                                    <Select value={newEmployee.managerId || ""}
                                                        onChange={(e) =>
                                                            setNewEmployee({
                                                                ...newEmployee,
                                                                managerId:
                                                                    Number(e.target.value) || undefined,
                                                            })
                                                        }
                                                    >
                                                        <option value="">Select</option>
                                                        {allEmployees?.map((m) => (
                                                            <option key={m.employeeId} value={m.employeeId}>
                                                                {m.firstName} {m.lastName}
                                                            </option>
                                                        ))}
                                                    </Select>
                                                </td>

                                                <td className="px-4 py-2">
                                                    <div className="flex gap-2 justify-center">
                                                        <Button size="sm" color="green"
                                                            onClick={async () => {
                                                                await updateEmployeeMutation.mutateAsync({
                                                                    employeeId: emp.employeeId,
                                                                    data: newEmployee,
                                                                });
                                                                setEmployeeEditId(null);
                                                                refetchEmployees();
                                                                resetNewEmployee();
                                                            }}
                                                        >
                                                            <Check />
                                                        </Button>

                                                        <Button size="sm" color="gray"
                                                            onClick={() => {
                                                                resetNewEmployee();
                                                                setEmployeeEditId(null);
                                                            }}
                                                        >
                                                            <X />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="px-4 py-2">
                                                    {emp.firstName} {emp.lastName}
                                                </td>
                                                <td className="px-4 py-2">{emp.email}</td>
                                                <td className="px-4 py-2">
                                                    {new Date(emp.dateOfBirth).toLocaleDateString("en-GB")}
                                                </td>
                                                <td className="px-4 py-2">
                                                    {new Date(emp.joiningDate).toLocaleDateString("en-GB")}
                                                </td>
                                                <td className="px-4 py-2">{emp.departmentName}</td>
                                                <td className="px-4 py-2">{emp.roleName}</td>
                                                <td className="px-4 py-2">
                                                    {emp.managerFirstName} {emp.managerLastName}
                                                </td>

                                                <td className="px-4 py-2">
                                                    <div className="flex gap-2 justify-center">
                                                        <Button size="sm" color="gray"
                                                            onClick={() => {
                                                                setEmployeeEditId(emp.employeeId);
                                                                setNewEmployee({
                                                                    firstName: emp.firstName,
                                                                    lastName: emp.lastName,
                                                                    email: emp.email,
                                                                    dateOfBirth: emp.dateOfBirth.toString(),
                                                                    joiningDate: emp.joiningDate.toString(),
                                                                    departmentId: emp.departmentId,
                                                                    roleId: emp.roleId,
                                                                    managerId: emp.managerId,
                                                                });
                                                            }}
                                                        >
                                                            <Edit />
                                                        </Button>

                                                        <Button size="sm" color="red"
                                                            onClick={async () => {
                                                                await deleteEmployeeMutation.mutateAsync(
                                                                    emp.employeeId
                                                                );
                                                                refetchEmployees();
                                                            }}
                                                        >
                                                            <Trash2 />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}

                            {employeeEditId == null && (
                                <tr className="border-b">
                                    <td className="px-4 py-2">#</td>
                                    <td className="px-4 py-2 space-y-2">
                                        <TextInput placeholder="First Name" value={newEmployee.firstName}
                                            onChange={(e) =>
                                                setNewEmployee({ ...newEmployee, firstName: e.target.value })
                                            }
                                        />
                                        <TextInput placeholder="Last Name" value={newEmployee.lastName}
                                            onChange={(e) =>
                                                setNewEmployee({ ...newEmployee, lastName: e.target.value })
                                            }
                                        />
                                    </td>

                                    <td className="px-4 py-2">
                                        <TextInput placeholder="Email" value={newEmployee.email}
                                            onChange={(e) =>
                                                setNewEmployee({ ...newEmployee, email: e.target.value })
                                            }
                                        />
                                    </td>

                                    <td className="px-4 py-2">
                                        <TextInput type="date" value={newEmployee.dateOfBirth}
                                            onChange={(e) =>
                                                setNewEmployee({ ...newEmployee, dateOfBirth: e.target.value })
                                            }
                                        />
                                    </td>

                                    <td className="px-4 py-2">
                                        <TextInput type="date" value={newEmployee.joiningDate}
                                            onChange={(e) =>
                                                setNewEmployee({ ...newEmployee, joiningDate: e.target.value })
                                            }
                                        />
                                    </td>

                                    <td className="px-4 py-2">
                                        <Select value={newEmployee.departmentId || ""}
                                            onChange={(e) =>
                                                setNewEmployee({
                                                    ...newEmployee,
                                                    departmentId: Number(e.target.value) || undefined,
                                                })
                                            }
                                        >
                                            <option value="">Select Dept</option>
                                            {departments?.map((d) => (
                                                <option key={d.departmentId} value={d.departmentId}>
                                                    {d.departmentName}
                                                </option>
                                            ))}
                                        </Select>
                                    </td>

                                    <td className="px-4 py-2">
                                        <Select value={newEmployee.roleId || ""}
                                            onChange={(e) =>
                                                setNewEmployee({
                                                    ...newEmployee,
                                                    roleId: Number(e.target.value) || undefined,
                                                })
                                            }
                                        >
                                            <option value="">Select Role</option>
                                            {roles?.map((r) => (
                                                <option key={r.roleId} value={r.roleId}>
                                                    {r.roleName}
                                                </option>
                                            ))}
                                        </Select>
                                    </td>

                                    <td className="px-4 py-2">
                                        <Select value={newEmployee.managerId || ""}
                                            onChange={(e) =>
                                                setNewEmployee({
                                                    ...newEmployee,
                                                    managerId: Number(e.target.value) || undefined,
                                                })
                                            }
                                        >
                                            <option value="">Select Manager</option>
                                            {allEmployees?.map((emp) => (
                                                <option key={emp.employeeId} value={emp.employeeId}>
                                                    {emp.firstName} {emp.lastName}
                                                </option>
                                            ))}
                                        </Select>
                                    </td>

                                    <td className="px-4 py-2">
                                        <div className="flex justify-center">
                                            <Button size="sm" onClick={handleCreateEmployee}>
                                                Add
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between items-center mt-4">
                    <Button size="sm" color="gray" disabled={page === 0} onClick={() => setPage(page - 1)}>Prev</Button>
                    <span className="text-sm">Page {page + 1} of {totalPages}</span>
                    <Button size="sm" color="gray" disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
                </div>
            </Card>

            {(createDepartment.isPending || updateDepartment.isPending || deleteDepartment.isPending
                || createRoleMutation.isPending || updateRoleMutation.isPending || deleteRoleMutation.isPending
                || createEmployeeMutation.isPending || updateEmployeeMutation.isPending || deleteEmployeeMutation.isPending
            ) && <Loader />}
        </div>
    );
};

export default EmployeeConfiguration;
