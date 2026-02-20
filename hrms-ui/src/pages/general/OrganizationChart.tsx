import React, { useMemo, useState } from 'react'
import { useGetEmployees, useGetOrgChartByEmployee } from '../../query/EmployeeQuery'
import { useSelector } from 'react-redux';
import type { RootStateType } from '../../redux-store/store';
import { Button, Card, Dropdown, DropdownItem, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
import type { EmployeeDetailType } from '../../types/AuthType';
import { Tree, TreeNode } from 'react-organizational-chart'
import type { TravelEmployeeType } from '../../types/TravelPlan';
import InputField from '../../common/InputField';

function ChartNode({ detail, setSelectNode }: { detail: EmployeeDetailType, setSelectNode: Function }) {
    const user = useSelector((state: RootStateType) => state.user);
    return (
        <Card className={`w-30 inline-block ${user.userId == detail?.employeeId && 'bg-blue-300'}`}
            onClick={() => setSelectNode(detail)}>
            {detail?.firstName + " " + detail?.lastName}
        </Card>
    );
}

function OrganizationChart() {
    const user = useSelector((state: RootStateType) => state.user);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<number>(user.userId);
    const { data } = useGetOrgChartByEmployee(selectedEmployeeId);
    const [selectNode, setSelectNode] = useState<EmployeeDetailType>();
    const { data: employees } = useGetEmployees();
    const [query, setQuery] = useState('')
    // console.log(data)
    const makeTree = (emp: EmployeeDetailType) => (
        <TreeNode label={<ChartNode detail={emp} setSelectNode={setSelectNode} />}>
            {emp.childEmployee && emp.childEmployee.map(makeTree)}
        </TreeNode>
    )

    const filterEmployee = useMemo(() => {
        // console.log('called')
        if (query)
            return employees?.filter((emp) => {
                return emp.firstName.toLowerCase().startsWith(query) || emp.lastName.toLowerCase().startsWith(query)
            })
    }, [query]);
    return (
        <>
            <div className='flex gap-6 mb-5'>
                <h1 className="text-3xl font-bold text-gray-500">Organization Chart</h1>
                <Dropdown label='Select Employee' className='ml-auto' >
                    <div className='p-2'>
                        <InputField value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.stopPropagation()}></InputField>
                        {filterEmployee && (
                            filterEmployee.map(emp =>
                                <DropdownItem key={emp.employeeId} onClick={() => setSelectedEmployeeId(emp.employeeId)}>
                                    {emp.firstName + ' ' + emp.lastName}
                                </DropdownItem>
                            )
                        )}
                    </div>
                </Dropdown>
            </div>

            <div className='justify-items-center'>
                <Tree label={<ChartNode detail={data!} setSelectNode={setSelectNode} />}>
                    {data?.childEmployee && data.childEmployee.map(makeTree)}
                </Tree>
            </div>

            <Modal show={selectNode != undefined}>
                <ModalHeader>{selectNode?.firstName + " " + selectNode?.lastName} - {selectNode?.roleName}</ModalHeader>
                <ModalBody>
                    <p>
                        <strong>Department:</strong>{" "}
                        {selectNode?.departmentName}
                    </p>
                    <p>
                        <strong>Joining Date:</strong>{" "}
                        {new Date(selectNode?.joiningDate!).toLocaleDateString('en-GB')}
                    </p>
                    <p>
                        <strong>Email:</strong>{" "}
                        {selectNode?.email}
                    </p>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={() => setSelectNode(undefined)}>Close</Button>
                </ModalFooter>
            </Modal>
        </>
    )
}

export default OrganizationChart