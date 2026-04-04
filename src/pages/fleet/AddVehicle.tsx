import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { addVehicle } from "../../store/actions/fleet-actions";
import type { RootState } from "../../store";
import type { Vehicle } from "../../types";
import { fleetActions } from "../../store/slices/fleet-slice";

const US_STATES = [
  "AL",
  "AK",
  "AS",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "DC",
  "FL",
  "GA",
  "GU",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "MP",
  "OH",
  "OK",
  "OR",
  "PA",
  "PR",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "VI",
  "WA",
  "WV",
  "WI",
  "WY",
];

const AddVehicle = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.user.token);

  const [vin, setVin] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");
  const [mileage, setMileage] = useState("");
  const [vehicleClass, setVehicleClass] = useState("");
  const [classCode, setClassCode] = useState("");
  const [state, setState] = useState("AL");
  const [licensePlate, setLicensePlate] = useState("");

  useEffect(() => {
    dispatch(fleetActions.setSelectedVehicleById([]));
  }, []);

  const submitHandler = () => {
    const vehicleInfo: Omit<Vehicle, "vehicleId"> = {
      vin,
      make,
      model,
      color,
      mileage: Number(mileage),
      class: vehicleClass,
      classCode,
      state,
      licensePlate,
      isRented: false,
    };

    dispatch(addVehicle(vehicleInfo as Vehicle, token!));
    navigate("/profile/fleet");
  };

  const cancelHandler = () => {
    navigate("/profile/fleet");
  };

  const inputClass =
    "block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 outline-none sm:text-sm sm:leading-6";
  const wrapperClass =
    "flex w-full rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600";
  const prefixClass = "flex select-none items-center pl-3 text-gray-500 sm:text-sm";

  return (
    <div className="flex flex-col gap-4 w-full xl:max-w-screen-xl mx-auto">
      <h1 className="text-5xl font-semibold text-center text-gray-900">Add Vehicle</h1>

      <div className="space-y-12 max-w-3xl mx-auto w-full">
        {/* Section 1 */}
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
              <label htmlFor="make" className="block text-sm font-medium leading-6 text-gray-900">
                Make
              </label>
              <div className="mt-2">
                <div className={wrapperClass}>
                  <span className={prefixClass}>Make:</span>
                  <input
                    type="text"
                    id="make"
                    autoComplete="off"
                    className={inputClass}
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="model" className="block text-sm font-medium leading-6 text-gray-900">
                Model
              </label>
              <div className="mt-2">
                <div className={wrapperClass}>
                  <span className={prefixClass}>Model:</span>
                  <input
                    type="text"
                    id="model"
                    autoComplete="off"
                    className={inputClass}
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="color" className="block text-sm font-medium leading-6 text-gray-900">
                Color
              </label>
              <div className="mt-2">
                <div className={wrapperClass}>
                  <span className={prefixClass}>Color:</span>
                  <input
                    type="text"
                    id="color"
                    autoComplete="off"
                    className={inputClass}
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="mileage" className="block text-sm font-medium leading-6 text-gray-900">
                Mileage
              </label>
              <div className="mt-2">
                <div className={wrapperClass}>
                  <span className={prefixClass}>Mileage:</span>
                  <input
                    type="number"
                    id="mileage"
                    autoComplete="off"
                    className={inputClass}
                    value={mileage}
                    onChange={(e) => setMileage(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="border-b border-gray-900/10 pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-3 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <label htmlFor="vehicleClass" className="block text-sm font-medium leading-6 text-gray-900">
                Vehicle Class
              </label>
              <div className="mt-2">
                <div className={wrapperClass}>
                  <span className={prefixClass}>Vehicle Class:</span>
                  <input
                    type="text"
                    id="vehicleClass"
                    autoComplete="off"
                    className={inputClass}
                    value={vehicleClass}
                    onChange={(e) => setVehicleClass(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="classCode" className="block text-sm font-medium leading-6 text-gray-900">
                Class Code
              </label>
              <div className="mt-2">
                <div className={wrapperClass}>
                  <span className={prefixClass}>Class Code:</span>
                  <input
                    type="text"
                    id="classCode"
                    autoComplete="off"
                    className={inputClass}
                    value={classCode}
                    onChange={(e) => setClassCode(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="state" className="block text-sm font-medium leading-6 text-gray-900">
                State
              </label>
              <div className="mt-2">
                <select
                  id="state"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:outline-none sm:text-sm sm:leading-6"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                >
                  {US_STATES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="licensePlate" className="block text-sm font-medium leading-6 text-gray-900">
                License Plate
              </label>
              <div className="mt-2">
                <div className={wrapperClass}>
                  <span className={prefixClass}>License Plate:</span>
                  <input
                    type="text"
                    id="licensePlate"
                    autoComplete="off"
                    className={inputClass}
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value)}
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
          Add Vehicle
        </button>
      </div>
    </div>
  );
};

export default AddVehicle;
