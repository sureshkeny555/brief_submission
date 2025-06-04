import React from "react";
import Search from "../../../Components/assets/images/Serach.png";
import "../CreateBrief/Createbrief.scss";
import { useNavigate } from "react-router-dom";

const CreateBrief = () => {
  const navigate = useNavigate();

  const openModal = () => {
    navigate("/layout/newbrief");
  };

  return (
    <div>
      <div className="no-data">
        <div className="no-data-image">
          <img src={Search} alt="No Data Found" />
        </div>
        <p>"Please create a new brief"</p>
        <button className="create-brief-btn" onClick={openModal}>
          + Create Brief
        </button>
      </div>
    </div>
  );
};

export default CreateBrief;
