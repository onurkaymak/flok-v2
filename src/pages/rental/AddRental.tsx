import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { addRentalService } from "../../store/actions/rental-actions";
import type { RootState } from "../../store";

const AddRental = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.user.token);

  const [vin, setVin] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [serviceAgentId, setServiceAgentId] = useState("");
  const [reservationStart, setReservationStart] = useState("");
  const [reservationEnd, setReservationEnd] = useState("");

  const submitHandler = () => {
    dispatch(addRentalService({ vin, customerEmail, serviceAgentId, reservationStart, reservationEnd }, token!));
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
      <h1 className="text-5xl font-semibold text-center text-gray-900">Book a Vehicle</h1>

      <div className="space-y-12 max-w-3xl mx-auto w-full">
        {/* Section 1 — Customer & Agent Info */}
        <div className="border-b border-gray-900/10 pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-3 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <label htmlFor="vin" className="block text-sm font-medium leading-6 text-gray-900">
                VIN
              </label>
              <div className="mt-2">
                <div className={wrapperClass}>
                  <span className={prefixClass}>VIN:</span>
                  <input
                    type="text"
                    id="vin"
                    autoComplete="off"
                    className={inputClass}
                    value={vin}
                    onChange={(e) => setVin(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="customerEmail" className="block text-sm font-medium leading-6 text-gray-900">
                Customer Email
              </label>
              <div className="mt-2">
                <div className={wrapperClass}>
                  <span className={prefixClass}>Customer Email:</span>
                  <input
                    type="email"
                    id="customerEmail"
                    autoComplete="off"
                    className={inputClass}
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="serviceAgentId" className="block text-sm font-medium leading-6 text-gray-900">
                Service Agent ID
              </label>
              <div className="mt-2">
                <div className={wrapperClass}>
                  <span className={prefixClass}>Service Agent ID:</span>
                  <input
                    type="text"
                    id="serviceAgentId"
                    autoComplete="off"
                    className={inputClass}
                    value={serviceAgentId}
                    onChange={(e) => setServiceAgentId(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2 — Dates */}
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
          Book Vehicle
        </button>
      </div>
    </div>
  );
};

export default AddRental;
