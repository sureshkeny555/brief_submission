import React, { useState } from "react";
import { ReactSVG } from "react-svg";
import importIcon from "../../../assets/svg/importicon.svg";
import addproductIcon from "../../../assets/svg/addproducts.svg";
import exportIcon from "../../../assets/svg/exporticon.svg";
import "./Department.scss";
import editIcon from "../../../assets/svg/editIcon.svg";
import deleteIcon from "../../../assets/svg/deleteIcon.svg";
import Deletcomponent from "../../../common/DeleteComponent/Deletcomponent";

function Department() {
  const productData = [
    {
      id: "1",
      employee: "naveen",
      role: "admin",
      department: "CIA",
      status: "Inactive",
    },
    {
      id: "1",
      employee: "naveen",
      role: "admin",
      department: "CIA",
      status: "Active",
    },
    {
      id: "1",
      employee: "naveen",
      role: "admin",
      department: "CIA",
      status: "Active",
    },
    {
      id: "1",
      employee: "naveen",
      role: "admin",
      department: "CIA",
      status: "Active",
    },
  ];
  const [formData, setFormData] = useState({
    employee: "",
    role: "",
    department: "",
    status: "",
  });
  const [isAcceptProductModalOpen, setIsAcceptProductModalOpen] =
    useState(false);
  const [isUpdateProductModalOpen, setIsUpdateProductModalOpen] =
    useState(false);
  const [showModal, setShowModal] = useState(false);

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
      employee:'',
      role:'',
      department:'',
      status:''
    })
    setIsAcceptProductModalOpen(true);
  };
  const closeAcceptModal = () => {
    
    setIsAcceptProductModalOpen(false);
  };
  const closeUpdateModal = () => {
    setIsUpdateProductModalOpen(false);
  };
  const handleDeleteClick = () => {
    setShowModal(true)
  }
  const handleEditClick = (item) => {
    setFormData({
      employee:item.employee,
      role:item.role,
      department:item.department,
      status:item.status === 'Active' ? true : false
    })
    setIsUpdateProductModalOpen(true)
  }
  const handleClose = () => {
    setShowModal(false)
  }
  return (
    <div className="department-body">
      <div className="department-header">
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
            Add Department
          </button>
        </div>
      </div>
      <div className="department-content">
        <div className="department-formhead">
          <table className="">
            <thead className="">
              <tr>
                <th>Employee</th>
                <th>Role</th>
                <th>Department</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {productData.map((item) => (
                <tr>
                  <td>{item.employee}</td>
                  <td>{item.role}</td>
                  <td>{item.department}</td>
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
        {/* <div className="department-formbody"></div> */}
        <div className="department-formfoot">
          <button className="department-previous">Previous</button>
          <div>Pagination</div>
          <button className="department-next">Next</button>
        </div>
      </div>

      {isAcceptProductModalOpen && (
        <div className="modal-overlay-pro">
          <div className="modal-content-pro">
            <div className="modal-header-pro">
              <h3>Add Department</h3>
              <button onClick={closeAcceptModal} className="close-modal">
                &times;
              </button>
            </div>
            <div className="modal-body">
              <form className="form-pro" onSubmit={handleAcceptSubmit}>
                <div className="form-groups-dep">
                  <label className="required">Employee</label>
                  <input
                    type="text"
                    name="employee"
                    value={formData.employee}
                    onChange={handleInputChange}
                    placeholder="Enter Employee Name"
                    readOnly
                    required
                  />
                </div>
                <div className="form-groups-dep">
                  <label className="required">Role</label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    placeholder="Enter Role Name"
                    readOnly
                    required
                  />
                </div>
                <div className="form-groups-dep">
                  <label className="required">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="Enter Department Name"
                    readOnly
                    required
                  />
                </div>

                <div className="form-groups-dep">
                  <label className="required">Status</label>
                  <label className="switch">
                    <input
                      type="checkbox"
                      name="status"
                      checked={formData.status}
                      onChange={handleInputChange}
                    />
                    <span className="slider-department round"></span>
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
              <h3>Add Department</h3>
              <button onClick={closeUpdateModal} className="close-modal">
                &times;
              </button>
            </div>
            <div className="modal-body">
              <form className="form-pro" onSubmit={handleAcceptSubmit}>
                <div className="form-groups-dep">
                  <label className="required">Employee</label>
                  <input
                    type="text"
                    name="employee"
                    value={formData.employee}
                    onChange={handleInputChange}
                    placeholder="Enter Employee Name"
                    readOnly
                    required
                  />
                </div>
                <div className="form-groups-dep">
                  <label className="required">Role</label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    placeholder="Enter Role Name"
                    readOnly
                    required
                  />
                </div>
                <div className="form-groups-dep">
                  <label className="required">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="Enter Department Name"
                    readOnly
                    required
                  />
                </div>

                <div className="form-groups-dep">
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
                    onClick={closeUpdateModal}
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

export default Department;
