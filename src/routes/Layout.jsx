import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./Layout.scss";
import Header from "../Components/CreatorFlow/Header/Header";
import Sidebar from "../Components/CreatorFlow/Sidebar/Sidebar";
import { useDispatch } from "react-redux";
import { logoutUser, setupSessionTimeout } from "../store/features/authorization";
// import { showSuccessToast,showErrorToast } from "../Components/common/ToastNotification/Toast";

const Layout = () => {
   const location = useLocation();
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const [isSessionExpired, setIsSessionExpired] = useState(false);
   const timeoutDuration = 15 * 60 * 1000; 
   const isLoginPage = location.pathname === '/'; 
   const user = localStorage.getItem("token");
  
   const handleSessionTimeout = () => {
     setIsSessionExpired(true);
     alert("session expired")
     dispatch(logoutUser()); 
     showErrorToast("Session expired!", "failed");
     navigate('/'); 
   };
 
   useEffect(() => {
     const activityEvents = ['click', 'mousemove', 'keydown'];
     let timeoutId;
 
     const resetTimeout = () => {
       if (isSessionExpired) setIsSessionExpired(false); 
       clearTimeout(timeoutId);
       timeoutId = setTimeout(handleSessionTimeout, timeoutDuration);
     };
 
     activityEvents.forEach(event => window.addEventListener(event, resetTimeout));
 
     timeoutId = setTimeout(handleSessionTimeout, timeoutDuration);
 
     return () => {
       activityEvents.forEach(event => window.removeEventListener(event, resetTimeout));
       clearTimeout(timeoutId);
     };
   }, [isSessionExpired, dispatch, navigate]);

   useEffect(() => {
    if (user && isLoginPage) {
      navigate("/layout/createbrief");
    }

    if (!user && !isLoginPage) {
      navigate("/");
    }
  }, [user, isLoginPage, navigate])

  return (
    <div className="layout">
      {!isLoginPage && <Header />}

      <div className="layout-body">
        {!isLoginPage && <Sidebar />}

        <main className="main-content">
          <Outlet/>
        </main>
      </div>
    </div>
  );
};

export default Layout;
