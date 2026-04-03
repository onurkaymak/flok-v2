import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { updateRentalService } from "../../store/actions/rental-actions";
import type { RootState } from "../../store";
import { uiActions } from "../../store/slices/ui-slice";

// Convert ISO/API date string to datetime-local format (yyyy-MM-ddTHH:mm)
const toDateTimeLocal = (dateStr: string) => {
  const date = new Date(dateStr);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const UpdateRental = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const token = useSelector((state: RootState) => state.user.token);
  const selectedRentalService = useSelector((state: RootState) => state.rental.selectedRentalService);

  const [reservationStart, setReservationStart] = useState("");
  const [reservationEnd, setReservationEnd] = useState("");

  useEffect(() => {
    if (!selectedRentalService) {
      dispatch(
        uiActions.showNotification({
          title: "Error",
          message: "No reservation selected. Please search for a reservation first.",
        }),
      );
      navigate("/profile/rental");
      return;
    }

    setReservationStart(toDateTimeLocal(selectedRentalService.reservationStart));
    setReservationEnd(toDateTimeLocal(selectedRentalService.reservationEnd));
  }, []);

  if (!selectedRentalService) return null;

  const submitHandler = () => {
    dispatch(updateRentalService(selectedRentalService.id, reservationStart, reservationEnd, token!));
    navigate("/profile/rental");
  };

  const cancelHandler = () => {
    navigate("/profile/rental");
  };

  const inputClass =
    "block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 outline-none sm:text-sm sm:leading-6";
  const wrapperClass =
    "flex w-full rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600";
  const prefixClass = "flex select-none items-center pl-3 text-gray-500 sm:text-sm";

  return (
    <div className="flex flex-col gap-4 w-full xl:max-w-screen-xl mx-auto">
      <h1 className="text-5xl font-semibold text-center text-gray-900">Update Reservation</h1>

      <div className="space-y-12 max-w-3xl mx-auto w-full">
        {/* Reservation Info (read-only) */}
        <div className="border-b border-gray-900/10 pb-12">
          <div className="mt-10">
            <dl className="divide-y divide-gray-100">
              {[
                { label: "Reservation No", value: selectedRentalService.id },
                { label: "Customer", value: selectedRentalService.contactName },
                { label: "Email", value: selectedRentalService.contactEmail },
                { label: "Phone", value: selectedRentalService.contactNum },
                { label: "VIN", value: selectedRentalService.vin },
                {
                  label: "Vehicle",
                  value: `${selectedRentalService.make} ${selectedRentalService.model} — ${selectedRentalService.color}`,
                },
              ].map(({ label, value }) => (
                <div key={label} className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-900">{label}</dt>
                  <dd className="mt-1 text-sm text-gray-500 sm:col-span-2 sm:mt-0">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Editable Dates */}
        <div className="border-b border-gray-900/10 pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-3 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <label htmlFor="reservationStart" className="block text-sm font-medium leading-6 text-gray-900">
                Pick-Up Date
              </label>
              <div className="mt-2">
                <div className={wrapperClass}>
                  <span className={prefixClass}>Pick-Up Date:</span>
                  <input
                    type="datetime-local"
                    id="reservationStart"
                    autoComplete="off"
                    className={inputClass}
                    value={reservationStart}
                    onChange={(e) => setReservationStart(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="reservationEnd" className="block text-sm font-medium leading-6 text-gray-900">
                Return Date
              </label>
              <div className="mt-2">
                <div className={wrapperClass}>
                  <span className={prefixClass}>Return Date:</span>
                  <input
                    type="datetime-local"
                    id="reservationEnd"
                    autoComplete="off"
                    className={inputClass}
                    value={reservationEnd}
                    onChange={(e) => setReservationEnd(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6 max-w-3xl mx-auto w-full">
        <button type="button" className="text-sm font-semibold leading-6 text-gray-900" onClick={cancelHandler}>
          Cancel
        </button>
        <button
          type="button"
          onClick={submitHandler}
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Update Reservation
        </button>
      </div>
    </div>
  );
};

export default UpdateRental;
