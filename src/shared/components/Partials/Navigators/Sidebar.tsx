import dropdown_dark from "@/assets/svgs/dropdown-dark.svg";
import dropdown from "@/assets/svgs/dropdown.svg";
import companyLogoDark from "@/assets/svgs/logo-dark.svg";
import companyLogo from "@/assets/svgs/logo.svg";
import { handleUserLogout } from "@/modules/auth/auth.api";
import { setLoggedOut } from "@/modules/auth/auth.slices";
import { cleanupMqtt } from "@/mqtt/ClientMQTT";
import ThemeSwitch from "@/shared/components/ui/ThemeSwitch";
import useTheme from "@/shared/hooks/useTheme";
import { sidebarFooter, sidebarMain } from "@/shared/utils/navigators";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import * as React from "react";
import { useCallback, useEffect, useRef, useState, type FC } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

const Sidebar: FC = () => {
  const { user } = useAppSelector((state: any) => state.auth);
  const dispatch = useAppDispatch();
  const [theme, setTheme] = useTheme();
  const logoutRef = useRef<HTMLLIElement | null>(null);
  const { pathname } = useLocation();
  const [openDropdown, setOpenDropdown] = useState<string>("");
  const [historyDropdown, setHistoryDropdown] = useState<string>("");
  const [showLogout, setShowLogout] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleTheme = useCallback(() => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  }, [theme, setTheme]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        logoutRef.current &&
        !logoutRef.current.contains(event.target as Node)
      ) {
        setShowLogout(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleRoute = (path: string) => {
    navigate(path);
  };

  const handleDropdown = (title: string) => {
    if (title === openDropdown) {
      setOpenDropdown("");
    } else {
      setOpenDropdown(title);
    }
  };

  const handleReEnterDropDown = () => {
    setOpenDropdown(historyDropdown);
  };

  const handleShowLogout = () => {
    setShowLogout(!showLogout);
  };

  const handleLogout = async () => {
    try {
      await toast.promise(handleUserLogout(), {
        loading: "Logging Out",
        success: "Logged Out",
        error: "Failed to logout",
      });
      navigate("/", { replace: true });
      dispatch(setLoggedOut(true));
      cleanupMqtt();
      //toast.success("Logged Out");
    } catch (error: any) {
      //toast.error("Failed to logout");
    }
  };

  return (
    <div
      onMouseEnter={handleReEnterDropDown}
      onMouseLeave={() => {
        setOpenDropdown("");
        setShowLogout(false);
      }}
      className={`h-full flex flex-col transition-[width] w-13.75 hover:w-57.5 ease-in-out duration-300 p-2 bg-(--background) relative border-r border-(--border) group/sidebar`}
    >
      <div className="flex flex-col gap-3 h-full overflow-hidden">
        <header className="relative flex justify-center items-center gap-2 my-1 overflow-hidden">
          {theme === "light" ? (
            <img
              src={companyLogo}
              alt=""
              className={`w-9.5 p-1 sticky left-0 z-10 bg-(--background)`}
            />
          ) : (
            <img
              src={companyLogoDark}
              alt=""
              className={`w-9.5  p-1 sticky left-0 z-10 bg-(--background)`}
            />
          )}
          <span className="font-semibold text-lg text-(--text) z-0">
            Metron
          </span>
        </header>
        <ul className="flex flex-col justify-center overflow-hidden ml-1 bg-(--background)">
          {sidebarMain.map((menu: any, index: number) => {
            if (!menu.submenu) {
              return (
                <li
                  onClick={() => {
                    setOpenDropdown("");
                    setHistoryDropdown("");
                    handleRoute(menu.path);
                  }}
                  key={`menu-${index}`}
                  className={`relative overflow-hidden rounded-md flex justify-start items-center gap-2 my-1 p-1 cursor-default transition-colors duration-150 ${
                    pathname === menu.path
                      ? "bg-(--button-primary)"
                      : "hover:bg-(--button-sec)"
                  }`}
                >
                  <img
                    src={theme === "light" ? menu.icon : menu.darkIcon}
                    alt=""
                    className={`w-6 p-1 sticky left-0 z-10`}
                  />
                  <span className="font-normal capitalize text-sm text-(--text) z-0">
                    {menu.title}
                  </span>
                </li>
              );
            }
            return (
              <li
                onClick={() => handleDropdown(menu.title)}
                key={`menu-${index}`}
                className="flex flex-col"
              >
                <section
                  className={`relative overflow-hidden rounded-md flex justify-start items-center gap-2 my-1 p-1 cursor-default transition-colors duration-150 ${
                    menu.activeList.includes(pathname)
                      ? "bg-(--button-primary)"
                      : "hover:bg-(--button-sec)"
                  }`}
                >
                  <img
                    src={theme === "light" ? menu.icon : menu.darkIcon}
                    alt=""
                    className={`w-6 p-1 sticky left-0 z-10`}
                  />
                  <span className="font-normal capitalize text-sm text-(--text) z-0">
                    {menu.title}
                  </span>
                  <span className="grow flex justify-end items-center">
                    <img
                      src={theme === "light" ? dropdown : dropdown_dark}
                      alt=""
                      className={`w-4 mr-1 transistion-transform duration-200 delay-200 ${openDropdown === menu.title ? "" : "-rotate-90"}`}
                    />
                  </span>
                </section>
                <ul
                  onClick={(e) => e.stopPropagation()}
                  className={`grid ${openDropdown === menu.title ? "grid-rows-[1fr]" : "grid-rows-[0fr]"} transition-all ease-in-out duration-500 pl-4`}
                >
                  <div className="overflow-hidden border-l border-(--border) pl-3 flex flex-col">
                    {menu.submenuList.map((submenu: any, index: number) => (
                      <li
                        key={`submenu-${index}`}
                        onClick={() => {
                          setHistoryDropdown(menu.title);
                          handleRoute(submenu.path);
                        }}
                        className={`p-2 pl-3 rounded-md my-1 cursor-default text-(--text) text-sm font-normal capitalize transition-colors duration-150 ${
                          pathname === submenu.path
                            ? "bg-(--button-primary)"
                            : "hover:bg-(--button-sec)"
                        }`}
                      >
                        {submenu.title}{" "}
                      </li>
                    ))}
                  </div>
                </ul>
              </li>
            );
          })}
        </ul>
        <ul className="relative flex-1 flex flex-col gap-2 justify-end ml-1 my-1 bg-(--background)">
          <div
            onClick={handleTheme}
            className={`relative flex justify-start items-center gap-2 overflow-hidden whitespace-nowrap transition-[padding] ease-in-out duration-200 cursor-pointer p-0 rounded-md hover:bg-(--button-sec) group-hover/sidebar:p-2 `}
          >
            <ThemeSwitch />
            {theme === "light" ? (
              <span className="font-semibold capitalize text-sm text-(--text) z-0">
                Light Mode
              </span>
            ) : (
              <span className="font-semibold capitalize text-sm text-(--text) z-0">
                Dark Mode
              </span>
            )}
            <div className="absolute inset-0 z-10"></div>
          </div>
          {sidebarFooter.map((footer: any, index: number) => {
            if (footer.title === "logout") {
              return (
                <li
                  ref={logoutRef}
                  key={`sidebar-footer-${index}`}
                  className="relative rounded-md flex justify-start items-center gap-2 cursor-default"
                >
                  <div className="sticky left-0 min-w-8.5 min-h-8.5 rounded-full flex justify-center items-center border-none font-semibold text-xl bg-fuchsia-800 text-(--text) capitalize">
                    {user.username[0]}
                  </div>
                  <div className="flex-1 flex flex-col justify-center gap-0.5">
                    <span className="font-light text-sm text-(--text) z-0">
                      {user.username}
                    </span>
                    {/* <span className="font-xs text-xs text-(--sub-text) z-0">
                      {user.email.split("@")[0]}
                    </span> */}
                  </div>
                  <img
                    onClick={handleShowLogout}
                    src={theme === "light" ? footer.icon : footer.darkIcon}
                    alt="logout"
                    className="w-9 p-2.5 rounded-md bg-(--button-sec) hover:bg-(--button-primary) "
                  />
                  <button
                    onClick={handleLogout}
                    className={`absolute -top-10 right-0 px-3 py-1 w-22.5 text-sm text-(--text) rounded-md hover:bg-(--button-primary) bg-(--button-sec) transition-all duration-300 cursor-pointer ${showLogout ? "opacity-100 translate-0 z-10" : "opacity-0 -z-20 translate-y-2"} `}
                  >
                    Logout
                  </button>
                </li>
              );
            }
            return (
              <li
                key={`sidebar-footer-${index}`}
                className={`relative overflow-hidden rounded-md flex justify-start items-center gap-2 my-1 p-1 cursor-default transition-colors duration-150 ${
                  false ? "bg-(--button-primary)" : "bg hover:bg-(--button-sec)"
                }`}
              >
                <img
                  src={theme === "light" ? footer.icon : footer.darkIcon}
                  alt=""
                  className={`w-6 p-1 sticky left-0 z-10`}
                />
                <span className="font-normal capitalize text-sm text-(--text) z-0">
                  {footer.title}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

const MobileSidebar: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const profile = useRef<HTMLDivElement | null>(null);
  const pageNav = useRef<HTMLDivElement | null>(null);
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const [showPageNavOptions, setShowPageNavOptions] = useState(false);
  const [openDropdown, setOpenDropdown] = useState("");
  const [theme, setTheme] = useTheme();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: any) => state.auth);

  const handleTheme = useCallback(() => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  }, [theme, setTheme]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (profile.current && !profile.current.contains(event.target as Node)) {
        setShowProfileOptions(false);
      }
    };
    const handleOutsideClick2 = (event: MouseEvent) => {
      if (pageNav.current && !pageNav.current.contains(event.target as Node)) {
        setShowPageNavOptions(false);
        setOpenDropdown("");
      }
    };
    document.addEventListener("click", handleOutsideClick);
    document.addEventListener("click", handleOutsideClick2);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
      document.removeEventListener("click", handleOutsideClick2);
    };
  }, []);

  const handleProfile = () => {
    setShowProfileOptions(!showProfileOptions);
    setShowPageNavOptions(false);
  };

  const handlePageNav = () => {
    setShowPageNavOptions(true);
    setShowProfileOptions(false);
  };

  const handleRoute = (path: string) => {
    navigate(path);
    setOpenDropdown("");
    setShowPageNavOptions(false);
  };

  const handleDropdown = (title: string) => {
    if (title === openDropdown) {
      setOpenDropdown("");
    } else {
      setOpenDropdown(title);
    }
  };

  const handleLogout = async () => {
    try {
      //await handleUserLogout();
      await toast.promise(handleUserLogout(), {
        loading: "Logging Out",
        success: "Logged Out",
        error: "Failed to logout",
      });
      navigate("/", { replace: true });
      dispatch(setLoggedOut(true));
      cleanupMqtt();
      //toast.success("Logged Out");
    } catch (error: any) {
      //toast.error("Failed to logout");
    }
  };

  return (
    <div className="w-full flex flex-row justify-between items-center bg-(--background) px-2 py-1 border-b-2 border-(--border)">
      <section className="relative flex justify-center items-center my-1 overflow-hidden">
        {theme === "light" ? (
          <img
            src={companyLogo}
            alt=""
            className={`w-8.25 p-1 sticky left-0 z-10 bg-(--background)`}
          />
        ) : (
          <img
            src={companyLogoDark}
            alt=""
            className={`w-8.25  p-1 sticky left-0 z-10 bg-(--background)`}
          />
        )}
        <span className="font-semibold text-sm text-(--text) z-0">Metron</span>
      </section>
      {sidebarFooter.map((footer: any, index: number) => {
        if (footer.title === "logout") {
          return (
            <section
              key={`mobile-profile-${index}`}
              className="relative rounded-md flex justify-start items-center gap-2 cursor-default p-1"
            >
              <div
                ref={pageNav}
                onClick={handlePageNav}
                className="relative w-30 border border-(--border) rounded-lg flex justify-between p-2 capitalize text-xs text-(--text) "
              >
                {pathname?.replace("/", "")}
                <span className="grow flex justify-end items-center">
                  <img
                    src={theme === "light" ? dropdown : dropdown_dark}
                    alt=""
                    className={`w-4`}
                  />
                </span>
                <ul
                  className={`absolute top-11 w-42.5 h-47 flex flex-col justify-start items-start overflow-y-auto right-0 overflow-hidden ml-1 p-1 rounded-md bg-(--primary-background) transition-transform duration-300 ease-in-out ${showPageNavOptions ? "opacity-100 z-9999 translate-0" : "opacity-0 -z-20 translate-y-2"}`}
                >
                  {sidebarMain.map((menu: any, index: number) => {
                    if (!menu.submenu) {
                      return (
                        <li
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRoute(menu.path);
                          }}
                          key={`mobile-sidebar-menu-${index}`}
                          className={`w-full flex gap-2 rounded-md my-1 p-1 cursor-default transition-colors duration-150 ${
                            pathname === menu.path
                              ? "bg-(--button-primary)"
                              : "bg hover:bg-(--button-sec)"
                          }`}
                        >
                          <img
                            src={theme === "light" ? menu.icon : menu.darkIcon}
                            alt=""
                            className={`w-4 p-px`}
                          />
                          <span className="font-normal capitalize text-sm text-(--text) z-0">
                            {menu.title}
                          </span>
                        </li>
                      );
                    }
                    return (
                      <li
                        onClick={() => handleDropdown(menu.title)}
                        key={`mobile-sidebar-menu-${index}`}
                        className="flex flex-col w-full"
                      >
                        <section
                          className={`relative overflow-hidden rounded-md flex justify-start items-center gap-2 my-1 p-1 cursor-default transition-colors duration-150 ${
                            menu.activeList.includes(pathname)
                              ? "bg-(--button-primary)"
                              : "bg hover:bg-(--button-sec)"
                          }`}
                        >
                          <img
                            src={theme === "light" ? menu.icon : menu.darkIcon}
                            alt=""
                            className={`w-4 p-px`}
                          />
                          <span className="font-normal capitalize text-sm text-(--text) z-0">
                            {menu.title}
                          </span>
                          <span className="grow flex justify-end items-center">
                            <img
                              src={theme === "light" ? dropdown : dropdown_dark}
                              alt=""
                              className={`w-4 mr-1 transistion-transform duration-200 delay-200 ${openDropdown === menu.title ? "" : "-rotate-90"}`}
                            />
                          </span>
                        </section>
                        <ul
                          onClick={(e) => e.stopPropagation()}
                          className={`grid ${openDropdown === menu.title ? "grid-rows-[1fr]" : "grid-rows-[0fr]"} transition-all ease-in-out duration-500 pl-4`}
                        >
                          <div className="overflow-hidden border-l border-(--border) pl-3 flex flex-col">
                            {menu.submenuList.map(
                              (submenu: any, index: number) => (
                                <li
                                  key={`mobile-sidebar-submenu-${index}`}
                                  onClick={() => handleRoute(submenu.path)}
                                  className={`p-1 pl-3 rounded-md my-1 cursor-default text-(--text) text-sm font-normal capitalize transition-colors duration-150 ${
                                    pathname === submenu.path
                                      ? "bg-(--button-primary)"
                                      : "bg hover:bg-(--button-sec)"
                                  }`}
                                >
                                  {submenu.title}{" "}
                                </li>
                              ),
                            )}
                          </div>
                        </ul>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="relative overflow-hidden">
                <ThemeSwitch />
                <div
                  onClick={handleTheme}
                  className="absolute z-10 inset-0 cursor-pointer"
                ></div>
              </div>
              <div
                ref={profile}
                onClick={handleProfile}
                className="relative min-w-8 min-h-8 rounded-full flex justify-center items-center border-none text-sm bg-fuchsia-800 text-white capitalize"
              >
                {user.username[0]}
                <ul
                  className={`fixed top-12 right-2.5 transition-transform duration-300 ease-in-out ${showProfileOptions ? "opacity-100 translate-0 z-9999" : "opacity-0 -z-20 translate-y-2"} rounded-md bg-(--primary-background) w-30 flex flex-col gap-1 p-1`}
                >
                  <li
                    key="profile"
                    className="text-(--text) text-center py-1 rounded-md hover:bg-(--button-primary) bg-(--button-sec) "
                  >
                    Profile
                  </li>
                  <li
                    key="logout"
                    onClick={handleLogout}
                    className="text-(--text) text-center py-1 rounded-md hover:bg-(--button-primary) bg-(--button-sec) cursor-pointer"
                  >
                    Logout
                  </li>
                </ul>
              </div>
            </section>
          );
        }
      })}
    </div>
  );
};

const MobileSidebarNavigator = React.memo(MobileSidebar);
const DesktopSidebarNavigator = React.memo(Sidebar);

export { MobileSidebarNavigator, DesktopSidebarNavigator };
