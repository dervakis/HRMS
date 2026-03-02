import React, { useState, useEffect } from "react";
import { useCreateDepartment, useCreateEmployee, useCreateRole, useDeleteDepartment, useDeleteEmployee, useDeleteRole, useGetDepartments, useGetEmployees, useGetEmployeesPage, useGetRoles, useUpdateDepartment, useUpdateEmployee, useUpdateRole } from "../../query/EmployeeQuery";
import type { EmployeeRequestType } from "../../types/CommonType";
import toast from "react-hot-toast";
import type { ApiErrorType } from "../../types/ApiResponse";

const EmployeeConfiguration = () => {
    const { data: allEmployees } = useGetEmployees();

    const { data: departments, refetch: refetchDept } = useGetDepartments();
    const createDepartment = useCreateDepartment();
    const updateDepartment = useUpdateDepartment();
    const deleteDepartment = useDeleteDepartment();

    const [departmentEditIndex, setDepartmentEditIndex] = useState<number | null>(null);
    const [departmentNewName, setDepartmentNewName] = useState("");
    const [departmentUpdateName, setDepartmentUpdateName] = useState<string | null>(null);

    const { data: roles, refetch: refetchRole } = useGetRoles();
    const createRoleMutation = useCreateRole();
    const updateRoleMutation = useUpdateRole();
    const deleteRoleMutation = useDeleteRole();

    const [roleEditIndex, setRoleEditIndex] = useState<number | null>(null);
    const [roleNewName, setRoleNewName] = useState("");
    const [roleUpdateName, setRoleUpdateName] = useState<string | null>(null);

    const [filterRoleId, setFilterRoleId] = useState<number | undefined>(undefined);
    const [filterDeptId, setFilterDeptId] = useState<number | undefined>(undefined);
    const [page, setPage] = useState(0);

    const { data: employeePage, refetch: refetchEmployees } = useGetEmployeesPage({ page, size: 10, roleId: filterRoleId, departmentId: filterDeptId });
    // console.log(employeePage)
    const createEmployeeMutation = useCreateEmployee();
    const updateEmployeeMutation = useUpdateEmployee();
    // const deleteEmployeeMutation = useDeleteEmployee();

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
    const handleCreateDepartment = async () => {
        if (!departmentNewName) return;
        await createDepartment.mutateAsync(departmentNewName);
        refetchDept()
        setDepartmentNewName("");
    };

    const handleCreateRole = async () => {
        if (!roleNewName) return;
        await createRoleMutation.mutateAsync(roleNewName);
        refetchRole();
        setRoleNewName("");
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
    };

    const totalPages = employeePage?.totalPages || 0;

    return (
        <div className="p-4 space-y-10">
            <section>
                <h2 className="text-xl font-bold mb-2">Departments</h2>
                <table className="w-full table-auto border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border px-2 py-1">#</th>
                            <th className="border px-2 py-1">Department Name</th>
                            <th className="border px-2 py-1">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments?.map((dept, index) => (
                            <tr key={dept.departmentId}>
                                <td className="border px-2 py-1">{index + 1}</td>
                                <td className="border px-2 py-1">
                                    {departmentEditIndex === index ? (
                                        <input
                                            className="border px-1 py-0.5"
                                            value={departmentUpdateName!}
                                            onChange={(e) => setDepartmentUpdateName(e.target.value)}
                                        />
                                    ) : (
                                        dept.departmentName
                                    )}
                                </td>
                                <td className="border px-2 py-1 space-x-2">
                                    {departmentEditIndex === index ? (
                                        <>
                                            <button
                                                className="bg-green-500 text-white px-2 py-1 rounded"
                                                onClick={async () => {
                                                    await updateDepartment.mutateAsync({ departmentId: dept.departmentId, departmentName: departmentUpdateName!, });
                                                    setDepartmentEditIndex(null);
                                                    refetchDept();
                                                }}
                                            >Save</button>
                                            <button className="bg-gray-300 px-2 py-1 rounded" onClick={() => setDepartmentEditIndex(null)}>Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                className="bg-blue-500 text-white px-2 py-1 rounded"
                                                onClick={() => {
                                                    setDepartmentEditIndex(index);
                                                    setDepartmentUpdateName(dept.departmentName);
                                                }}
                                            >Edit</button>
                                            <button
                                                className="bg-red-500 text-white px-2 py-1 rounded"
                                                onClick={async () => { await deleteDepartment.mutateAsync(dept.departmentId); refetchDept() }}
                                            >Delete</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}

                        <tr className="bg-gray-100">
                            <td className="border px-2 py-1">#</td>
                            <td className="border px-2 py-1">
                                <input
                                    className="border px-1 py-0.5 w-full"
                                    placeholder="New Department"
                                    value={departmentNewName!}
                                    onChange={(e) => setDepartmentNewName(e.target.value)}
                                />
                            </td>
                            <td className="border px-2 py-1">
                                <button
                                    className="bg-green-500 text-white px-2 py-1 rounded"
                                    onClick={handleCreateDepartment}
                                >Add</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section>
                <h2 className="text-xl font-bold mb-2">Roles</h2>
                <table className="w-full table-auto border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border px-2 py-1">#</th>
                            <th className="border px-2 py-1">Role Name</th>
                            <th className="border px-2 py-1">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles?.map((role, index) => (
                            <tr key={role.roleId}>
                                <td className="border px-2 py-1">{index + 1}</td>
                                <td className="border px-2 py-1">
                                    {roleEditIndex === index ? (
                                        <input
                                            className="border px-1 py-0.5"
                                            value={roleUpdateName!}
                                            onChange={(e) => setRoleUpdateName(e.target.value)}
                                        />
                                    ) : (
                                        role.roleName
                                    )}
                                </td>
                                <td className="border px-2 py-1 space-x-2">
                                    {roleEditIndex === index ? (
                                        <>
                                            <button
                                                className="bg-green-500 text-white px-2 py-1 rounded"
                                                onClick={async () => {
                                                    await updateRoleMutation.mutateAsync({ roleId: role.roleId, roleName: roleUpdateName! });
                                                    refetchRole();
                                                    setRoleEditIndex(null);
                                                }}
                                            >Save</button>
                                            <button className="bg-gray-300 px-2 py-1 rounded" onClick={() => setRoleEditIndex(null)}>Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                className="bg-blue-500 text-white px-2 py-1 rounded"
                                                onClick={() => {
                                                    setRoleEditIndex(index);
                                                    setRoleUpdateName(role.roleName);
                                                }}
                                            >Edit</button>
                                            <button
                                                className="bg-red-500 text-white px-2 py-1 rounded"
                                                onClick={async () => { await deleteRoleMutation.mutateAsync(role.roleId); refetchRole() }}
                                            >Delete</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}

                        <tr className="bg-gray-100">
                            <td className="border px-2 py-1">#</td>
                            <td className="border px-2 py-1">
                                <input
                                    className="border px-1 py-0.5 w-full"
                                    placeholder="New Role"
                                    value={roleNewName}
                                    onChange={(e) => setRoleNewName(e.target.value)}
                                />
                            </td>
                            <td className="border px-2 py-1">
                                <button
                                    className="bg-green-500 text-white px-2 py-1 rounded"
                                    onClick={handleCreateRole}
                                >Add</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section>
                <h2 className="text-xl font-bold mb-2">Employees</h2>

                <div className="flex space-x-4 mb-2">
                    <select
                        className="border px-2 py-1"
                        value={filterRoleId || ""}
                        onChange={(e) => {
                            setFilterRoleId(Number(e.target.value) || undefined);
                            setPage(0);
                        }}
                    >
                        <option value="">Filter by Role</option>
                        {roles?.map(r => <option key={r.roleId} value={r.roleId}>{r.roleName}</option>)}
                    </select>

                    <select
                        className="border px-2 py-1"
                        value={filterDeptId || ""}
                        onChange={(e) => {
                            setFilterDeptId(Number(e.target.value) || undefined);
                            setPage(0);
                        }}
                    >
                        <option value="">Filter by Department</option>
                        {departments?.map(d => <option key={d.departmentId} value={d.departmentId}>{d.departmentName}</option>)}
                    </select>
                </div>

                <table className="w-full table-auto text-center border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border px-2 py-1">#</th>
                            <th className="border px-2 py-1">Name</th>
                            <th className="border px-2 py-1">Email</th>
                            <th className="border px-2 py-1">DOB</th>
                            <th className="border px-2 py-1">Joining</th>
                            <th className="border px-2 py-1">Department</th>
                            <th className="border px-2 py-1">Role</th>
                            <th className="border px-2 py-1">Manager</th>
                            <th className="border px-2 py-1">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employeePage?.items.map((emp, idx) => (
                            <tr key={emp.employeeId}>
                                <td className="border px-2 py-1">{idx + 1 + page * 10}</td>
                                {employeeEditId === emp.employeeId ? (
                                    <>
                                        <td>
                                            <input
                                                value={newEmployee.firstName}
                                                onChange={(e) =>
                                                    setNewEmployee({
                                                        ...newEmployee,
                                                        firstName: e.target.value,
                                                    })
                                                }
                                                className="border px-1"
                                            />
                                            <input
                                                value={newEmployee.lastName}
                                                onChange={(e) =>
                                                    setNewEmployee({
                                                        ...newEmployee,
                                                        lastName: e.target.value,
                                                    })
                                                }
                                                className="border px-1 mt-1"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                value={newEmployee.email}
                                                onChange={(e) =>
                                                    setNewEmployee({
                                                        ...newEmployee,
                                                        email: e.target.value,
                                                    })
                                                }
                                                className="border px-1"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="date"
                                                value={newEmployee.dateOfBirth}
                                                onChange={(e) =>
                                                    setNewEmployee({
                                                        ...newEmployee,
                                                        dateOfBirth: e.target.value,
                                                    })
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="date"
                                                value={newEmployee.joiningDate}
                                                onChange={(e) =>
                                                    setNewEmployee({
                                                        ...newEmployee,
                                                        joiningDate: e.target.value,
                                                    })
                                                }
                                            />
                                        </td>
                                        <td>
                                            <select
                                                value={newEmployee.departmentId || ""}
                                                onChange={(e) =>
                                                    setNewEmployee({
                                                        ...newEmployee,
                                                        departmentId:
                                                            Number(e.target.value) ||
                                                            undefined,
                                                    })
                                                }
                                            >
                                                <option value="">Select</option>
                                                {departments?.map((d) => (
                                                    <option
                                                        key={d.departmentId}
                                                        value={d.departmentId}
                                                    >
                                                        {d.departmentName}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <select
                                                value={newEmployee.roleId || ""}
                                                onChange={(e) =>
                                                    setNewEmployee({
                                                        ...newEmployee,
                                                        roleId:
                                                            Number(e.target.value) ||
                                                            undefined,
                                                    })
                                                }
                                            >
                                                <option value="">Select</option>
                                                {roles?.map((r) => (
                                                    <option
                                                        key={r.roleId}
                                                        value={r.roleId}
                                                    >
                                                        {r.roleName}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <select
                                                value={newEmployee.managerId || ""}
                                                onChange={(e) =>
                                                    setNewEmployee({
                                                        ...newEmployee,
                                                        managerId:
                                                            Number(e.target.value) ||
                                                            undefined,
                                                    })
                                                }
                                            >
                                                <option value="">Select</option>
                                                {allEmployees?.map((m) => (
                                                    <option
                                                        key={m.employeeId}
                                                        value={m.employeeId}
                                                    >
                                                        {m.firstName} {m.lastName}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <button
                                                className="bg-green-500 text-white px-2 py-1 rounded"
                                                onClick={async () => {
                                                    await updateEmployeeMutation.mutateAsync({
                                                        employeeId: emp.employeeId,
                                                        data: newEmployee,
                                                    },{
                                                        onError: (error: unknown) => toast.error((error as ApiErrorType).details?.join(' , ')!)
                                                    });
                                                    setEmployeeEditId(null);
                                                    refetchEmployees();
                                                    resetNewEmployee();
                                                }}
                                            >
                                                Save
                                            </button>
                                            <button className="bg-gray-300 px-2 py-1 rounded" onClick={() => { resetNewEmployee(); setEmployeeEditId(null) }}>Cancel</button>

                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="border px-2 py-1">{emp.firstName} {emp.lastName}</td>
                                        <td className="border px-2 py-1">{emp.email}</td>
                                        <td className="border px-2 py-1">{new Date(emp.dateOfBirth).toLocaleDateString('en-GB')}</td>
                                        <td className="border px-2 py-1">{new Date(emp.joiningDate).toLocaleDateString('en-GB')}</td>
                                        <td className="border px-2 py-1">{emp.departmentName}</td>
                                        <td className="border px-2 py-1">{emp.roleName}</td>
                                        <td className="border px-2 py-1">{emp.managerFirstName} {emp.managerLastName}</td>
                                        <td className=" px-2 flex py-1 space-x-2">
                                            <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => {
                                                setEmployeeEditId(
                                                    emp.employeeId
                                                );
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
                                            }}>Edit</button>
                                            {/* <button className="bg-red-500 text-white px-2 py-1 rounded">Delete</button> */}
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}

                        {employeeEditId == null &&
                            <tr className="bg-gray-100">
                                <td className="border px-2 py-1">#</td>
                                <td className="border px-2 py-1">
                                    <input className="border px-1 py-0.5" placeholder="First Name" value={newEmployee.firstName} onChange={(e) => setNewEmployee({ ...newEmployee, firstName: e.target.value })} />
                                    <input className="border px-1 py-0.5 mt-1" placeholder="Last Name" value={newEmployee.lastName} onChange={(e) => setNewEmployee({ ...newEmployee, lastName: e.target.value })} />
                                </td>
                                <td className="border px-2 py-1">
                                    <input className="border px-1 py-0.5" placeholder="Email" value={newEmployee.email} onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })} />
                                </td>
                                <td className="border px-2 py-1">
                                    <input type="date" className="border px-1 py-0.5" value={newEmployee.dateOfBirth} onChange={(e) => setNewEmployee({ ...newEmployee, dateOfBirth: e.target.value })} />
                                </td>
                                <td className="border px-2 py-1">
                                    <input type="date" className="border px-1 py-0.5" value={newEmployee.joiningDate} onChange={(e) => setNewEmployee({ ...newEmployee, joiningDate: e.target.value })} />
                                </td>
                                <td className="border px-2 py-1">
                                    <select className="border px-1 py-0.5 w-full" value={newEmployee.departmentId || ""} onChange={(e) => setNewEmployee({ ...newEmployee, departmentId: Number(e.target.value) || undefined })}>
                                        <option value="">Select Dept</option>
                                        {departments?.map(d => <option key={d.departmentId} value={d.departmentId}>{d.departmentName}</option>)}
                                    </select>
                                </td>
                                <td className="border px-2 py-1">
                                    <select className="border px-1 py-0.5 w-full" value={newEmployee.roleId || ""} onChange={(e) => setNewEmployee({ ...newEmployee, roleId: Number(e.target.value) || undefined })}>
                                        <option value="">Select Role</option>
                                        {roles?.map(r => <option key={r.roleId} value={r.roleId}>{r.roleName}</option>)}
                                    </select>
                                </td>
                                <td className="border px-2 py-1">
                                    <select className="border px-1 py-0.5 w-full" value={newEmployee.managerId || ""} onChange={(e) => setNewEmployee({ ...newEmployee, managerId: Number(e.target.value) || undefined })}>
                                        <option value="">Select Manager</option>
                                        {allEmployees?.map(emp => <option key={emp.employeeId} value={emp.employeeId}>{emp.firstName} {emp.lastName}</option>)}
                                    </select>
                                </td>
                                <td className="border px-2 py-1">
                                    <button className="bg-green-500 text-white px-2 py-1 rounded" onClick={handleCreateEmployee}>Add</button>
                                </td>
                            </tr>
                        }
                    </tbody>
                </table>

                <div className="flex justify-between mt-2">
                    <button
                        disabled={page === 0}
                        className="px-2 py-1 bg-gray-300 rounded disabled:opacity-50"
                        onClick={() => setPage(page - 1)}
                    >Prev</button>
                    <span>Page {page + 1} of {totalPages}</span>
                    <button
                        disabled={page + 1 >= totalPages}
                        className="px-2 py-1 bg-gray-300 rounded disabled:opacity-50"
                        onClick={() => setPage(page + 1)}
                    >Next</button>
                </div>
            </section>
        </div>
    );
};

export default EmployeeConfiguration;
