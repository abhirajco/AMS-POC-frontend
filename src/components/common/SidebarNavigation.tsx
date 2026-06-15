import amsLogo from "@/assets/images/ams-logo.png";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { svgPaths } from "@/assets/icons/svg-paths";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from "react-router-dom"
import { BASE_URL } from "@/utils/BASE_URL";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const SidebarNavigation = () => {

  const [sideBarOpen] = useState(true);
  const [campaignDropdownOpen, setCampaignDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = async () => {
  try {
    await fetch(`${BASE_URL}/accounts/logout/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Logout API failed", error);
  } finally {
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("role");

    navigate("/login");
  }
};

  return (
    <div className={`fixed left-0 top-0 z-50 bg-[#1a2c47] h-screen flex flex-col transition-all duration-300 ${sideBarOpen ? "w-64 sm:w-[312px]" : "w-20"}`}>

      {/* LOGO */}
      <div className="flex mt-3 mb-5 px-4">
        <div
          className="w-[64px] h-[62px] bg-no-repeat bg-center bg-cover flex-shrink-0"
          style={{ backgroundImage: `url('${amsLogo}')` }}
        />
        {sideBarOpen && (
          <div className="min-w-0 mt-3 ml-1">
            <div className="text-white font-bold text-[14px] sm:text-[16px] truncate">
              Adro Marketing Sphere
            </div>
            <div className="text-neutral-100 text-[12px] sm:text-[14px] truncate">
              Project Management Platform
            </div>
          </div>
        )}
        {/* <button
         onClick={() => setSideBarOpen(!sideBarOpen)}
         className="absolute -right-0 top-10 p-1 text-white z-50"
        >
        {sideBarOpen ? <KeyboardArrowLeftIcon/> : <KeyboardArrowRightIcon />}
        </button> */}
      </div>

      {/* NAVIGATION */}
      <div className="flex-1  ml-4">

        <Link to="/content-hub"
          className="flex items-center px-3 py-3 sm:py-2 text-white cursor-pointer hover:bg-[#152339] transition-colors min-h-[48px]"
        >
          <div className="w-6 h-6 mr-3 flex-shrink-0">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
              <path d={svgPaths.pef16a80} fill="white" />
            </svg>
          </div>
          {sideBarOpen && (<span className="font-semibold text-[14px] sm:text-[16px] truncate">Content Hub</span>)}

        </Link>

        <Link to="/planner" className="flex items-center px-3 py-3 sm:py-2 text-white cursor-pointer hover:bg-[#152339] transition-colors min-h-[48px]">
          <div className="w-6 h-6 mr-3 flex-shrink-0">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
              <path d={svgPaths.p8324480} fill="white" />
            </svg>
          </div>
          {sideBarOpen && (<span className="font-semibold text-[14px] sm:text-[16px] truncate">Planner</span>)}
        </Link>

        {/* <Link to="/campaign-hub" className="flex items-center px-3 py-3 sm:py-2 text-white cursor-pointer hover:bg-[#152339] transition-colors min-h-[48px]">
          <div className="w-6 h-6 mr-3 flex-shrink-0">
            <svg viewBox="0 0 23 24" fill="none" className="w-6 h-6">
              <path d={svgPaths.p189de200} fill="white" />
            </svg>
          </div>
          {sideBarOpen && (<span className="font-semibold text-[14px] sm:text-[16px] truncate">Campaign Hub</span>)}
        </Link> */}

        <div>
          {/* Campaign Hub */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between hover:bg-[#152339] transition-colors min-h-[48px]">

              {/* Navigate to Campaign Hub */}
              <Link
                to="/campaign-hub"
                className="flex items-center flex-1 px-3 py-3 sm:py-2 text-white"
              >
                <div className="w-6 h-6 mr-3 flex-shrink-0">
                  <svg viewBox="0 0 23 24" fill="none" className="w-6 h-6">
                    <path d={svgPaths.p189de200} fill="white" />
                  </svg>
                </div>

                {sideBarOpen && (
                  <span className="font-semibold text-[14px] sm:text-[16px] truncate">
                    Campaign Hub
                  </span>
                )}
              </Link>

              {/* Dropdown Toggle */}
              {sideBarOpen && (
                <button
                  onClick={() => setCampaignDropdownOpen(!campaignDropdownOpen)}
                  className="px-3 text-white h-full flex items-center"
                >
                  {campaignDropdownOpen ? (
                    <KeyboardArrowDownIcon className="text-white" />
                  ) : (
                    <KeyboardArrowRightIcon className="text-white" />
                  )}
                </button>
              )}
            </div>

            {/* Dropdown */}
            {campaignDropdownOpen && sideBarOpen && (
              <Link
                to="/event-hub"
                className="flex items-center ml-12 px-3 py-2 text-white cursor-pointer hover:bg-[#152339] transition-colors"
              >
                <span className="font-semibold text-[14px] sm:text-[16px]">
                  Event Hub
                </span>
              </Link>
            )}
          </div>
        </div>

        <div
          onClick={() =>
            import("sonner").then(({ toast }) =>
              toast("Proof Points is coming soon.")
            )
          }
          className="flex items-center px-3 py-3 sm:py-2 text-white cursor-pointer hover:bg-[#152339] transition-colors min-h-[48px]"
        >
          <div className="w-6 h-6 mr-3 flex-shrink-0">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
              <path d={svgPaths.p1ee106c0} stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          {sideBarOpen && (<span className="font-semibold text-[14px] sm:text-[16px] truncate">Proof Points</span>)}

        </div>

        <div
          onClick={() =>
            import("sonner").then(({ toast }) =>
              toast("Leads & Prospects is coming soon.")
            )
          }
          className="flex items-center px-3 py-3 sm:py-2 text-white cursor-pointer hover:bg-[#152339] transition-colors min-h-[48px]"
        >
          <div className="w-6 h-6 mr-3 flex-shrink-0">
            <svg viewBox="0 0 26 26" fill="none" className="w-6 h-6">
              <path d={svgPaths.p2382f940} fill="white" />
            </svg>
          </div>
          {sideBarOpen && (<span className="font-semibold text-[14px] sm:text-[16px] truncate">Leads & Prospects</span>)}
        </div>

        <div
          onClick={() =>
            import("sonner").then(({ toast }) =>
              toast("Assets Management is coming soon.")
            )
          }
          className="flex items-center px-3 py-3 sm:py-2 text-white cursor-pointer hover:bg-[#152339] transition-colors min-h-[48px]"
        >
          <div className="w-6 h-6 mr-3 flex-shrink-0">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
              <path d={svgPaths.p15652a00} stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          {sideBarOpen && (<span className="font-semibold text-[14px] sm:text-[16px] truncate">Assets Management</span>)}
        </div>

        <div
          onClick={() =>
            import("sonner").then(({ toast }) =>
              toast("Analytics is coming soon.")
            )
          }
          className="flex items-center px-3 py-2 text-white cursor-pointer hover:bg-[#152339] transition min-h-[48px]"
        >
          <div className="w-6 h-6 mr-3 flex-shrink-0">
            <svg viewBox="0 0 16 16" fill="none" className="w-6 h-6">
              <path d={svgPaths.p33ade3f1} fill="white" />
            </svg>
          </div>
          {sideBarOpen && (<span className="font-semibold text-[14px] sm:text-[16px] truncate">
            Analytics
          </span>)}
        </div>
      </div>

      {/* SUPPORT + SETTINGS (FIXED BELOW NAV) */}
      <div className="border-y border-gray-600 p-2">

        <Link
          to="/invite-user"
          className="flex items-center px-3 py-2 text-white cursor-pointer hover:bg-[#152339]"
        >
          <div className="w-6 h-6 mr-3">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
              <path
                d={svgPaths.p30dc0400}
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          {sideBarOpen && (<span className="font-semibold text-[14px] sm:text-[16px]">
            Invite User
          </span>)}

        </Link>

        <div
          className="flex items-center px-3 py-2 text-white cursor-pointer hover:bg-[#152339]"
          onClick={() =>
            import("sonner").then(({ toast }) =>
              toast("Settings functionality is coming soon.")
            )
          }
        >
          <div className="w-6 h-6 mr-3">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
              <path
                d={svgPaths.p3cccb600}
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={svgPaths.p3737f500}
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          {sideBarOpen && (<span className="font-semibold text-[14px] sm:text-[16px]">
            Settings
          </span>)}

        </div>
      </div>

      <div className="p-4 border-t border-gray-600">
        <div className="flex items-center justify-between">

          {/* USER INFO */}
          {/* <div className="flex items-center gap-3 min-w-0">
      <Avatar className="w-10 h-10 flex-shrink-0">
        <AvatarFallback className="bg-gray-200 text-black text-sm">
          A
        </AvatarFallback>
      </Avatar>

      <div className="text-white min-w-0">
        <div className="font-bold text-sm truncate">
          Abhiraj Karan
        </div>
        <div className="text-sm truncate">
          abhirajkaran484@gmail.com
        </div>
      </div>
    </div> */}
          <div className="flex items-center gap-2 min-w-0">
            <Avatar className="w-10 h-10 flex-shrink-0">
              <AvatarFallback className="bg-gray-200 text-black text-sm">
                {user?.full_name
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase() || "GU"}
              </AvatarFallback>
            </Avatar>

            <div className="text-white min-w-0">
              <div className="font-bold text-sm truncate">
                {user?.full_name || "Guest User"}
              </div>
              <div className="text-sm truncate">
                {user?.email || "guest@example.com"}
              </div>
              <div className="text-sm truncate">
                {user?.role || "guest@example.com"}
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-gray-600 flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10"
            title="Logout"
            onClick={handleLogout}
          >
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 sm:w-5 sm:h-5">
              <path
                d={svgPaths.p17b1b80}
                stroke="white"
                strokeWidth="1.67"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        </div>
      </div>

    </div>
  )
}

export default SidebarNavigation
