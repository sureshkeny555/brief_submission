import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  briefStatusFileUpload,
  getCountValue,
  getReceiverBrieftStatus,
  getReceiverBrieftStatusSearch,
  getSearchValue,
  updateResetMessage,
  updateSetSelectedStatus,
} from "../../../store/features/briefsData";
import "./BriefStatusReceiver.scss";
import addFile from "../../assets/svg/attachFiles.svg";
import uploadfile from "../../assets/svg/uploadfiles.svg";
import selectedFileIcon from "../../assets/svg/selectedFile.svg";
import sideMenuIcon from "../../assets/svg/sidemenu.svg";
import { ReactSVG } from "react-svg";
import { client } from "../../../utils/client";
import Modal from "../../common/Modal/Modal";
import DownloadIcon from "../../assets/svg/downloadIcon.svg";
import viewIcon from "../../assets/svg/view.svg";
import searchIcon from "../../assets/svg/searchicon.svg";

function BriefStatusReceiver() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [selectedFile, setSelectedFile] = useState(null);
  const [selectedBriefId, setSelectedBriefId] = useState(null);
  const [visibleCosts, setVisibleCosts] = useState({});
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [fileUploads, setFileUploads] = useState({});
  const [formData, setFormData] = useState({
    attachments: null,
    briefId: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    type: "",
  });
  // const [selectedStatus, setSelectedStatus] = useState("All");
  const selectedStatus = useSelector((state) => state?.briefs?.selectedStatus);

  const newCounts = useSelector((state) => state?.briefs?.countsValue);
  const counts = newCounts.data?.counts || {};
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [loading, setLoading] = useState(false);
  // const[refreshKey,setRefreshKey] = useState(0)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef({});
  const [isOpen, setIsOpen] = useState(false);

  const briefStatus = useSelector(
    (state) => state?.briefs?.receiverBriefStatus
  );
  const role = localStorage.getItem("role");
  const totalRecords = briefStatus?.pagination?.total_records;
  const successMessage = useSelector((state) => state?.briefs?.successMessage);
  const errorMessages = useSelector((state) => state?.briefs?.errorMessage);
  const currentPage = useSelector((state) => state?.briefs?.currentPage || 1);
  const briefCount = useSelector((state) => state?.briefs?.briefsCount || 0);
  const searchTerm = useSelector((state) => state?.briefs?.searchTerm);
  const searchCount = useSelector((state) => state?.briefs?.searchCount || 0);
  const rowsPerPage = 10;
  // const totalPages = Math.ceil(briefCount / rowsPerPage)
  useEffect(() => {
    dispatch(updateResetMessage());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getReceiverBrieftStatus(currentPage));
  }, [dispatch]);

  useEffect(() => {
    if (searchQuery) {
      dispatch(getReceiverBrieftStatusSearch(searchQuery, 1));
    }
  }, [searchQuery, dispatch]);

  useEffect(() => {
    dispatch(getCountValue());
  }, []);

  const header = [
    "Study Name",
    "Deadline",
     "Created At",
     "Creator",
    "Reviewer Status",
    "Total Cost",
    "Creator Status",
    "File",
  ];

  const handleToggleTotalCost = (brief_id) => {
    setVisibleCosts((prevVisibleCosts) => ({
      ...prevVisibleCosts,
      [brief_id]: !prevVisibleCosts[brief_id],
    }));
  };

  const handleFileUpload = (e, briefId) => {
    const files = e.target.files;
    if (files.length > 0) {
      setFormData({
        attachments: files[0],
        briefId: briefId,
      });
    }
  };

  const handleAttachFile = async (e) => {
    e.preventDefault();

    if (!formData.attachments || !formData.briefId) {
      alert("Please select a file and a valid brief ID before submitting.");
      return;
    }

    console.log("Form Data Before Submit:", formData);

    const newFormData = new FormData();
    newFormData.append("file_path", formData.attachments);
    newFormData.append("brief_id", formData.briefId);

    for (let pair of newFormData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    try {
      const response = await client.uploadFile("/upload_file", newFormData);

      if (response?.data?.statusCode === 200) {
        setModalContent({
          title: "File Uploaded",
          message:
            response?.data?.message ||
            "Your file has been uploaded successfully!",
          type: "success",
        });
        setShowModal(true);
        console.log(response, "File uploaded successfully!");

        setFileUploads((prevState) => ({
          ...prevState,
          [formData.briefId]: formData.attachments.name,
        }));
        setIsModalOpen(false);
      } else {
        setModalContent({
          title: "Upload Failed",
          message: response?.data?.message || "Failed to upload file",
          type: "failure",
        });
        setShowModal(true);
      }
    } catch (error) {
      console.error("File upload failed:", error);
      setModalContent({
        title: "Upload Failed",
        message:
          error?.response?.data?.message ||
          "Failed to upload file. Please try again.",
        type: "failure",
      });
      setShowModal(true);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(e.target.value);
    const endpoint = "brief_status";
    dispatch(getReceiverBrieftStatusSearch(query));

    if (query.trim() !== "") {
      dispatch(updateSetSelectedStatus("All"));
    }

    dispatch(getReceiverBrieftStatusSearch(query, 1));
  };

  const filteredData = briefStatus?.data?.filter((item) => {
    return Object.values(item).some((value) => {
      if (typeof value === "string" || typeof value === "number") {
        return value.toString().toLowerCase().includes(searchQuery);
      }
      return false;
    });
  });

  const handlePageChange = (newPage) => {
    if (!loading) {
      setLoading(true);

      const status = selectedStatus || "All";

      if (searchQuery) {
        dispatch(getReceiverBrieftStatusSearch(searchQuery, newPage)).finally(
          () => {
            setLoading(false);
          }
        );
      } else {
        dispatch(getReceiverBrieftStatus(newPage, status)).finally(() => {
          setLoading(false);
        });
      }

      setVisibleCosts({});
    }
  };

  const handleStatus = (status) => {
    dispatch(updateSetSelectedStatus(status));
    setLoading(true);

    dispatch(getReceiverBrieftStatus(1, status)).finally(() => {
      setLoading(false);
    });
  };

  const displayedData = searchQuery
    ? searchTerm?.data
    : briefStatus?.data || "";
  const totalPages = searchQuery
    ? Math.ceil(searchCount / rowsPerPage)
    : Math.ceil(briefCount / rowsPerPage);

  const formatDate = (date) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  const renderPagination = () => {
    if (briefCount === 0) {
      return null;
    }

    const pageNumbers = [];
    const pagesToShow = 5;

    let startPage = currentPage - Math.floor(pagesToShow / 2);
    let endPage = currentPage + Math.floor(pagesToShow / 2);

    if (startPage < 1) {
      startPage = 1;
      endPage = Math.min(pagesToShow, totalPages);
    }

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, totalPages - pagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="pagination-brief-receiver">
        {currentPage > 1 && (
          <button
            className="prev-btn-brief-rec"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={loading}
          >
            &larr; Previous
          </button>
        )}

        {pageNumbers.map((number) => (
          <button
            key={number}
            className={`pagination-number-brief-rec ${
              currentPage === number ? "active" : ""
            }`}
            onClick={() => handlePageChange(number)}
            disabled={loading}
          >
            {number}
          </button>
        ))}

        {currentPage < totalPages && (
          <button
            className="next-btn-brief-rec"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={loading}
          >
            Next &rarr;
          </button>
        )}
      </div>
    );
  };

  const closeModal = () => {
    setIsModalOpen(false);
    window.location.reload();
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleContinue = () => {
    setShowModal(false);
    window.location.reload();
  };

  const handleTryAgain = () => {
    setShowModal(false);
    window.location.reload();
  };
  const handleActionClick = (brief) => {
    navigate("/receiverlayout/mirroview", {
      state: { briefId: brief.brief_id, brief: brief },
    });
  };

  const toggleDropdown = (briefId) => {
    setDropdownOpen((prev) => (prev === briefId ? null : briefId));
  };

  // const handleClickOutside = (event) => {
  //   let isOutside = true;

  //   Object.values(dropdownRef.current).forEach((ref) => {
  //     if (ref && ref.current && ref.current.contains(event.target)) {
  //       isOutside = false;
  //     }
  //   });

  //   if (isOutside) {
  //     setDropdownOpen(null);
  //   }
  // };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="brief-status-receiver">
      <div className="brief-counts">
        <h3>Brief Status</h3>
        <div
          className="brief-count-order"
          style={{ display: "flex", gap: "10px" }}
        >
          <button
            className={`count-button ${
              selectedStatus === "All" ? "active" : ""
            }`}
            onClick={() => handleStatus("All")}
          >
            All <span className="order-count">{counts.total}</span>
          </button>
          <button
            className={`count-button ${
              selectedStatus === "Approved" ? "active" : ""
            }`}
            onClick={() => handleStatus("Approved")}
            disabled={!!searchQuery}
            style={{
              opacity: searchQuery ? 0.5 : 1,
              cursor: searchQuery ? "not-allowed" : "pointer",
              pointerEvents: searchQuery ? "none" : "auto",
              backgroundColor: searchQuery ? "#f0f0f0" : "",
            }}
          >
            Approved <span className="order-count">{counts.pc_approved}</span>
          </button>
          <button
            className={`count-button ${
              selectedStatus === "Rejected" ? "active" : ""
            }`}
            onClick={() => handleStatus("Rejected")}
            disabled={!!searchQuery}
            style={{
              opacity: searchQuery ? 0.5 : 1,
              cursor: searchQuery ? "not-allowed" : "pointer",
              pointerEvents: searchQuery ? "none" : "auto",
              backgroundColor: searchQuery ? "#f0f0f0" : "",
            }}
          >
            Rejected{" "}
            <span className="order-count">{counts.pc_disapproved}</span>
          </button>
          <button
            className={`count-button ${
              selectedStatus === "Completed" ? "active" : ""
            }`}
            onClick={() => handleStatus("Completed")}
            disabled={!!searchQuery}
            style={{
              opacity: searchQuery ? 0.5 : 1,
              cursor: searchQuery ? "not-allowed" : "pointer",
              pointerEvents: searchQuery ? "none" : "auto",
              backgroundColor: searchQuery ? "#f0f0f0" : "",
            }}
          >
            Completed <span className="order-count">{counts.completed}</span>
          </button>
        </div>

        <div style={{ position: "relative", width: "300px" }}>
          <input
            type="text"
            style={{
              width: "100%",
              padding: "10px 40px 10px 10px",
              borderRadius: "24px",
              border: "1px solid #d3d3d3",
              outline: "none",
              marginBottom: "12px",
              alignItems: "flex-end",
            }}
            placeholder="Search by study name..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <span
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "gray",
            }}
          >
            <ReactSVG src={searchIcon} />
          </span>
        </div>
      </div>

      <div className="table-wrapper-brief-rec">
        <table className="table">
          <thead className="breif-tablehead-rec">
            <tr>
              {header.map((item, index) => (
                <th key={index}>{item}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayedData?.length > 0 ? (
              displayedData.map((item, index) => (
                <tr key={index}>
                  {/* <td>{item.study_type}</td> */}
                  <td
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      textAlign: "left",
                      maxWidth: "250px",
                      padding: "15px",
                      position: "relative",
                      width: "20%",
                    }}
                    title={item.study_name}
                  >
                    <Link
                      to="/receiverlayout/mirrorview"
                      state={{ briefId: item.brief_id, brief: item }}
                      title={item.study_name}
                      style={{ textDecoration: "underline", color: "blue" }}
                    >
                      {item.study_name}
                    </Link>
                  </td>
                  {/* <td>{item.product_type}</td> */}
                  {/* <td>{item.status}</td> */}
                  <td>{formatDate(item?.deadline)}</td>
                   <td>{formatDate(item?.created_at)}</td> 
                   <td>{item?.creator_name}</td> 
                  <td>
                    <button
                      style={{
                        width: "96px",
                        height: "36px",
                        padding: "4px 10px",
                        gap: "10px",
                        borderRadius: "8px",
                        border: "1px solid",
                        borderTopWidth: "1px",
                        borderRightWidth: "0px",
                        borderBottomWidth: "0px",
                        borderLeftWidth: "0px",
                        verticalAlign: "middle",
                        backgroundColor:
                          item.status === "approved" ||
                          item.status === "completed"
                            ? "#ABEFC6"
                            : item.status === "disapproved"
                            ? "#FECDCA"
                            : "white",
                        color:
                          item.status === "approved" ||
                          item.status === "completed"
                            ? "#067647"
                            : item.status === "disapproved"
                            ? "#B42318"
                            : "black",
                        borderColor:
                          item.status === "approved" ||
                          item.status === "completed"
                            ? "#ECFDF3"
                            : item.status === "disapproved"
                            ? "#FEF3F2"
                            : "transparent",
                        // cursor: "pointer",
                        opacity: "1",
                      }}
                    >
                      {item.status.charAt(0).toUpperCase() +
                        item.status.slice(1)}
                    </button>
                  </td>
                  <td>
                    {item.total_cost === null ? (
                      <span style={{ color: "black" }}></span>
                    ) : (
                      <>
                        {visibleCosts[item.brief_id] ? (
                          <span style={{ color: "black" }}>
                            {item.total_cost}
                          </span>
                        ) : (
                          <span style={{ color: "black" }}>******</span>
                        )}
                        <span
                          className="eye-icon"
                          style={{ color: "black", cursor: "pointer" }}
                          onClick={() => handleToggleTotalCost(item.brief_id)}
                        >
                          &#128065;
                        </span>
                      </>
                    )}
                  </td>
                  <td>
                    <button
                      style={{
                        width: "96px",
                        height: "36px",
                        padding: "4px 10px",
                        gap: "10px",
                        borderRadius: "8px",
                        border: "1px solid",
                        borderTopWidth: "1px",
                        borderRightWidth: "0px",
                        borderBottomWidth: "0px",
                        borderLeftWidth: "0px",
                        verticalAlign: "middle",
                        backgroundColor:
                          item.creator_status === "Budget Accepted"
                            ? "#ABEFC6"
                            : item.creator_status === "Budget Declined"
                            ? "#FF6B6B"
                            : item.creator_status === "rejected by pc"
                            ? "transparent"
                            : "white",

                        color:
                          item.creator_status === "Budget Accepted"
                            ? "#067647"
                            : item.creator_status === "Budget Declined"
                            ? "white"
                            : item.creator_status === "rejected by pc"
                            ? "transparent"
                            : "black",

                        borderColor:
                          item.creator_status === "Budget Accepted"
                            ? "#ECFDF3"
                            : item.creator_status === "Budget Declined"
                            ? "transparent"
                            : item.creator_status === "rejected by pc"
                            ? "transparent"
                            : "transparent",

                        opacity: "1",
                      }}
                    >
                      {item.creator_status === "rejected by pc"
                        ? "---"
                        : item.creator_status.charAt(0).toUpperCase() +
                          item.creator_status.slice(1)}
                    </button>
                  </td>

                  <td
                    style={{
                      pointerEvents: "auto",
                      opacity: item.filename ? 1 : 0.5,
                    }}
                  >
                    <span
                      style={{
                        cursor: "pointer",
                        color: "black",
                      }}
                      onClick={() => {
                        if (!item.filename) {
                          setFormData((prevData) => ({
                            ...prevData,
                            briefId: item.brief_id,
                          }));
                          setIsModalOpen(true);
                        }
                      }}
                    >
                      {item.filename ? (
                        <div
                          title={item.filename}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <span
                            style={{
                              cursor: "default",
                              marginRight: "10px",
                            }}
                            onClick={(e) => e.stopPropagation()}
                          ></span>
                          {item.creator_status === "Budget Accepted" ||
                          item.status === "approved" ? (
                            <ReactSVG
                              src={selectedFileIcon}
                              style={{ marginRight: "5px" }}
                            />
                          ) : null}

                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            {item.filename}
                          </span>

                          <div
                            ref={dropdownRef}
                            style={{ position: "relative", marginLeft: "10px" }}
                            onClick={(e) => e.stopPropagation()}
                            // onClick={(e) => {
                            //   e.preventDefault();
                            //   setIsOpen((prev) => !prev);
                            // }}
                          >
                            <ReactSVG
                              src={sideMenuIcon}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleDropdown(item.brief_id);
                              }}
                              style={{ cursor: "pointer" }}
                            />

                            {dropdownOpen === item.brief_id && (
                              <div
                                style={{
                                  position: "absolute",
                                  right: 0,
                                  top: "20px",
                                  background: "white",
                                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                                  borderRadius: "4px",
                                  zIndex: 10,
                                  width: "150px",
                                }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div
                                  style={{
                                    padding: "8px",
                                    cursor: "pointer",
                                    borderBottom: "1px solid #eee",
                                    display: "flex",
                                    gap: "10px",
                                    alignItems: "center",
                                  }}
                                >
                                  <a
                                    href={item.pc_file_path}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      textDecoration: "none",
                                      color: "black",
                                      display: "flex",
                                      gap: "10px",
                                      alignItems: "center",
                                    }}
                                    // onClick={() => {
                                    //   toggleDropdown(null);
                                    // }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleDropdown(null);
                                    }}
                                  >
                                    <ReactSVG src={viewIcon} />
                                    <span>View File</span>
                                  </a>
                                </div>

                                <div
                                  style={{
                                    padding: "8px",
                                    cursor: "pointer",
                                    borderBottom: "1px solid #eee",
                                    display: "flex",
                                    gap: "10px",
                                    alignItems: "center",
                                  }}
                                  // onClick={(e) => {
                                  //   e.stopPropagation();
                                  //   handleDownloadFile(item);
                                  // }}
                                >
                                  <a
                                    target="_blank"
                                    style={{
                                      textDecoration: "none",
                                      color: "black",
                                      display: "flex",
                                      gap: "10px",
                                      alignItems: "center",
                                    }}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      if (!item.pc_file_path) {
                                        alert("File path is invalid.");
                                        return;
                                      }
                                      fetch(item.pc_file_path)
                                        .then((response) => response.blob())
                                        .then((blob) => {
                                          const url =
                                            window.URL.createObjectURL(blob);
                                          const tempLink =
                                            document.createElement("a");
                                          tempLink.href = url;
                                          tempLink.download = item.pc_file_path
                                            .split("/")
                                            .pop();
                                          document.body.appendChild(tempLink);
                                          tempLink.click();
                                          document.body.removeChild(tempLink);
                                          window.URL.revokeObjectURL(url);
                                        })
                                        .catch((error) => {
                                          console.error(
                                            "Failed to download the file:",
                                            error
                                          );
                                          alert("Failed to download the file.");
                                        });
                                      toggleDropdown(null);
                                      e.stopPropagation();
                                    }}
                                  >
                                    <ReactSVG src={DownloadIcon} />
                                    Download File
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <ReactSVG src={addFile} />
                      )}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={header.length}>No briefs found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination-custom">
        {briefCount > 0 ? renderPagination() : <p>No records available</p>}
      </div>

      {isModalOpen && (
        <div className="modal-overlay-total-file">
          <div className="modal-content-total-file">
            <div className="modal-header-total-file">
              <h2>Attach File</h2>
              <button
                className="close-modal-btn-total-file"
                onClick={closeModal}
              >
                &times;
              </button>
            </div>
            <div className="layout-modal">
              <div className="file-upload-base">
                <div className="file-content">
                  <div
                    style={{ marginLeft: "95px", cursor: "pointer" }}
                    onClick={() => document.getElementById("fileInput").click()}
                  >
                    <ReactSVG src={uploadfile} />
                  </div>

                  <input
                    id="fileInput"
                    type="file"
                    name="file_path"
                    style={{ display: "none" }}
                    onChange={(e) => handleFileUpload(e, formData.briefId)}
                  />

                  <div
                    className="text-content"
                    style={{ display: "flex", alignItems: "center" }}
                    onClick={() => document.getElementById("fileInput").click()}
                  >
                    <h4 style={{ color: "blue", margin: 0 }}>
                      Click to upload
                    </h4>
                    <h1
                      style={{ color: "black", marginLeft: "10px", margin: 0 }}
                    >
                      or drag and drop
                    </h1>
                  </div>

                  <div className="pdf-text">PDF or TXT</div>

                  {formData.attachments?.name && (
                    <p style={{ marginTop: "10px" }}>
                      Selected file: {formData.attachments?.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-actions" style={{ marginTop: "37px" }}>
              <button className="cancel-buttons" onClick={closeModal}>
                Cancel
              </button>
              <button
                className={`attach-buttons ${
                  formData.attachments?.name ? "file-attached" : ""
                }`}
                onClick={handleAttachFile}
              >
                Attach File
              </button>
            </div>
          </div>
        </div>
      )}

      <Modal
        show={showModal}
        onClose={handleCloseModal}
        title={modalContent.title}
        message={modalContent.message}
        type={modalContent.type}
        onContinue={handleContinue}
        onTryAgain={handleTryAgain}
      />
    </div>
  );
}
export default BriefStatusReceiver;
