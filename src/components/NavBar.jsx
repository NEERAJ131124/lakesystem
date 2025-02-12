import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "./contexts/AuthContext";

const NavBar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Lakes", href: "/lakes" },
    { name: "About", href: "/about" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <Disclosure as="nav" className="bg-carp-600">
      {({ open, close }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-carp-100 hover:bg-carp-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <Link to="/" className="text-2xl font-bold text-white">
                    Carpbook
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`${currentPath === item.href
                          ? "bg-carp-700 text-white"
                          : "text-carp-100 hover:bg-carp-700 hover:text-white"
                          } rounded-md px-3 py-2 text-sm font-medium`}
                        aria-current={
                          currentPath === item.href ? "page" : undefined
                        }
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {user ? (
                  <button
                    onClick={logout}
                    className="rounded-md bg-carp-700 px-3 py-2 text-sm font-medium text-white hover:bg-carp-800"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className={`${currentPath === "/login"
                      ? "bg-carp-700 text-white"
                      : "text-carp-100 hover:bg-carp-700 hover:text-white"
                      } rounded-md px-3 py-2 text-sm font-medium`}
                    aria-current={currentPath === "/login" ? "page" : undefined}
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${currentPath === item.href
                    ? "bg-carp-700 text-white"
                    : "text-carp-100 hover:bg-carp-700 hover:text-white"
                    } block rounded-md px-3 py-2 text-base font-medium`}
                  aria-current={currentPath === item.href ? "page" : undefined}
                  onClick={() => close()}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default NavBar;
