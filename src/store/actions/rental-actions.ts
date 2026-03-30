import { rentalActions } from "../slices/rental-slice";
import { uiActions } from "../slices/ui-slice";
import axios from "axios";
import { format } from "date-fns";
import type { AppDispatch } from "../index";
import type { RentalServiceResponse } from "../../types";

export const fetchRentalService = (
  reservationInfo: { rentalServiceId?: number; customerEmail?: string; customerPhoneNum?: string },
  token: string,
) => {
  return async (dispatch: AppDispatch) => {
    const { rentalServiceId, customerEmail, customerPhoneNum } = reservationInfo;

    let url = "http://localhost:5000/api/rental";

    if (rentalServiceId) {
      url = `${url}?rentalServiceId=${rentalServiceId}`;
    } else if (customerEmail) {
      url = `${url}?customerEmail=${customerEmail}`;
    } else if (customerPhoneNum) {
      url = `${url}?customerPhoneNum=${customerPhoneNum}`;
    }

    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fetchedRentalService = response.data[0];
      dispatch(rentalActions.fetchSelectedRentalService(fetchedRentalService));
    } catch (err) {
      dispatch(
        uiActions.showNotification({
          title: "Fetch Error",
          message: "Could not find the reservation. Please try again.",
        }),
      );
    }
  };
};

export const fetchRentalServiceList = (token: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await axios.get("http://localhost:5000/api/rental", {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(rentalActions.fetchRentalServiceList(response.data as RentalServiceResponse[]));
    } catch (err) {
      dispatch(
        uiActions.showNotification({
          title: "Fetch Error",
          message: "Something went wrong fetching reservations. Please try again.",
        }),
      );
    }
  };
};

export const addRentalService = (
  reservationInfo: {
    vin: string;
    customerEmail: string;
    serviceAgentId: string;
    reservationStart: string;
    reservationEnd: string;
  },
  token: string,
) => {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/rental",
        {
          vin: reservationInfo.vin,
          customerEmail: reservationInfo.customerEmail,
          serviceAgentId: reservationInfo.serviceAgentId,
          reservationStart: reservationInfo.reservationStart,
          reservationEnd: reservationInfo.reservationEnd,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const createdReservation = {
        id: response.data.customer.rentalJoinEntities[0].rentalServiceId,
        contactName: response.data.customer.name,
        contactEmail: response.data.customer.email,
        contactNum: response.data.customer.phoneNum,
        pickUpTime: format(response.data.customer.rentalJoinEntities[0].reservationStart, "Pp"),
        returnTime: format(response.data.customer.rentalJoinEntities[0].reservationEnd, "Pp"),
        make: response.data.vehicle.make,
        model: response.data.vehicle.model,
        vin: response.data.vehicle.vin,
        color: response.data.vehicle.color,
      };

      dispatch(rentalActions.add(createdReservation));
      dispatch(
        uiActions.showNotification({
          title: "Success",
          message: "Reservation has been created successfully.",
        }),
      );
    } catch (err) {
      dispatch(
        uiActions.showNotification({
          title: "Add Rental Error",
          message: "Something went wrong. Please try again.",
        }),
      );
    }
  };
};

export const deleteRentalService = (rentalServiceId: number, token: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      await axios.delete(`http://localhost:5000/api/rental/${rentalServiceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(rentalActions.delete(rentalServiceId));
      dispatch(
        uiActions.showNotification({
          title: "Success",
          message: "Reservation has been deleted successfully.",
        }),
      );
    } catch (err) {
      dispatch(
        uiActions.showNotification({
          title: "Delete Error",
          message: "Something went wrong. Please try again.",
        }),
      );
    }
  };
};
