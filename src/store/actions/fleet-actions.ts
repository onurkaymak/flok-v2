import type { AppDispatch } from "../index";
import axios from "axios";
import { fleetActions } from "../slices/fleet-slice";
import { uiActions } from "../slices/ui-slice";
import type { Vehicle } from "../../types";

export const fetchVehicles = (token: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await axios.get("http://localhost:5000/api/fleet", {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(fleetActions.fetch(response.data));
    } catch (err) {
      dispatch(
        uiActions.showNotification({
          title: "Fetch Error",
          message: "Something went wrong. Please try again.",
        }),
      );
    }
  };
};

export const addVehicle = (vehicleInfo: Vehicle, token: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/fleet",
        {
          vin: vehicleInfo.vin,
          make: vehicleInfo.make,
          model: vehicleInfo.model,
          color: vehicleInfo.color,
          mileage: vehicleInfo.mileage,
          class: vehicleInfo.class,
          classCode: vehicleInfo.classCode,
          state: vehicleInfo.state,
          licensePlate: vehicleInfo.licensePlate,
          isRented: vehicleInfo.isRented,
          inProduction: vehicleInfo.inProduction,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const newVehicle: Vehicle = {
        id: response.data.vehicle.vehicleId,
        vin: response.data.vehicle.vin,
        make: response.data.vehicle.make,
        model: response.data.vehicle.model,
        color: response.data.vehicle.color,
        mileage: response.data.vehicle.mileage,
        class: response.data.vehicle.class,
        classCode: response.data.vehicle.classCode,
        state: response.data.vehicle.state,
        licensePlate: response.data.vehicle.licensePlate,
        isRented: response.data.vehicle.isRented,
        inProduction: response.data.vehicle.inProduction,
      };
      dispatch(fleetActions.add(newVehicle));
    } catch (err) {
      dispatch(
        uiActions.showNotification({
          title: "Add Vehicle Error",
          message: "Something went wrong. Please try again.",
        }),
      );
    }
  };
};
