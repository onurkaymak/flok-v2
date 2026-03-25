import type { AppDispatch } from "../index";
import axios from "axios";
import { fleetActions } from "../slices/fleet-slice";
import { uiActions } from "../slices/ui-slice";

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
