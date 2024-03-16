import { useAuth } from "../auth-context";
import "./navbar.scss";
import { usePermissionContext } from "../AdmissionPermission";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";

const Navbar = () => {
  const { logout, isAuthenticated, isSubAuthenticated } = useAuth();
  const [adminClicked, setAdminClicked] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const { username } = usePermissionContext();

  return (
    <div className="navbar">
      <div className="logo">
        <img src="/logo.svg" alt="" />
        <span>Admin Dashboard</span>
      </div>
      <div className="icons">
        <img src="/search.svg" alt="" className="icon" />
        <img src="/app.svg" alt="" className="icon" />
        <div className="notification">
          <img src="/notifications.svg" alt="" />
          <span>1</span>
        </div>
        <div className={`admin_column ${adminClicked ? "admin" : ""}`}>
          <div className="user" onClick={() => setAdminClicked(!adminClicked)}>
            <img src="/man.png" alt="" />
            <div>{username}</div>
            <ExpandMoreIcon className="arrow_icon" />
          </div>

          {adminClicked && (
            <div className="logout_column">
              {(isAuthenticated || isSubAuthenticated) && (
                <div className="logout_section">
                  <PowerSettingsNewIcon className="logout_icon" />
                  <span className="logout" onClick={handleLogout}>
                    Logout
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
