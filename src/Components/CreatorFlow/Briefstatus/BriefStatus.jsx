import React, { useEffect, useState } from "react";
import "./BriefStatus.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  getCreatorBrieftStatus,
  acceptBriefTrackCreator,
  rejectBriefTrackCreator,
  getSearchValue,
  getCreatorBrieftStatusSearch,
  // viewFiles,
} from "../../../store/features/briefsData";
import { ReactSVG } from "react-svg";
import DownloadIcon from "../../assets/svg/downloadIcon.svg";
import viewIcon from "../../assets/svg/view.svg";
import searchIcon from "../../assets/svg/searchicon.svg";
import Attchments from "../../assets/svg/totalattachment.svg";
import { Link, useNavigate } from "react-router-dom";

const BriefStatus = ({ allBrief }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBrief, setSelectedBrief] = useState(null);
  const [formData, setFormData] = useState({
    cpiTotal: "",
    travelCost: "",
    miscellaneousTotal: "",
    totalCost: "",
    research_design_attachment: null,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const briefStatus = useSelector((state) => state?.briefs?.creatorBriefStatus);
  const image_path = briefStatus?.data?.map((item) => item.budget_file_path);
  const briefCount = useSelector((state) => state?.briefs?.briefsCount || 0);
  const currentPage = useSelector((state) => state?.briefs?.currentPage || 1);
  const rowsPerPage = 10;
  const images = useSelector((state) => state?.briefs?.images);
  const searchTerm = useSelector((state) => state?.briefs?.searchTerm);

  const [visibleCosts, setVisibleCosts] = useState({});
  const [filter, setFilter] = useState("All");
  const searchCount = useSelector((state) => state?.briefs?.searchCount);
  // const [totalPages, setTotalPages] = useState(
  //   Math.ceil(briefCount / rowsPerPage)
  // );
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(getCreatorBrieftStatus(currentPage));
    // setTotalPages(Math.ceil(briefCount / rowsPerPage));
  }, [dispatch, currentPage, briefCount]);

  // const handlePageChange = (page) => {
  //   if (page >= 1 && page <= totalPages) {
  //     dispatch(getCreatorBrieftStatus(page));
  //   }
  // };

  const handlePageChange = (page) => {
    console.log({page})
    if (searchQuery) {
      dispatch(getCreatorBrieftStatusSearch(searchQuery, page));
    } else {
      dispatch(getCreatorBrieftStatus(page)).finally(() => {
        setLoading(false);
      });
    }
  };

  const openModel = (brief) => {
    setSelectedBrief(brief);
    setFormData({
      cpiTotal: brief.cpi_total || "",
      travelCost: brief.travel_cost || "",
      miscellaneousTotal: brief.miscellaneous_cost || "",
      totalCost: brief.total_cost || "",
      research_design_attachment: brief.research_design_attachment || null,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    dispatch();
  };
  const handleToggleTotalCost = (id) => {
    setVisibleCosts((prevVisibleCosts) => ({
      ...prevVisibleCosts,
      [id]: !prevVisibleCosts[id],
    }));
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  const onAccept = (e) => {
    e.preventDefault();
    if (selectedBrief) {
      const briefId = selectedBrief.brief_id;
      if (briefId) {
        dispatch(acceptBriefTrackCreator(briefId)).then(() => {
          dispatch(getCreatorBrieftStatus(currentPage));
          setIsModalOpen(false);
        });
      }
    }
  };

  const onReject = (e) => {
    e.preventDefault();
    if (selectedBrief) {
      const briefId = selectedBrief.brief_id;
      if (briefId) {
        dispatch(rejectBriefTrackCreator(briefId)).then(() => {
          dispatch(getCreatorBrieftStatus(currentPage));
          setIsModalOpen(false);
        });
      }
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(e.target.value);
    const endpoint = "brief_status";
    dispatch(getCreatorBrieftStatusSearch(query));
  };

  const filteredData = briefStatus?.data?.filter((item) => {
    return Object.values(item).some((value) => {
      if (typeof value === "string" || typeof value === "number") {
        return value.toString().toLowerCase().includes(searchQuery);
      }
      return false;
    });
  });

  const displayedData = searchQuery ? searchTerm?.data : briefStatus?.data;
  console.log({ displayedData });
  const totalPages = searchQuery
    ? Math.ceil(searchCount / rowsPerPage)
    : Math.ceil(briefCount / rowsPerPage);

  const header = ["Study Name", "Deadline", "Total Cost", "Action"];

  const getPageNumbersToday = () => {
    const pageNumbers = [];
    const maxPageButtons = 2;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (endPage - startPage + 1 < maxPageButtons) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxPageButtons + 1);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (startPage > 1) {
      pageNumbers.unshift("...");
      pageNumbers.unshift(1);
    }
    if (endPage < totalPages) {
      pageNumbers.push("...");
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const getButtonStyles = (status) => {
    let backgroundColor = "";
    let color = "white";
    let cursor = "pointer";
    let className = "";
    let fontFamily = "Open Sans";
    let fontWeight = "600";

    switch (status) {
      case "Approved":
        backgroundColor = "#067647";
        color = "white";
        cursor = "not-allowed";
        fontFamily = "Open Sans";
        fontWeight = "600";
        break;
      case "Disapproved":
        backgroundColor = "#D92D20";
        color = "white";
        cursor = "not-allowed";
        fontFamily = "Open Sans";
        fontWeight = "600";
        break;
      case "Pending":
        backgroundColor = "#F2F4F7";
        color = "black";
        cursor = "not-allowed";
        fontFamily = "Open Sans";
        fontWeight = "600";
        break;
      case "View Budget":
        backgroundColor = "#F2F4F7";
        color = "black";
        cursor = "pointer";
        fontFamily = "Open Sans";
        fontWeight = "600";
        return {
          backgroundColor,
          color,
          cursor,
          padding,
        };
      default:
        backgroundColor = "#F2F4F7";
        color = "black";
        cursor = "pointer";
        break;
    }
    return {
      backgroundColor,
      color,
      padding: "4px 10px 4px 10px",
      borderRadius: "10px",
      fontFamily: "Open Sans",
      fontWeight,
      cursor,
      width: "120px",
      height: "36px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      border:
        status === "View Budget" ? "1px solid  #98A2B3" : "1px solid  #98A2B3",
    };
  };

  return (
    <div className="brief-status">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <h3 style={{ margin: "0" }}>Brief Status</h3>
        <div style={{ position: "relative", width: "300px" }}>
          <input
            type="text"
            style={{
              width: "100%",
              padding: "10px 40px 10px 10px",
              borderRadius: "16px",
              border: "1px solid #d3d3d3",
              outline: "none",
              marginBottom: "12px",
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
      <div className="table-wrapper-brief-cre">
        <table className="table">
          <thead className="breif-tablehead-cre">
            <tr>
              {header.map((item, index) => (
                <th
                  key={index}
                  className={item === "Study Name" ? "study-name-header" : ""}
                >
                  {item === "Action" ? (
                    <div className="action-filter-header">{item}</div>
                  ) : (
                    item
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayedData?.map((item, index) => (
              <tr key={index}>
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
                    to="/layout/mirrorview"
                    state={{ briefId: item.brief_id, brief: item }}
                    title={item.study_name}
                    style={{ textDecoration: "underline", color: "blue" }}
                  >
                    {item.study_name}
                  </Link>
                </td>
                <td>{formatDate(item.deadline)}</td>
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
                    className="view-btn"
                    onClick={() => openModel(item)}
                    disabled={
                      item.status === "Pending" ||
                      item.status === "Approved" ||
                      item.status === "Disapproved"
                    }
                    style={getButtonStyles(item.status)}
                  >
                    {item.status === "Approved"
                      ? "Approved"
                      : item.status === "Disapproved"
                      ? "Rejected"
                      : item.status === "Pending"
                      ? "Pending"
                      : "View Budget"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {briefCount > 0 && (
        <div className="pagination-container">
          <button
            className="prev-btn-tdy-cre"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &larr; Previous
          </button>

          {getPageNumbersToday().map((page, index) => (
            <button
              key={index}
              className={`pagination-number-tdy-cre ${
                page === currentPage ? "active" : ""
              }`}
              onClick={() => typeof page === "number" && handlePageChange(page)}
              disabled={page === "..."}
            >
              {page}
            </button>
          ))}

          <button
            className="next-btn-tdy-cre"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next &rarr;
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay-total">
          <div className="modal-content-total">
            <div className="modal-header-total">
              <h2>Accept or Reject Budget</h2>
              <button
                className="close-modal-btn-total-brief"
                onClick={closeModal}
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Cpi total</label>
                  <input
                    type="text"
                    name="cpiTotal"
                    value={formData.cpiTotal}
                    onChange={handleChange}
                    placeholder="Amount"
                    readOnly
                    style={{ width: "100%" }}
                  />
                </div>
                <div className="form-group">
                  <label>Travel Cost</label>
                  <input
                    type="text"
                    name="travelCost"
                    value={formData.travelCost}
                    onChange={handleChange}
                    placeholder="Amount"
                    readOnly
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Miscellaneous total</label>
                  <input
                    type="text"
                    name="miscellaneousTotal"
                    value={formData.miscellaneousTotal}
                    onChange={handleChange}
                    placeholder="Amount"
                    readOnly
                    style={{ width: "100%" }}
                  />
                </div>
                <div className="form-group">
                  <label>Total Cost</label>
                  <input
                    type="text"
                    name="totalCost"
                    value={formData.totalCost}
                    onChange={handleChange}
                    placeholder="Amount"
                    readOnly
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
              <div className="form-group-brief-modal-file">
                <label>Research Design File</label>
                <div className="file-actions-container">
                  <div className="file-details">
                    <ReactSVG className="icon-attachments" src={Attchments} />
                    <a
                      href={selectedBrief?.budget_file_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="file-link"
                    >
                      {formData.research_design_attachment.split("/").pop()}
                    </a>
                  </div>

                  <div className="file-actions">
                    <a
                      href={selectedBrief?.budget_file_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="icon-button"
                    >
                      <ReactSVG className="icon-view" src={viewIcon} />
                    </a>
                    <a
                      href={selectedBrief?.budget_file_path}
                      target="_blank"
                      className="icon-button"
                      onClick={(e) => {
                        e.preventDefault();
                        if (!selectedBrief?.budget_file_path) {
                          alert("File path is invalid.");
                          return;
                        }
                        fetch(selectedBrief.budget_file_path)
                          .then((response) => response.blob())
                          .then((blob) => {
                            const url = window.URL.createObjectURL(blob);
                            const tempLink = document.createElement("a");
                            tempLink.href = url;
                            tempLink.download = selectedBrief?.budget_file_path
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
                      }}
                    >
                      <ReactSVG className="icon-down" src={DownloadIcon} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-actions" style={{ padding: "15px 0px" }}>
              <button onClick={onReject} className="reject-buttons">
                Reject
              </button>
              <button onClick={onAccept} className="accept-buttons">
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BriefStatus;
