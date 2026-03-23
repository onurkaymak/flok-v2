import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import type { RootState } from "../store";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { logOutUser } from "../store/actions/auth-actions";

const Navbar = () => {
  const [profileIcon, setProfileIcon] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const userRole = useSelector((state: RootState) => state.user.userRole);

  const dispatch = useAppDispatch();

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
  };

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
                  <NavLink
                    to="/profile/fleet"
                    className={({ isActive }) =>
                      isActive
                        ? "bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                    }
                  >
                    Fleet
                  </NavLink>
                  <NavLink
                    to="/profile/production"
                    className={({ isActive }) =>
                      isActive
                        ? "bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                    }
                  >
                    Production
                  </NavLink>
                  <NavLink
                    to="/profile/rental"
                    className={({ isActive }) =>
                      isActive
                        ? "bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                    }
                  >
                    Rental
                  </NavLink>
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
              <div className="relative ml-3">
                <button
                  type="button"
                  className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  <img className="h-8 w-8 rounded-full" src={profileIcon ?? ""} alt="" />
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
              <NavLink
                to="/profile/fleet"
                className={({ isActive }) =>
                  isActive
                    ? "bg-gray-900 text-white block rounded-md px-3 py-2 text-base font-medium"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
                }
              >
                Fleet
              </NavLink>
              <NavLink
                to="/profile/production"
                className={({ isActive }) =>
                  isActive
                    ? "bg-gray-900 text-white block rounded-md px-3 py-2 text-base font-medium"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
                }
              >
                Production
              </NavLink>
              <NavLink
                to="/profile/rental"
                className={({ isActive }) =>
                  isActive
                    ? "bg-gray-900 text-white block rounded-md px-3 py-2 text-base font-medium"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
                }
              >
                Rental
              </NavLink>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
