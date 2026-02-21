import { fetchVehicles } from "@/modules/dashboard/dashboard.slice";
import { useAppDispatch } from "@/store/hooks";
import { Suspense, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { DesktopSidebarNavigator, MobileSidebarNavigator } from "./Sidebar";

const Navigator = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchVehicles());
  }, []);

  return (
    <div className="w-dvw h-dvh md:w-screen md:h-screen flex flex-col sm:flex-row bg-[--background] overflow-y-auto">
      <div className="hidden sm:block sticky top-0 h-full">
        <DesktopSidebarNavigator />
      </div>
      <div className="block sm:hidden relative">
        <MobileSidebarNavigator />
      </div>
      <div className="w-screen h-screen bg-(--background) relative">
        <Suspense
          fallback={
            <div className="w-full h-full flex justify-center items-center">
              Loading...
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};

export default Navigator;
