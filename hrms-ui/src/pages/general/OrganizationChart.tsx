import React, { useState } from 'react'
import { useGetOrgChartByEmployee } from '../../query/EmployeeQuery'
import { useSelector } from 'react-redux';
import type { RootStateType } from '../../redux-store/store';
import { Button, Card, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
import type { EmployeeDetailType } from '../../types/AuthType';
import { Tree, TreeNode } from 'react-organizational-chart'

function ChartNode({ detail, setSelectNode }: { detail: EmployeeDetailType, setSelectNode: Function }) {
    const user = useSelector((state: RootStateType) => state.user);
    return (
        <Card className={`w-30 inline-block ${user.userId == detail?.employeeId && 'border border-3 border-green-400 border-dashed'}`}
            onClick={() => setSelectNode(detail)}>
            {detail?.firstName + " " + detail?.lastName}
        </Card>
    );
}

function OrganizationChart() {
    const user = useSelector((state: RootStateType) => state.user);
    const { data } = useGetOrgChartByEmployee(user.userId);
    const [selectNode, setSelectNode] = useState<EmployeeDetailType>()
    // console.log(data)
    const makeTree = (emp: EmployeeDetailType) => (
        <TreeNode label={<ChartNode detail={emp} setSelectNode={setSelectNode} />}>
            {emp.childEmployee && emp.childEmployee.map(makeTree)}
        </TreeNode>
    )
    return (
        <>
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