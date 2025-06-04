import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./ReceiverSidebar.scss";
import { ReactSVG } from "react-svg";
import deadlineIcon from "../../assets/svg/deadline.svg";
import addFile from "../../assets/svg/showall.svg";
import approval from "../../assets/svg/approvals.svg";
import logoutIcon from "../../assets/svg/logout.svg";
import dashboardIcon from "../../assets/svg/dashboardIcon.svg";
import masters from "../../assets/svg/mastersIcon.svg";
import allocateIcon from "../../assets/svg/allocate.svg";
import closeopen from "../../assets/svg/masteropencloseIcon.svg";
import { useDispatch } from "react-redux";
import {
  logoutUser,
  updateResetMessage,
} from "../../../store/features/authorization";
// import { showSuccessToast } from '../../common/ToastNotification/Toast';
import studytrackerIcon from "../../assets/svg/studytracker.svg";
import {
  dashboardBarchartValues,
  dashboardDonutchartValues,
} from "../../../store/features/briefsData";

const ReceiverSidebar = () => {
  const [showModal, setShowModal] = useState(false);
  const [showMasters, setShowMasters] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "logoutEvent") {
        dispatch(logoutUser());
        navigate("/", { replace: true });
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [dispatch, navigate]);

  const handleSignout = () => {
    dispatch(logoutUser());

    localStorage.removeItem("token");
    localStorage.removeItem("role");

    localStorage.setItem("logoutEvent", Date.now());
    //  showSuccessToast("Logged out successfully!", "success");
    setShowModal(true);

    setTimeout(() => {
      navigate("/", { replace: true });
      window.location.reload();
    }, 500);
  };
  const role = localStorage.getItem("role");

  const handleChange = () => {
    dispatch(dashboardBarchartValues());
    dispatch(dashboardDonutchartValues());
  };
  const handleNavigate = () => {
    const navigate = useNavigate();
    navigate("/receiverlayout/receiverbrief", { replace: true });
  };
  const handleNavigateDashboard = () => {
    const navigate = useNavigate();
    navigate("/receiverlayout/dashboard", { replace: true });
  };

  return (
    <aside className="sidebar-rec-flow">
      <nav className="menu">
        <ul>
          {(role === "Admin" || role === "Super Admin") && (
            <li>
              <NavLink
                to="/receiverlayout/dashboard"
                className="menu-item"
                activeClassName="active"
                onClick={handleNavigateDashboard}
              >
                <ReactSVG src={dashboardIcon} className="icon menu-icon" />{" "}
                Dashboard
              </NavLink>
            </li>
          )}
          <li>
            <NavLink
              to="/receiverlayout/todaydeadline"
              className="menu-item"
              activeClassName="active"
            >
              <ReactSVG src={deadlineIcon} className="icon menu-icon" /> Today's
              Deadlines
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/receiverlayout/statusbrief"
              className="menu-item"
              activeClassName="active"
            >
              <ReactSVG src={addFile} className="icon menu-icon" />
              Pending Briefs
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/receiverlayout/receiverbrief"
              className="menu-item"
              activeClassName="active"
              onClick={handleNavigate}
            >
              <ReactSVG src={approval} className="icon menu-icon" /> Brief
              Status
            </NavLink>
          </li>

          {(role === "Admin" || role === "Super Admin") && (
            <li>
              <NavLink
                to="/receiverlayout/allocatestudy"
                className="menu-item"
                activeClassName="active"
              >
                <ReactSVG src={allocateIcon} className="icon menu-icon" />
                Allocate Study
              </NavLink>
            </li>
          )}
          {role === "Project Coordinator" && (
            <li>
              <NavLink
                to="/receiverlayout/studytracker"
                className="menu-item"
                activeClassName="active"
              >
                <ReactSVG src={studytrackerIcon} className="icon menu-icon" />{" "}
                Study Tracker
              </NavLink>
            </li>
          )}
          {/* <li>
            <NavLink
              to="/receiverlayout/receiverbrief"
              className="menu-item"
              activeClassName="active"
              onClick={handleNavigate} 
            >
              <ReactSVG src={masters} className="icon menu-icon" /> Masters
            </NavLink>
          </li> */}
          <li>
            <div
              className="menu-item"
              onClick={() => setShowMasters(!showMasters)}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <ReactSVG src={masters} className="icon menu-icon" />
                Masters
              </div>
              <span className={`arrow ${showMasters ? "open" : ""}`}>
                <ReactSVG src={closeopen} />
              </span>
            </div>

            {showMasters && (
              <ul className="submenu">
                <li>
                  <NavLink
                    to="/receiverlayout/products"
                    className={({ isActive }) =>
                      `menu-item ${isActive ? "active-submenu" : ""}`
                    }
                  >
                    Products
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/receiverlayout/studytype"
                    className={({ isActive }) =>
                      `menu-item ${isActive ? "active-submenu" : ""}`
                    }
                  >
                    Study Type
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/receiverlayout/researchtype"
                    className={({ isActive }) =>
                      `menu-item ${isActive ? "active-submenu" : ""}`
                    }
                  >
                    Research Type
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/receiverlayout/cities"
                    className={({ isActive }) =>
                      `menu-item ${isActive ? "active-submenu" : ""}`
                    }
                  >
                    Cities
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/receiverlayout/department"
                    className={({ isActive }) =>
                      `menu-item ${isActive ? "active-submenu" : ""}`
                    }
                  >
                    Department
                  </NavLink>
                </li>
              </ul>
            )}
          </li>
         
        </ul>
      </nav>
      <div className="logout-container">
        <NavLink onClick={handleSignout} className="menu-items signout-item">
          <ReactSVG src={logoutIcon} className="icon" />
          <label>Sign Out</label>
        </NavLink>
      </div>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Logged out successfully!</h3>
          </div>
        </div>
      )}
    </aside>
  );
};

export default ReceiverSidebar;
