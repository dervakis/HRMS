import { Badge, Button, Card } from 'flowbite-react'
import React, { useEffect, useMemo, useState } from 'react'
import { useGetTravelPlan } from '../../query/TravelPlanQuery';
import { useGetExpenseByTravelPlan, useVerifyTravelExpense } from '../../query/ExpenseQuery';
import toast from 'react-hot-toast';
import { CircleCheck, Eye, X } from 'lucide-react';
import { useGetDocumentByUrl } from '../../query/DocumentQuery';
import SelectOption from '../../common/SelectOption';
import ConfirmModal from '../achievement/component/ConfirmModal';

function ManageExpense() {
  const [selectedPlanId, setSelectedPlanId] = useState<number>();
  const { data: travelPlans = [] } = useGetTravelPlan();
  const { data: expenses, refetch } = useGetExpenseByTravelPlan(selectedPlanId!);
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Submitted":
        return "warning";
      case "Verified":
        return "success";
      case "Rejected":
        return "failure";
    }
  };
  const verifyExpenseMutation = useVerifyTravelExpense();
  const selectedPlan = travelPlans.find((tp) => tp.travelPlanId == selectedPlanId);
  const [openConfirm, setOpenConfirm] = useState<number | null>();
  const docMutation = useGetDocumentByUrl();

  return (
    <>
      <SelectOption
        title='TravelPlan For Expense'
        value={selectedPlanId!}
        onChange={(value) => setSelectedPlanId(Number(value))}
        options={travelPlans.map(
          (tp) => ({ label: tp.title, value: tp.travelPlanId })
        )}
        placeholder='Select Plan'
      />

      {selectedPlanId &&
        <Card>
          <div className="overflow-x-auto">
            <table className='w-full text-sm text-center'>
              <thead className='border-b'>
                <tr>
                <th className="px-3 py-3">Name</th>
                <th className="px-3 py-3">Detail</th>
                <th className="px-3 py-3">Date</th>
                <th className="px-3 py-3">Type</th>
                <th className="px-3 py-3">Amount</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Remark</th>
                <th className="px-3 py-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {expenses?.map((expense) => (
                  <tr key={expense.employeeTravelExpenseId} className="border-b">
                    <td className="px-4 py-2">
                      {selectedPlan?.travelEmployees.find((te) => te.employeeId = expense.travelEmployeeEmployeeId)?.firstName} {''}
                      {selectedPlan?.travelEmployees.find((te) => te.employeeId = expense.travelEmployeeEmployeeId)?.lastName}
                    </td>
                    <td className="px-4 py-2">
                      {expense.expenseDetail}
                    </td>
                    <td className="px-4 py-2">
                      {new Date(expense.expenseDate).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-4 py-2">
                      {expense.travelExpenseType.travelExpenseTypeName}
                    </td>
                    <td className="px-4 py-2">
                      ₹{expense.amount}
                    </td>
                    <td className="px-4 py-2">
                      <Badge color={getStatusColor(expense.status)}>{expense.status}</Badge>
                    </td>
                    <td className="px-4 py-2">
                      {expense.remark || '-'}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2 justify-center">
                        {expense.status === "Submitted" && (
                          <>
                            <Button size="xs" color='green' onClick={() => {
                              verifyExpenseMutation.mutate({ expenseId: expense.employeeTravelExpenseId, status: 'Approved', remark: null }, {
                                onSuccess: (data) => { toast.success(data.message); refetch() },
                                onError: (err) => console.log(err.message)
                              })
                            }}><CircleCheck size={14}/></Button>
                            <Button size="xs" color='red' onClick={() => setOpenConfirm(expense.employeeTravelExpenseId)
                            }><X size={14}/></Button>
                          </>
                        )}
                        <Button size="xs" color="gray" onClick={() => {
                          docMutation.mutate(expense.proofUrl, {
                            onSuccess: (data) => {
                              const fileURL = URL.createObjectURL(data);
                              window.open(fileURL, '_blank')
                            }
                          })
                        }}>
                          <Eye size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
        </Card>
      }

      <ConfirmModal
        open={openConfirm != null}
        title="Reject Expense"
        message="Are you sure you want to reject this expense ?, this action cannot be undone."
        confirmText="Yes"
        cancelText="No"
        danger
        requireRemark
        loading={verifyExpenseMutation.isPending}
        onConfirm={(remark) => verifyExpenseMutation.mutate({ expenseId: openConfirm!, status: "Rejected", remark: remark! },
          {
            onSuccess: data => {
              toast.success(data.message);
              refetch();
              setOpenConfirm(null);
            },
            onError: error => toast.error(error.message)
          }
        )}
        onClose={() => setOpenConfirm(null)}
      />
    </>
  )
}

export default ManageExpense