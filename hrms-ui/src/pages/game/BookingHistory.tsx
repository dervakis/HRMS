import React, { useState } from "react";
import { useSelector } from "react-redux";
import type { RootStateType } from "../../redux-store/Store";
import { useGetAllEmployeeBookings } from "../../query/GameQuery";
import { Alert, Badge, Button, Card, Select, Spinner } from "flowbite-react";


function BookingHistory() {
  const user = useSelector((state: RootStateType) => state.user);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const { data, isLoading, isError, error } = useGetAllEmployeeBookings(user.userId, page, size);
  const bookings = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const totalElements = data?.totalElements || 0;
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Booked":
        return "success";
      case "Waiting":
        return "warning";
      case "Cancelled":
        return "failure";
      default:
        return "gray";
    }
  };
  const handlePageSizeChange = (value: number) => {
    setSize(value);
    setPage(0);
  };
  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-xl font-semibold">Your Booking History</h5>
        <div className="flex items-center gap-2">
          <span className="text-sm">Rows:</span>
          <Select value={size} onChange={(e) => handlePageSizeChange(Number(e.target.value))}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </Select>
        </div>
      </div>
      {isLoading && (
        <div className="flex justify-center py-10">
          <Spinner size="xl" />
        </div>
      )}
      {isError && (
        <Alert color="failure">
          {error?.message || "Failed to load booking history"}
        </Alert>
      )}
      {!isLoading && bookings.length === 0 && (
        <p className="text-gray-500 text-center py-6">
          No booking history found
        </p>
      )}
      {!isLoading && bookings.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className='w-full text-sm text-center'>
              <thead className="text-center border-b">
                <tr>
                  <th className="px-3 py-3"></th>
                  <th className="px-3 py-3">Game</th>
                  <th className="px-3 py-3">Booking Date</th>
                  <th className="px-3 py-3">Booking Time</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Created At</th>
                  <th className="px-3 py-3">Booked By</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, index) => (
                  <tr key={booking.gameBookingId} className="border-b">
                    <td className="px-4 py-2">{index + page * size + 1}</td>
                    <td className="font-medium">{booking.game?.gameName}</td>
                    <td className="px-4 py-2">{booking.bookingDate}</td>
                    <td className="px-4 py-2">{booking.bookingTime}</td>
                    <td className="justify-items-center">
                      <Badge color={getStatusColor(booking.bookingStatus)}>{booking.bookingStatus}</Badge>
                    </td>
                    <td className="px-4 py-2">{new Date(booking.createdAt).toLocaleDateString("en-GB", { hour: '2-digit', minute: '2-digit' })}</td>
                    <td className="px-4 py-2">{booking.bookedBy?.firstName + ' ' + booking.bookedBy?.lastName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500">
              Showing page {page + 1} of {totalPages} • Total {totalElements} records
            </div>
            <div className="flex gap-2">
              <Button size="sm" disabled={page === 0 || isLoading} onClick={() => setPage(prev => prev - 1)}>Previous</Button>
              <Button size="sm" disabled={page + 1 >= totalPages || isLoading} onClick={() => setPage(prev => prev + 1)}>Next</Button>
            </div>
          </div>
        </>
      )}

    </Card>
  );
}

export default BookingHistory;