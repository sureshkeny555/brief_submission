import React, { useState } from "react";
import "./Products.scss";
import { ReactSVG } from "react-svg";
import importIcon from "../../../assets/svg/importicon.svg";
import addproductIcon from "../../../assets/svg/addproducts.svg";
import exportIcon from "../../../assets/svg/exporticon.svg";
import editIcon from "../../../assets/svg/editIcon.svg";
import deleteIcon from "../../../assets/svg/deleteIcon.svg";
// import deleteIcon from '../../../assets/svg/deleteIcon.svg";'
import Modal from "../../../common/Modal/Modal";
import Deletcomponent from "../../../common/DeleteComponent/Deletcomponent";

function Products() {
  const productData = [
    {
      id: 1,
      category: "Beverages",
      subCategory: "Soft Drinks",
      brand: "Coca Cola",
      status: "Active",
    },
    {
      id: 2,
      category: "Beverages",
      subCategory: "Soft Drinks",
      brand: "Coca Cola",
      status: "Active",
    },
    {
      id: 3,
      category: "Snacks",
      subCategory: "Chips",
      brand: "Lays",
      status: "Inactive",
    },
  ];

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    categoryType: "",
    subCategory: "",
    brand: "",
    status: "",
  });
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
      categoryType: "",
      subCategory: "",
      brand: "",
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
      categoryType: item.category,
      subCategory: item.subCategory,
      brand: item.brand,
      status: item.status === "Active" ? true : false,
    });
    setIsUpdateProductModalOpen(true);
  };
  const handleClose = () => {
    setShowModal(false);
  };
  return (
    <div className="pro-body">
      <div className="pro-header">
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
            Add Product
          </button>
        </div>
      </div>
      <div className="pro-content">
        <div className="pro-formhead">
          <table className="">
            <thead className="">
              <tr>
                <th>Category</th>
                <th>Sub-Category</th>
                <th>Brand</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {productData.map((item, key) => (
                <tr>
                  <td>{item.category}</td>
                  <td>{item.subCategory}</td>
                  <td>{item.brand}</td>
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
        {/* <div className="pro-formbody"></div> */}
        <div className="pro-formfoot">
          <button className="pro-previous">Previous</button>
          <div>Pagination</div>
          <button className="pro-next">Next</button>
        </div>
      </div>

      {isAcceptProductModalOpen && (
        <div className="modal-overlay-pro">
          <div className="modal-content-pro">
            <div className="modal-header-pro">
              <h3>Add Product</h3>
              <button onClick={closeAcceptModal} className="close-modal">
                &times;
              </button>
            </div>
            <div className="modal-body">
              <form className="form-pro" onSubmit={handleAcceptSubmit}>
                <div className="form-groups-pro">
                  <label className="required">Category</label>
                  <input
                    type="text"
                    name="category_type"
                    value={formData.categoryType}
                    onChange={handleInputChange}
                    placeholder="Enter Category Name"
                    required
                  />
                </div>

                <div className="form-groups-pro">
                  <label className="required">Sub-Category</label>
                  <input
                    type="text"
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleInputChange}
                    placeholder="Enter Sub-Category Name"
                    required
                  />
                </div>

                <div className="form-groups-pro">
                  <label className="required">Brand</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    autoComplete="off"
                    placeholder="Enter Brand Name"
                    required
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
              <h3>Update Product</h3>
              <button onClick={closeUpdateModal} className="close-modal">
                &times;
              </button>
            </div>
            <div className="modal-body">
              <form className="form-pro" onSubmit={handleAcceptSubmit}>
                <div className="form-groups-pro">
                  <label className="required">Category</label>
                  <input
                    type="text"
                    name="categoryType"
                    value={formData.categoryType}
                    onChange={handleInputChange}
                    placeholder="Enter Category Name"
                    required
                  />
                </div>

                <div className="form-groups-pro">
                  <label className="required">Sub-Category</label>
                  <input
                    type="text"
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleInputChange}
                    placeholder="Enter Sub-Category Name"
                  />
                </div>

                <div className="form-groups-pro">
                  <label className="required">Brand</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    autoComplete="off"
                    placeholder="Enter Brand Name"
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
      {/* <Modal
        show={showModal}
        onClose={handleCloseModal}
        title={modalContent.title}
        message={modalContent.message}
        type={modalContent.type}
        // onTryAgain={handleTryAgain}
        onContinue={handleContinue}
      /> */}
      {showModal && (
        <Deletcomponent show={showModal} handleClose={handleClose} />
      )}
    </div>
  );
}

export default Products;
