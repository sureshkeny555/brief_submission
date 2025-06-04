// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import Login from "../Components/Login/Login";
import Layout from "./Layout";
import ReceiverLayout from "./ReceiverLayout";

export default function HomePage() {

  const accessToken = localStorage.getItem("token");
  const role = localStorage.getItem("role");


  return (
    <div>
      {accessToken ? role === "Creator" ? <Layout/> : <ReceiverLayout/> : <Login/>}
    </div>
  );
}


