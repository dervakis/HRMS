import { Plus, Eye, Pencil, X, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useGetTravelPlanForExpense } from "../../query/TravelPlanQuery";
import { useSelector } from "react-redux";
import type { RootStateType } from "../../redux-store/Store";
import { useCreateTravelExpense, useDeleteTravelExpense, useGetExpenseByEmployee, useGetExpenseType, useSubmitTravelExpense } from "../../query/ExpenseQuery";
import type { TravelExpenseResponseType, TravelExpenseSubmitType } from "../../types/TravelPlan";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useGetDocumentByUrl } from "../../query/DocumentQuery";
import { Alert, Badge, Button, Card, Label, Modal, ModalBody, ModalFooter, ModalHeader, Select, TextInput } from "flowbite-react";
import Loader from "../../common/Loader";

function EmployeeTravelExpense() {
  const [openModal, setOpenModal] = useState<string>();
  const user = useSelector((state: RootStateType) => state.user);
  const { data: openTravel, isLoading: otLoading } = useGetTravelPlanForExpense(user.userId!);
  const { data: expenseType, isLoading: etLoading } = useGetExpenseType();
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<TravelExpenseSubmitType>();
  const createExpenseMutation = useCreateTravelExpense();
  const submitExpenseMutation = useSubmitTravelExpense();
  const docMutation = useGetDocumentByUrl();
  const deleteMutation = useDeleteTravelExpense();
  const { data: expenses, refetch: expensesRefetch } = useGetExpenseByEmployee(user.userId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft":
        return "gray";
      case "Submitted":
        return "warning";
      case "Verified":
        return "success";
      case "Rejected":
        return "failure";
    }
  };
  const resetForm = () => {
    reset({
      employeeTravelExpenseId: undefined,
      expenseDetail: undefined,
      expenseDate: undefined,
      amount: undefined,
      travelExpenseTypeId: undefined,
      TravelPlanId: undefined
    });
  }

  const onSubmit: SubmitHandler<TravelExpenseSubmitType> = (data) => {
    // console.log(data);
    const form = new FormData();
    data.expenseDetail && form.append('expenseDetail', data.expenseDetail);
    data.expenseDate && form.append('expenseDate', data.expenseDate.toString());
    data.amount && form.append('amount', data.amount.toString());
    data.file.length > 0 && form.append('file', data.file[0]);
    form.append('EmployeeId', user.userId.toString());
    form.append('travelPlanId', data.TravelPlanId.toString());
    form.append('travelExpenseTypeId', data.travelExpenseTypeId.toString());
    form.append('amount', data.TravelPlanId.toString());
    if (openModal == 'edit') {
      form.append('employeeTravelExpenseId', data.employeeTravelExpenseId!.toString())
    }
    createExpenseMutation.mutate(form, {
      onSuccess: (data) => {
        setOpenModal(undefined)
        expensesRefetch();
        toast.success(data.message);
        resetForm();
      },
      onError: (err) => toast.error(err.message)
    })
  };
  const onEdit = (expense: TravelExpenseResponseType) => {
    reset({
      employeeTravelExpenseId: expense.employeeTravelExpenseId,
      expenseDetail: expense.expenseDetail,
      expenseDate: expense.expenseDate,
      amount: expense.amount,
      travelExpenseTypeId: expense.travelExpenseType.travelExpenseTypeId,
      TravelPlanId: expense.travelEmployeeTravelPlanId
    })
    setOpenModal('edit');
  }

  return (
    <>
      {openTravel?.map(travel =>
        <Card key={travel.travelPlanId} className="mb-6 border border-green-300 bg-green-50">
          <div className="flex justify-between items-center">
            <div>
              <h5 className="text-lg font-semibold text-green-800">
                {travel.title}
              </h5>
              <p className="text-sm text-green-700">
                {new Date(travel.startTime).toLocaleDateString('en-GB', { hour: '2-digit', minute: '2-digit' })} → {new Date(travel.endTime).toLocaleDateString('en-GB', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <Badge color="success">Expense Window Open</Badge>
          </div>
        </Card>
      )}
      {openTravel && openTravel?.length > 0 && <div className="flex justify-end mb-4">
        <Button onClick={() => setOpenModal("create")}>
          <Plus size={16} className="mr-2" />
          Add Expense
        </Button>
      </div>
      }

      <Card >
        <div className="overflow-x-auto">
          <table className='w-full text-sm text-center'>
            <thead className='border-b'>
              <tr>
                <th className="px-3 py-3">Travel Plan</th>
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
                <tr key={expense.employeeTravelExpenseId} className="bg-white">
                  <td className="px-4 py-2">
                    {expense.travelEmployeeTravelPlanTitle}
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
                    {expense.remark ?? "—"}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      {expense.status === "Draft" && (
                        <>
                          <Button size="xs" color='green' onClick={() => {
                            submitExpenseMutation.mutate(expense.employeeTravelExpenseId, {
                              onSuccess: (data) => { toast.success(data.message); expensesRefetch() },
                              onError: (err) => toast.error(err.message)
                            })
                          }}>
                            <CheckCircle size={14} /></Button>

                          <Button size="xs" color='red' onClick={() => deleteMutation.mutate(expense.employeeTravelExpenseId, {
                            onSuccess: (data) => { toast.success(data.message); expensesRefetch() }
                          })}
                          ><X size={14} /></Button>

                          <Button size="xs" color="blue"
                            onClick={() => {
                              onEdit(expense)
                            }}>
                            <Pencil size={14} />
                          </Button>
                        </>
                      )}
                      {
                        expense.proofUrl &&
                        <Button size="xs" color="gray"
                          onClick={() => docMutation.mutate(expense.proofUrl, {
                            onSuccess: (url) => {
                              window.open(url, '_blank')
                            }
                          })}>
                          <Eye size={14} />
                        </Button>
                      }
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal show={openModal === "create" || openModal === "edit"}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>
            {openModal === "edit"
              ? "Edit Expense"
              : "Add Expense"}
          </ModalHeader>

          <ModalBody>
            <div >
              <div>
                <Label>Select Travel Paln</Label>
                <Select {...register('TravelPlanId', { required: true })}>
                  <option value=''>Select</option>
                  {openTravel?.map(plan => (
                    <option key={plan.travelPlanId} value={plan.travelPlanId}>
                      {plan.title}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label>Expense Detail</Label>
                <TextInput {...register('expenseDetail')} placeholder="Enter expense detail" />
              </div>
              <div>
                <Label>Expense Date</Label>
                <TextInput {...register('expenseDate', {
                  validate: (value) => {
                    if (!value)
                      return "Expense date is mandatory";
                    const travelPlan = openTravel?.find((obj) => obj.travelPlanId == watch('TravelPlanId'));
                    if(new Date(value) > new Date())
                      return "Can not predict Future expense."
                    if (new Date(value) < new Date(travelPlan?.startTime!) || new Date(value) > new Date(travelPlan?.endTime!))
                      return "Expense date out of travel plan range."
                    return true;
                  }
                })} type="date" />
              </div>
              <div>
                <Label>Amount</Label>
                <TextInput type="number" placeholder="Enter amount" {...register('amount', {
                  required: 'Amount is mandatory for expense',
                  validate: (value) => {
                    const type = expenseType?.find((obj) => obj.travelExpenseTypeId == watch('travelExpenseTypeId'));
                    if (Number(value) > type?.maxAmount! || Number(value) < 1)
                      return 'Amount must be between 1 - ' + type?.maxAmount
                    return true;
                  }
                })} />
              </div>

              <div>
                <Label>Expense Type</Label>
                <Select {...register('travelExpenseTypeId', { required: "Expense Type Required" })}>
                  <option value=''>Select</option>
                  {expenseType?.map(type => (
                    <option key={type.travelExpenseTypeId} value={type.travelExpenseTypeId}>
                      {type.travelExpenseTypeName}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <Label>Upload Proof</Label>
                <TextInput {...register('file')} type="file" />
              </div>
            </div>
            {Object.keys(errors).length > 0 && <Alert color="failure" className="p-2 mt-2">{errors.expenseDate?.message || errors.travelExpenseTypeId?.message || errors.amount?.message}</Alert>}
          </ModalBody>

          <ModalFooter>
            <Button type="submit">Save as Draft</Button>
            <Button color="gray" onClick={() => {
              setOpenModal(undefined);
              resetForm();
            }}>
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </Modal>
      {(otLoading || etLoading || createExpenseMutation.isPending || docMutation.isPending || deleteMutation.isPending || submitExpenseMutation.isPending) && <Loader />}
    </>
  );
}

export default EmployeeTravelExpense;