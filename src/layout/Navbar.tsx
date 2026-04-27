import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import type { RootState } from "../store";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { logOutUser } from "../store/actions/auth-actions";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [profileIcon, setProfileIcon] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const userRole = useSelector((state: RootState) => state.user.userRole);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isManager = userRole === "MANAGER";
  const isAutoDetailer = userRole === "AUTO DETAILER";
  const isCustomerServiceAgent = userRole === "CUSTOMER SERVICE AGENT";

  const canAccessFleet = isManager;
  const canAccessProduction = isManager || isAutoDetailer;
  const canAccessRental = isManager || isCustomerServiceAgent;

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    switch (userRole) {
      case "AUTO DETAILER":
        setProfileIcon("https://i.ibb.co/J2t8rb4/cleaning.png");
        break;
      case "CUSTOMER SERVICE AGENT":
        setProfileIcon("https://i.ibb.co/34bsw2G/car-rent.png");
        break;
      case "MANAGER":
        setProfileIcon("https://i.ibb.co/n7zmdJB/project-management.png");
        break;
      default:
        setProfileIcon(null);
    }
  }, [userRole]);

  const signOutButtonHandler = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    dispatch(logOutUser());
    navigate("/");
  };

  const activeClass = "bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium";
  const enabledClass = "text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium";
  const disabledClass = "text-gray-500 rounded-md px-3 py-2 text-sm font-medium cursor-not-allowed opacity-50";

  const activeMobileClass = "bg-gray-900 text-white block rounded-md px-3 py-2 text-base font-medium";
  const enabledMobileClass =
    "text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium";
  const disabledMobileClass =
    "text-gray-500 block rounded-md px-3 py-2 text-base font-medium cursor-not-allowed opacity-50";

  return (
    <div className="col-start-1 col-end-4 row-start-1">
      <nav className="bg-gray-800">
        <div className="mx-auto max-w-8xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            {/* Mobile menu button */}
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <button
                type="button"
                className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>

            {/* Logo and desktop nav */}
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex flex-shrink-0 items-center">
                <img className="h-7 w-auto" src="https://i.ibb.co/4WCggVY/flok2.png" alt="" />
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  {/* Fleet - Manager only */}
                  {canAccessFleet ? (
                    <NavLink to="/profile/fleet" className={({ isActive }) => (isActive ? activeClass : enabledClass)}>
                      Fleet
                    </NavLink>
                  ) : (
                    <span className={disabledClass}>Fleet</span>
                  )}

                  {/* Production - Manager and Auto Detailer only */}
                  {canAccessProduction ? (
                    <NavLink
                      to="/profile/production"
                      className={({ isActive }) => (isActive ? activeClass : enabledClass)}
                    >
                      Production
                    </NavLink>
                  ) : (
                    <span className={disabledClass}>Production</span>
                  )}

                  {/* Rental - Manager and Customer Service Agent only */}
                  {canAccessRental ? (
                    <NavLink to="/profile/rental" className={({ isActive }) => (isActive ? activeClass : enabledClass)}>
                      Rental
                    </NavLink>
                  ) : (
                    <span className={disabledClass}>Rental</span>
                  )}
                </div>
              </div>
            </div>

            {/* Right side — bell + profile */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <button
                type="button"
                className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                <span className="absolute -inset-1.5" />
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Profile dropdown */}
              <div className="relative ml-3" ref={dropdownRef}>
                <button
                  type="button"
                  className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  {profileIcon && <img className="h-8 w-8 rounded-full" src={profileIcon} alt="" />}
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                    <a href="/#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Your Profile
                    </a>
                    <a href="/#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Settings
                    </a>
                    <a
                      href="/#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={signOutButtonHandler}
                    >
                      Sign Out
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {canAccessFleet ? (
                <NavLink
                  to="/profile/fleet"
                  className={({ isActive }) => (isActive ? activeMobileClass : enabledMobileClass)}
                >
                  Fleet
                </NavLink>
              ) : (
                <span className={disabledMobileClass}>Fleet</span>
              )}

              {canAccessProduction ? (
                <NavLink
                  to="/profile/production"
                  className={({ isActive }) => (isActive ? activeMobileClass : enabledMobileClass)}
                >
                  Production
                </NavLink>
              ) : (
                <span className={disabledMobileClass}>Production</span>
              )}

              {canAccessRental ? (
                <NavLink
                  to="/profile/rental"
                  className={({ isActive }) => (isActive ? activeMobileClass : enabledMobileClass)}
                >
                  Rental
                </NavLink>
              ) : (
                <span className={disabledMobileClass}>Rental</span>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
