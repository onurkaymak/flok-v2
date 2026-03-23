import { NavLink, useLocation } from "react-router-dom";

import { MagnifyingGlassIcon, PlusIcon, ArrowPathIcon, UsersIcon } from "@heroicons/react/24/outline";

const Sidebar = () => {
  const location = useLocation();

  const isFleet = location.pathname.includes("fleet");
  const isProduction = location.pathname.includes("production");
  const isRental = location.pathname.includes("rental");

  const activeLinkClass =
    "flex items-center justify-between px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md";
  const linkClass =
    "flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-md";

  return (
    <div className="flex flex-col w-48 min-h-screen bg-gray-800 px-3 py-4 gap-2">
      <NavLink to="/profile" end className={({ isActive }) => (isActive ? activeLinkClass : linkClass)}>
        Dashboard
      </NavLink>

      {isFleet && (
        <div className="flex flex-col gap-1 mt-2">
          <NavLink to="/profile/fleet" end className={({ isActive }) => (isActive ? activeLinkClass : linkClass)}>
            <span>Vehicle</span>
            <MagnifyingGlassIcon className="w-4 h-4" />
          </NavLink>
          <NavLink to="/profile/fleet/add" className={({ isActive }) => (isActive ? activeLinkClass : linkClass)}>
            <span>Add Vehicle</span>
            <PlusIcon className="w-4 h-4" />
          </NavLink>
          <NavLink to="/profile/fleet/update" className={({ isActive }) => (isActive ? activeLinkClass : linkClass)}>
            <span>Update Vehicle</span>
            <ArrowPathIcon className="w-4 h-4" />
          </NavLink>
        </div>
      )}

      {isProduction && (
        <div className="flex flex-col gap-1 mt-2">
          <NavLink to="/profile/production" end className={({ isActive }) => (isActive ? activeLinkClass : linkClass)}>
            <span>Detailings</span>
            <MagnifyingGlassIcon className="w-4 h-4" />
          </NavLink>
          <NavLink to="/profile/production/add" className={({ isActive }) => (isActive ? activeLinkClass : linkClass)}>
            <span>New Detailing</span>
            <PlusIcon className="w-4 h-4" />
          </NavLink>
          <NavLink
            to="/profile/production/productivity"
            className={({ isActive }) => (isActive ? activeLinkClass : linkClass)}
          >
            <span>Productivity</span>
            <UsersIcon className="w-4 h-4" />
          </NavLink>
        </div>
      )}

      {isRental && (
        <div className="flex flex-col gap-1 mt-2">
          <NavLink to="/profile/rental" end className={({ isActive }) => (isActive ? activeLinkClass : linkClass)}>
            <span>Rentals</span>
            <MagnifyingGlassIcon className="w-4 h-4" />
          </NavLink>
          <NavLink to="/profile/rental/add" className={({ isActive }) => (isActive ? activeLinkClass : linkClass)}>
            <span>Book a Rental</span>
            <PlusIcon className="w-4 h-4" />
          </NavLink>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
