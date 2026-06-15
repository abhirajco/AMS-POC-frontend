import { Outlet } from "react-router-dom";
import SidebarNavigation from "./SidebarNavigation";

const AppLayout = () => {
  return (
    <div className="flex">

      <div className="hidden md:block fixed z-50 left-0 top-0 h-full">
        <SidebarNavigation />
      </div>

      <div className="flex-1 md:ml-64 lg:ml-[312px] flex flex-col min-h-screen">

        <div className="p-4 flex-1">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default AppLayout;