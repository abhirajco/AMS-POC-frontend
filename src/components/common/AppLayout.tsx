//  import { Outlet } from "react-router-dom"
//  import SidebarNavigation from "./SidebarNavigation"
// const AppLayout = () => {
//   return (
//       <div className="flex">

//   {/* SIDEBAR */}
//   <div className="hidden md:block fixed z-50 left-0 top-0 h-full ">
//     <SidebarNavigation />
//   </div>

//   {/* CONTENT */}
//   <div className="flex-1 md:ml-64 p-4 lg:ml-[312px]">
//     <Outlet />
//   </div>

// </div>
//   )
// }

// export default AppLayout


import { Outlet } from "react-router-dom";
import SidebarNavigation from "./SidebarNavigation";
import HeaderSection from "./HeaderSection";

const AppLayout = () => {
  return (
    <div className="flex">

      {/* SIDEBAR */}
      <div className="hidden md:block fixed z-50 left-0 top-0 h-full">
        <SidebarNavigation />
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 md:ml-64 lg:ml-[312px] flex flex-col min-h-screen">

        {/* HEADER */}
        {/* <HeaderSection /> */}

        {/* PAGE CONTENT */}
        <div className="p-4 flex-1">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default AppLayout;