import { Input } from "../ui/input";
import { Search, Bell } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton, Menu, MenuItem, Badge, Typography, Divider } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';

const HeaderSection = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = () => {
    handleClose();
    navigate("/content-to-approve");
  };

  return (
    <div className="top-0 left-0 right-0 w-full py-6 border-b border-gray-200 bg-white">
      <div className="flex items-center w-full px-6">

        {/* RIGHT SECTION */}
        <div className="relative flex items-center gap-2 ml-auto">

          {/* SEARCH */}
          <div className="relative">
            <Input
              placeholder="Search projects, tasks"
              className="w-48 sm:w-64 md:w-80 pl-10 rounded-full border-gray-300 text-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
          </div>

          {/* NOTIFICATION */}
          <IconButton >
            <Badge color="error">
              <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
            </Badge>
          </IconButton>
          <IconButton onClick={handleClick}>
            <MenuIcon sx={{ color: "gray" }}/>
          </IconButton>

          {/* DROPDOWN MENU */}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              style: {
                width: 280,
                borderRadius: 10,
              },
            }}
          >
            <MenuItem
              onClick={() => { navigate("/content-brief-list") }}
              sx={{
                justifyContent: "center",
                py: 1.5,
                color: "text.secondary",
              }}
            >
              Content Brief List
            </MenuItem>

            <MenuItem
              onClick={handleNavigate}
              sx={{
                justifyContent: "center",
                py: 1.5,
                color: "text.secondary",
              }}
            >
              Contents to Review
            </MenuItem>

            <MenuItem
              onClick={() => { navigate("/approved-content") }}
              sx={{
                justifyContent: "center",
                py: 1.5,
                color: "text.secondary",
              }}
            >
              Approved Contents
            </MenuItem>

          </Menu>

        </div>
      </div>
    </div>
  );
};

export default HeaderSection;