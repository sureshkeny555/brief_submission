import React, { useState } from "react";
import { ReactSVG } from "react-svg";
import importIcon from "../../../assets/svg/importicon.svg";
import addproductIcon from "../../../assets/svg/addproducts.svg";
import exportIcon from "../../../assets/svg/exporticon.svg";
import "./ResearchType.scss";
import Deletcomponent from "../../../common/DeleteComponent/Deletcomponent";
import editIcon from "../../../assets/svg/editIcon.svg";
import deleteIcon from "../../../assets/svg/deleteIcon.svg";

function Researchtype() {
  const productData = [
    {
      id: 1,
      studyType: "Beverages",
      status: "Active",
    },
    {
      id: 2,
      studyType: "Beverages",
      status: "Active",
    },
    {
      id: 3,
      studyType: "Snacks",
      status: "Inactive",
    },
  ];
  const [formData, setFormData] = useState({
    studyType: "",
    status: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [isAcceptProductModalOpen, setIsAcceptProductModalOpen] =
    useState(false);
  const [isUpdateProductModalOpen, setIsUpdateProductModalOpen] =
    useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAcceptSubmit = () => {};

  const openAcceptModal = () => {
    setFormData({
      studyType: "",
      status: "",
    });
    setIsAcceptProductModalOpen(true);
  };
  const closeAcceptModal = () => {
    setIsAcceptProductModalOpen(false);
  };
  const closeUpdateModal = () => {
    setIsUpdateProductModalOpen(false);
  };
  const handleDeleteClick = () => {
    setShowModal(true);
  };
  const handleEditClick = (item) => {
    setFormData({
      studyType: item.studyType,
      // status: item.status,
      status: item.status === "Active" ? true : false,
    });
    setIsUpdateProductModalOpen(true);
  };
  const handleClose = () => {
    setShowModal(false);
  };
  return (
    <div className="research-body">
      <div className="research-header">
        <div className="header-name">
          <h3>Products</h3>
        </div>
        <div className="header-buttons">
          <input
            style={{
              width: "460px",
              height: "48px",
              borderRadius: "24px",
              padding: "12px 16px",
            }}
            placeholder="Search Category, Sub-Category, Brand"
            type="text"
          />
          {/* <button className="import-button" style={{ display: "flex" }}>
              <ReactSVG src={importIcon} />
              Import File
            </button>
            <button className="export-button">
              <ReactSVG src={exportIcon} />
              Export File
            </button> */}
          <button className="add-button" onClick={openAcceptModal}>
            <ReactSVG src={addproductIcon} />
            Add Research Type
          </button>
        </div>
      </div>
      <div className="research-content">
        <div className="research-formhead">
          <table className="">
            <thead className="">
              <tr>
                <th>Category</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {productData.map((item, key) => (
                <tr>
                  <td>{item.studyType}</td>
                  <td>{item.status}</td>
                  <td
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    <ReactSVG
                      src={editIcon}
                      style={{ cursor: "pointer" }}
                      onClick={() => handleEditClick(item)}
                    />
                    <ReactSVG
                      src={deleteIcon}
                      style={{ cursor: "pointer" }}
                      onClick={handleDeleteClick}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* <div className="research-formbody"></div> */}
        <div className="research-formfoot">
          <button className="research-previous">Previous</button>
          <div>Pagination</div>
          <button className="research-next">Next</button>
        </div>
      </div>

      {isAcceptProductModalOpen && (
        <div className="modal-overlay-pro">
          <div className="modal-content-pro">
            <div className="modal-header-pro">
              <h3>Add Research Type</h3>
              <button onClick={closeAcceptModal} className="close-modal">
                &times;
              </button>
            </div>
            <div className="modal-body">
              <form className="form-pro" onSubmit={handleAcceptSubmit}>
                <div className="form-groups-pro">
                  <label className="required">Research Type</label>
                  <input
                    type="text"
                    name="po_approval"
                    value={formData.po_approval}
                    onChange={handleInputChange}
                    placeholder="Enter Research Type"
                    readOnly
                    required
                  />
                </div>

                <div className="form-groups-pro">
                  <label className="required">Status</label>
                  <label className="switch">
                    <input
                      type="checkbox"
                      name="travel_cost"
                      checked={formData.travel_cost}
                      onChange={handleInputChange}
                    />
                    <span className="slider round"></span>
                  </label>
                  <span className="toggle-label">
                    {formData.travel_cost ? "ACTIVE" : "INACTIVE"}
                  </span>
                </div>

                <div className="form-act-pro">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={closeAcceptModal}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="submit-button">
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
   {isUpdateProductModalOpen && (
        <div className="modal-overlay-pro">
          <div className="modal-content-pro">
            <div className="modal-header-pro">
              <h3>Add Study Type</h3>
              <button onClick={closeUpdateModal} className="close-modal">
                &times;
              </button>
            </div>
            <div className="modal-body">
              <form className="form-pro" onSubmit={handleAcceptSubmit}>
                <div className="form-groups-pro">
                  <label className="required">Study Type</label>
                  <input
                    type="text"
                    name="studyType"
                    value={formData.studyType}
                    onChange={handleInputChange}
                    placeholder="Enter Study Type"
                  />
                </div>

                <div className="form-groups-pro">
                  <label className="required">Status</label>
                  <label className="switch">
                    <input
                      type="checkbox"
                      name="status"
                      checked={formData.status}
                      onChange={handleInputChange}
                    />
                    <span className="slider round"></span>
                  </label>
                  <span className="toggle-label">
                    {formData.status ? "ACTIVE" : "INACTIVE"}
                  </span>
                </div>

                <div className="form-act-pro">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={closeAcceptModal}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="submit-button">
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {showModal && (<Deletcomponent show={showModal} handleClose={handleClose}/>)}
    </div>
  );
}

export default Researchtype;
