import { useEffect, useCallback, useState } from "react";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { fetchVehicles, deleteVehicle } from "../../store/actions/fleet-actions";
import type { RootState } from "../../store";
import { useSelector } from "react-redux";
import { fleetActions } from "../../store/slices/fleet-slice";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import { uiActions } from "../../store/slices/ui-slice";
import type { Vehicle } from "../../types";

const columns: GridColDef<Vehicle>[] = [
  { field: "vehicleId", headerName: "ID", width: 70 },
  { field: "vin", headerName: "VIN", width: 160 },
  { field: "make", headerName: "Make", width: 120 },
  { field: "model", headerName: "Model", width: 120 },
  { field: "color", headerName: "Color", width: 100 },
  { field: "mileage", headerName: "Mileage", width: 100, type: "number" },
  { field: "class", headerName: "Class", width: 120 },
  { field: "classCode", headerName: "Class Code", width: 100 },
  { field: "state", headerName: "State", width: 80 },
  { field: "licensePlate", headerName: "License Plate", width: 130 },
  {
    field: "isRented",
    headerName: "Rented",
    width: 90,
    type: "boolean",
  },
];

const Fleet = () => {
  const dispatch = useAppDispatch();

  const token = useSelector((state: RootState) => state.user.token);
  const vehicles = useSelector((state: RootState) => state.fleet.vehicles);
  const selectedVehicles = useSelector((state: RootState) => state.fleet.selectedVehicles);
  const userRole = useSelector((state: RootState) => state.user.userRole);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const isManager = userRole === "MANAGER";

  const fetcher = useCallback(async () => {
    dispatch(fleetActions.resetVehicles());
    dispatch(fetchVehicles(token!));
  }, [dispatch, token]);

  useEffect(() => {
    dispatch(fleetActions.setSelectedVehicleById([]));
    fetcher();
  }, []);

  const rowSelectionHandler = (selectionModel: GridRowSelectionModel) => {
    const model = selectionModel as any;

    if (model.type === "exclude") {
      // "select all" case — get all vehicle IDs except the excluded ones
      const excludedIds = new Set(model.ids as Set<number>);
      const ids = vehicles.map((v: any) => v.vehicleId).filter((id: number) => !excludedIds.has(id));
      dispatch(fleetActions.setSelectedVehicleById(ids));
    } else {
      // normal include case
      const ids = Array.from(model.ids as Set<number>);
      dispatch(fleetActions.setSelectedVehicleById(ids));
    }
  };

  const deleteModalHandler = () => {
    if (selectedVehicles.length === 0) return;

    if (selectedVehicles.length > 1) {
      dispatch(
        uiActions.showNotification({
          title: "Error",
          message: "You can delete only one vehicle at once.",
        }),
      );
      return;
    }

    setDeleteModalOpen(true);
  };

  const deleteVehicleHandler = () => {
    dispatch(deleteVehicle(selectedVehicles[0], token!));
    setDeleteModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full gap-4 w-full xl:max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-5xl font-semibold text-center text-gray-900">Vehicle List</h1>
      </div>

      <div className="flex-1 h-full">
        <DataGrid
          style={{ height: "100%" }}
          rows={vehicles}
          columns={columns}
          getRowId={(row: any) => row.vehicleId}
          checkboxSelection
          onRowSelectionModelChange={rowSelectionHandler}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[10, 25, 50]}
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={deleteModalHandler}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50"
          disabled={selectedVehicles.length === 0}
        >
          Delete Vehicle
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} disableEnforceFocus disableRestoreFocus>
        <DialogTitle>Delete Vehicle</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this vehicle from inventory?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)} variant="contained" color="success">
            Cancel
          </Button>
          <Button
            onClick={deleteVehicleHandler}
            variant="contained"
            color="error"
            disabled={selectedVehicles.length === 0 || !isManager}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Fleet;
