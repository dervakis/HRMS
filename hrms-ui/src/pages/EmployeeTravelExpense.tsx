import { Plus, Eye, Pencil } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useGetTravelPlanForExpense } from "../query/TravelPlanQuery";
import { useSelector } from "react-redux";
import type { RootStateType } from "../redux-store/store";
import { useCreateTravelExpense, useGetExpenseByEmployee, useGetExpenseType, useSubmitTravelExpense } from "../query/ExpenseQuery";
import type { TravelExpenseResponseType, TravelExpenseSubmitType } from "../types/TravelPlan";
import { useForm, type SubmitErrorHandler, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useGetDocumentByUrl } from "../query/DocumentQuery";
import { Badge, Button, Card, Label, Modal, ModalBody, ModalFooter, ModalHeader, Select, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, TextInput } from "flowbite-react";

function EmployeeTravelExpense() {
  const [openModal, setOpenModal] = useState<string>();
  const [selectedExpense, setSelectedExpense] = useState<TravelExpenseResponseType>();
  const user = useSelector((state: RootStateType) => state.user);
  const { data: openTravel } = useGetTravelPlanForExpense(user.userId!);
  const { data: expenseType } = useGetExpenseType();
  const { register, handleSubmit, reset } = useForm<TravelExpenseSubmitType>();
  const createExpenseMutation = useCreateTravelExpense();
  const submitExpenseMutation = useSubmitTravelExpense();
  const { data: document, isLoading, refetch } = useGetDocumentByUrl(selectedExpense?.proofUrl!);

  useEffect(()=>{
    if(document != undefined)
      window.open(URL.createObjectURL(document!), '_blank')
  },[document])
  const { data: expenses, refetch:expensesRefetch } = useGetExpenseByEmployee(user.userId);

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

  const onSubmit: SubmitHandler<TravelExpenseSubmitType> = (data) => {
    console.log(data);
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
      },
      onError: (err) => console.log(err)
    })
  };
  const onError: SubmitErrorHandler<TravelExpenseSubmitType> = (err) => {
    console.log(err);
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
                {travel.startTime} → {travel.endTime}
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

      <Card>
        <Table>
          <TableHead>
            <TableHeadCell>Detail</TableHeadCell>
            <TableHeadCell>Date</TableHeadCell>
            <TableHeadCell>Type</TableHeadCell>
            <TableHeadCell>Amount</TableHeadCell>
            <TableHeadCell>Status</TableHeadCell>
            <TableHeadCell>Remark</TableHeadCell>
            <TableHeadCell>Action</TableHeadCell>
          </TableHead>

          <TableBody>
            {expenses?.map((expense) => (
              <TableRow key={expense.employeeTravelExpenseId} className="bg-white">
                <TableCell className="font-medium">
                  {expense.expenseDetail}
                </TableCell>
                <TableCell>
                  {new Date(expense.expenseDate).toLocaleDateString('en-GB')}
                </TableCell>
                <TableCell>
                  {expense.travelExpenseType.travelExpenseTypeName}
                </TableCell>
                <TableCell>
                  ₹{expense.amount}
                </TableCell>
                <TableCell>
                  <Badge color={getStatusColor(expense.status)}>{expense.status}</Badge>
                </TableCell>
                <TableCell>
                  {expense.remark ?? "—"}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {expense.status === "Draft" && (
                      <>
                        <Button size="xs" color="blue"
                          onClick={() => {
                            onEdit(expense)
                          }}>
                          <Pencil size={14} />
                        </Button>

                        <Button size="xs" onClick={() => {
                          submitExpenseMutation.mutate(expense.employeeTravelExpenseId, {
                            onSuccess: (data) => toast.success(data.message)
                          })
                        }}>Submit</Button>
                      </>
                    )}
                    <Button size="xs" color="gray"
                      onClick={() => {
                        setSelectedExpense(expense);
                        setOpenModal("view");
                      }}>
                      <Eye size={14} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Modal show={openModal === "create" || openModal === "edit"}>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <ModalHeader>
            {openModal === "edit"
              ? "Edit Expense"
              : "Add Expense"}
          </ModalHeader>

          <ModalBody>
            <div className="space-y-2">
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
                <TextInput {...register('expenseDate', { required: true })} type="date" />
              </div>
              <div>
                <Label>Amount</Label>
                <TextInput type="number" placeholder="Enter amount" {...register('amount')} />
              </div>

              <div>
                <Label>Expense Type</Label>
                <Select {...register('travelExpenseTypeId')}>
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
          </ModalBody>

          <ModalFooter>
            <Button type="submit">Save as Draft</Button>
            <Button color="gray" onClick={() => setOpenModal(undefined)}>
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      <Modal show={openModal === "view"}>
        <ModalHeader>Expense Details</ModalHeader>
        <ModalBody>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Detail:</strong>{" "}
              {selectedExpense?.expenseDetail}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(selectedExpense?.expenseDate!).toLocaleDateString('en-GB')}
            </p>
            <p>
              <strong>Amount:</strong>
              ₹{selectedExpense?.amount}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {selectedExpense?.status}
            </p>
            <p>
              <strong>Approver:</strong>{" "}
              {selectedExpense?.approver?.firstName ?? "—"}
            </p>
            <p>
              <strong>Remark:</strong>{" "}
              {selectedExpense?.remark ?? "—"}
            </p>
            {selectedExpense?.proofUrl && <Button onClick={() => refetch()}>Bill</Button>}
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            color="gray"
            onClick={() => setOpenModal(undefined)}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default EmployeeTravelExpense;