import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.scss";
import approve from "../../../Components/assets/svg/approvals.svg";
import addIcon from "../../../Components/assets/svg/svg/addNewFile.svg";
import { ReactSVG } from "react-svg";
import logoutIcon from "../../assets/svg/logout.svg";
import {
  logoutUser,
  updateResetMessage,
} from "../../../store/features/authorization";
import { useDispatch } from "react-redux";
// import { showSuccessToast,showErrorToast } from "../../common/ToastNotification/Toast";

const Sidebar = () => {
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(updateResetMessage());
  }, [dispatch]);

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
    // showSuccessToast("Logged out successfully!", "failed");
    setShowModal(true);

    setTimeout(() => {
      navigate("/", { replace: true });
      window.location.reload();
    }, 500); 
  };

  return (
    <aside className="sidebar-cre">
      <nav className="menu">
        <ul>
          <li>
            <NavLink
              to="/layout/createbrief"
              className="menu-item"
              activeClassName="active"
            >
              <ReactSVG src={addIcon} className="icon" /> Create Brief
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/layout/briefstatus"
              className="menu-item"
              activeClassName="active"
            >
              <ReactSVG src={approve} className="icon" />
              Brief Status
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="logout-container">
        <NavLink onClick={handleSignout} className="menu-item signout-item">
          <ReactSVG src={logoutIcon} className="icon" />
          <label
            style={{ color: "blue", fontSize: "16px", fontFamily: "Open Sans" }}
          >
            Sign Out
          </label>
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

export default Sidebar;
