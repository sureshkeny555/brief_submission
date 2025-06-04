import React from "react";
import deletIcon from "../../assets/svg/masterDeleteIcon.svg";
import pageIocn from "../../assets/svg/pageIcon.svg";
import { ReactSVG } from "react-svg";
import "./DeleteComponent.scss";

function Deletcomponent({handleClose}) {
  return (
    <div className="modal-overlay-delete">
      <div className="modal-content-delete">
        <div
          style={{
            fontFamily: "Open Sans",
            fontWeight: 400,
            fontSize: "16px",
            letterSpacing: "0%",
            color: "#475467",
            padding: "32px 32px 32px 32px",
          }}
        >
          <h3>
            {" "}
            <ReactSVG src={deletIcon} />
          </h3>
          <div>
            <div style={{ marginBottom: "20px" }}>
              “Are you sure you want to delete this category? This action cannot
              be undone.”
            </div>
            {/* <div className="emp-details">
            <p>
              Employee:<strong>Kshitij Rao</strong>{" "}
            </p>
            <p>
              Role:<strong>R&D Manager</strong>{" "}
            </p>
            <p>
              Department:<strong> R&D</strong>
            </p>
            <p>
              Status:<strong>R&D</strong>
            </p>
          </div> */}
            <div className="delete-details">
              <div className="info-row">
                <span>Employee:</span>
                <strong>Kshitij Rao</strong>
              </div>
              <div className="info-row">
                <span>Role:</span>
                <strong>R&D Manager</strong>
              </div>
              <div className="info-row">
                <span>Department:</span>
                <strong>R&D</strong>
              </div>
              <div className="info-row">
                <span>Status:</span>
                <strong>Inactive</strong>
              </div>
            </div>
          </div>
          <div className="form-act-delete">
            <button type="button" className="cancel-btn-delete" onClick={handleClose}>
              No, Keep it
            </button>
            <button type="submit" className="submit-button-delete">
              Yes, Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Deletcomponent;
