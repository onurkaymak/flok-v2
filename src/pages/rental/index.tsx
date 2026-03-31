import { useEffect, useCallback, useState } from "react";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { fetchRentalService, fetchRentalServiceList, deleteRentalService } from "../../store/actions/rental-actions";
import type { RootState } from "../../store";
import { useSelector } from "react-redux";
import { rentalActions } from "../../store/slices/rental-slice";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import { uiActions } from "../../store/slices/ui-slice";
import { useNavigate } from "react-router-dom";
import type { RentalService } from "../../types";

const columns: GridColDef<RentalService>[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "contactName", headerName: "Customer", width: 170 },
  { field: "contactEmail", headerName: "Email", width: 230 },
  { field: "contactNum", headerName: "Phone", width: 150 },
  { field: "make", headerName: "Make", width: 120 },
  { field: "model", headerName: "Model", width: 120 },
  { field: "vin", headerName: "VIN", width: 180 },
  { field: "color", headerName: "Color", width: 110 },
  { field: "pickUpTime", headerName: "Pick Up", width: 190 },
  { field: "returnTime", headerName: "Return", width: 190 },
];

const Rental = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const token = useSelector((state: RootState) => state.user.token);
  const rentalServices = useSelector((state: RootState) => state.rental.rentalServices);
  const selectedRentalServiceById = useSelector((state: RootState) => state.rental.selectedRentalServiceById);
  const selectedRentalService = useSelector((state: RootState) => state.rental.selectedRentalService);
  const userRole = useSelector((state: RootState) => state.user.userRole);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [deleteFromInfoModal, setDeleteFromInfoModal] = useState(false);

  // Search form state
  const [rentalServiceId, setRentalServiceId] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhoneNum, setCustomerPhoneNum] = useState("");

  const isManager = userRole === "MANAGER";

  const fetcher = useCallback(async () => {
    dispatch(rentalActions.resetRentalServices());
    dispatch(fetchRentalServiceList(token!));
  }, [dispatch, token]);

  useEffect(() => {
    dispatch(rentalActions.setSelectedRentalService([]));
    fetcher();
  }, []);

  // --- DataGrid selection ---
  const rowSelectionHandler = (selectionModel: GridRowSelectionModel) => {
    const model = selectionModel as any;

    if (model.type === "exclude") {
      const excludedIds = new Set(model.ids as Set<number>);
      const ids = rentalServices.map((r) => r.id).filter((id) => !excludedIds.has(id));
      dispatch(rentalActions.setSelectedRentalService(ids));
    } else {
      const ids = Array.from(model.ids as Set<number>);
      dispatch(rentalActions.setSelectedRentalService(ids));
    }
  };

  // --- Search form ---
  const searchSubmitHandler = () => {
    if (!rentalServiceId && !customerEmail && !customerPhoneNum) {
      dispatch(
        uiActions.showNotification({
          title: "Reservation Check Error",
          message: "Please fill at least one field to check a reservation.",
        }),
      );
      return;
    }

    const reservationInfo: { rentalServiceId?: number; customerEmail?: string; customerPhoneNum?: string } = {};

    if (rentalServiceId) reservationInfo.rentalServiceId = parseInt(rentalServiceId);
    else if (customerEmail) reservationInfo.customerEmail = customerEmail;
    else if (customerPhoneNum) reservationInfo.customerPhoneNum = customerPhoneNum;

    dispatch(fetchRentalService(reservationInfo, token!));

    setRentalServiceId("");
    setCustomerEmail("");
    setCustomerPhoneNum("");
    setDeleteFromInfoModal(false);
    setInfoModalOpen(true);
  };

  const infoModalCloseHandler = () => {
    setInfoModalOpen(false);
    setDeleteFromInfoModal(false);
  };

  // --- Delete from info modal ---
  const deleteFromInfoModalHandler = () => {
    if (!deleteFromInfoModal) {
      setDeleteFromInfoModal(true);
    } else {
      dispatch(deleteRentalService(selectedRentalService!.id, token!));
      setInfoModalOpen(false);
      setDeleteFromInfoModal(false);
    }
  };

  // --- Delete from DataGrid ---
  const deleteModalHandler = () => {
    if (!selectedRentalServiceById || selectedRentalServiceById.length === 0) return;

    if (selectedRentalServiceById.length > 1) {
      dispatch(
        uiActions.showNotification({
          title: "Error",
          message: "You can delete only one reservation at a time.",
        }),
      );
      return;
    }

    setDeleteModalOpen(true);
  };

  const deleteRentalServiceHandler = () => {
    dispatch(deleteRentalService(selectedRentalServiceById![0], token!));
    setDeleteModalOpen(false);
  };

  const selectedCount = selectedRentalServiceById?.length ?? 0;

  return (
    <div className="flex flex-col h-full gap-8 xl:max-w-screen-xl mx-auto">
      {/* Search Form */}
      <div className="border-b border-gray-200 pb-8 xl:max-w-screen-xl mx-auto w-full">
        <h1 className="text-5xl font-semibold text-center text-gray-900 mb-6 w-full">Reservation Check</h1>
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-3">
          <div>
            <label htmlFor="rentalServiceId" className="block text-sm font-medium text-gray-900 mb-1">
              Reservation Number
            </label>
            <input
              id="rentalServiceId"
              type="text"
              autoComplete="off"
              value={rentalServiceId}
              onChange={(e) => setRentalServiceId(e.target.value)}
              placeholder="e.g. 42"
              className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-900 mb-1">
              Customer Email
            </label>
            <input
              id="customerEmail"
              type="email"
              autoComplete="off"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="customer@email.com"
              className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="customerPhoneNum" className="block text-sm font-medium text-gray-900 mb-1">
              Customer Phone Number
            </label>
            <input
              id="customerPhoneNum"
              type="text"
              autoComplete="off"
              value={customerPhoneNum}
              onChange={(e) => setCustomerPhoneNum(e.target.value)}
              placeholder="e.g. 555-555-5555"
              className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
            />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={searchSubmitHandler}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Check
          </button>
        </div>
      </div>

      {/* Page Title */}
      <h1 className="text-5xl font-semibold text-center text-gray-900 w-full">Reservations</h1>

      {/* DataGrid */}
      <div style={{ height: 780 }}>
        <DataGrid
          style={{ height: "100%" }}
          rows={rentalServices}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection
          onRowSelectionModelChange={rowSelectionHandler}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[10, 25, 50]}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        {isManager && (
          <button
            onClick={deleteModalHandler}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50"
            disabled={selectedCount === 0}
          >
            Delete Reservation
          </button>
        )}
        <button
          onClick={() => navigate("/profile/rental/add")}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Add Reservation
        </button>
      </div>

      {/* Reservation Info Modal (from search) */}
      <Dialog
        open={infoModalOpen}
        onClose={infoModalCloseHandler}
        disableEnforceFocus
        disableRestoreFocus
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{deleteFromInfoModal ? "Cancel Reservation" : "Reservation Information"}</DialogTitle>
        <DialogContent dividers>
          {deleteFromInfoModal ? (
            <Typography>Are you sure you want to delete this reservation?</Typography>
          ) : selectedRentalService ? (
            <dl className="divide-y divide-gray-100">
              {[
                { label: "Reservation No", value: selectedRentalService.id },
                { label: "Contact Name", value: selectedRentalService.contactName },
                { label: "Contact Email", value: selectedRentalService.contactEmail },
                { label: "Contact Number", value: selectedRentalService.contactNum },
                { label: "Pick-up Date", value: selectedRentalService.pickUpTime },
                { label: "Return Date", value: selectedRentalService.returnTime },
                { label: "Vehicle VIN", value: selectedRentalService.vin },
                { label: "Make", value: selectedRentalService.make },
                { label: "Model", value: selectedRentalService.model },
                { label: "Color", value: selectedRentalService.color },
              ].map(({ label, value }) => (
                <div key={label} className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-900">{label}</dt>
                  <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">{value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <Typography>No reservation found.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          {isManager && (
            <Button onClick={deleteFromInfoModalHandler} variant="contained" color="error">
              {deleteFromInfoModal ? "Confirm Delete" : "Delete"}
            </Button>
          )}
          <Button onClick={infoModalCloseHandler} variant="contained" color="success">
            {deleteFromInfoModal ? "Cancel" : "Close"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal (from DataGrid) */}
      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} disableEnforceFocus disableRestoreFocus>
        <DialogTitle>Delete Reservation</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this reservation?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)} variant="contained" color="success">
            Cancel
          </Button>
          <Button
            onClick={deleteRentalServiceHandler}
            variant="contained"
            color="error"
            disabled={selectedCount === 0 || !isManager}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Rental;
