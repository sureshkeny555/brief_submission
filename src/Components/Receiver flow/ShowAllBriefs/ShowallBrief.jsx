import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getBriefStatus,
  getBriefStatusSearch,
  getSearchValue,
} from "../../../store/features/briefsData";
import { Link, useNavigate } from "react-router-dom";
import "./ShowallBries.scss";
import { ReactSVG } from "react-svg";
import FailedIcon from "../../assets/svg/failed.svg";
import CancelIcon from "../../assets/svg/cancel.svg";
import WarningIcon from "../../assets/svg/warning.svg";
import CheckIcon from "../../assets/svg/check.svg";
import searchIcon from "../../assets/svg/searchicon.svg";

const STATUS_ICONS = {
  Completed: CheckIcon,
  "In Progress": WarningIcon,
  "Not Done": CancelIcon,
};

function ShowallBrief() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchTerm = useSelector((state) => state?.briefs?.searchTerm);
  const searchCount = useSelector((state) => state?.briefs?.searchCount || 0);
  const allBrief = useSelector((state) => state?.briefs?.getAllBrief);
  const currentPage = useSelector((state) => state?.briefs?.allBriefPage || 1);
  const briefCount = useSelector((state) => state?.briefs?.briefsCount || 0);
  const rowsPerPage = 10;
  const totalRecords = searchQuery ? searchTerm?.total_count || 0 : briefCount;
  // const totalPages = Math.ceil(briefCount / rowsPerPage)
  const role = localStorage.getItem("role");

  useEffect(() => {
    setLoading(true);
    dispatch(getBriefStatus(currentPage)).finally(() => {
      setLoading(false);
    });
  }, [dispatch, currentPage]);

  const handleActionClick = (brief) => {
    navigate("/receiverlayout/approvalmodalshowall", {
      state: { briefId: brief.brief_id, brief: brief },
    });
  };

  // const handlePageChange = (page) => {
  //   if (page !== currentPage && page >= 1 && page <= totalPages) {
  //     dispatch(getBriefStatus(page));
  //   }
  // };
  const handlePageChange = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      if (searchQuery) {
        dispatch(getBriefStatusSearch(searchQuery, page));
      } else {
        dispatch(getBriefStatus(page));
      }
    }
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const endpoint = "all_briefs";
    dispatch(getBriefStatusSearch(query));
  };

  const filteredData = allBrief?.briefs?.filter((item) => {
    return Object.values(item).some((value) => {
      if (typeof value === "string" || typeof value === "number") {
        return value.toString().toLowerCase().includes(searchQuery);
      }
      return false;
    });
  });

  const displayedData = searchQuery ? searchTerm?.briefs : allBrief?.briefs;
  const totalPages = searchQuery
    ? Math.ceil(searchCount / rowsPerPage)
    : Math.ceil(briefCount / rowsPerPage);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 5;
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

  const renderStatusIcon = (status) => {
    const icon = STATUS_ICONS[status] || CancelIcon;
    return <ReactSVG src={icon} />;
  };

  const steps = [
    { name: "Concept", status: "Concept test" },
    { name: "Product", status: "Product test" },
    { name: "Pack", status: "Pack test" },
    { name: "Ad", status: "Advertisement test" },
    // { name: "Brand", status: "Brand track" },
  ];

  const isProgressBarVisible = (studyType) => {
    return steps.some((step) => step.status === studyType);
  };

  return (
    <div className="today-deadline">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <h3 style={{ margin: "0" }}>Non Approval Briefs</h3>
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

      <div className="table-wrapper-tdy-dl">
        <table className="tdy-dl-table">
          <thead className="tdy-dl-thead">
            <tr className="study-name-column">
              <th>NPD/EPD</th>
              <th>Study Name</th>
              <th>Creator</th>
              <th>Study Status</th>
              <th>Deadline</th>
              {/* <th>Duration</th> */}
              {role === "Project Coordinator" && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {displayedData?.length > 0 ? (
              displayedData.map((brief, index) => (
                <tr key={index}>
                  <td>{brief.NPD_EPD}</td>

                  <td
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      textAlign: "left",
                      maxWidth: "250px",
                      padding: "15px",
                    }}
                  >
                    <Link
                      to="/receiverlayout/mirrorview"
                      state={{ briefId: brief.brief_id, brief: brief }}
                      title={brief.study_name}
                      style={{
                        textDecoration: "underline",
                        color: "blue",
                        fontFamily: "Open Sans",
                      }}
                    >
                      {brief.study_name}
                    </Link>
                  </td>
                      <td>{brief.creator}</td>
                  <td>
                    {isProgressBarVisible(brief.study_type) ? (
                      <div className="status-indicators-showall">
                        {steps.map((step, stepIndex) => (
                          <div key={stepIndex} className="step-container">
                            <div className="circle-line-wrapper">
                              <div
                                className={`circle ${(
                                  brief.status_bar?.[step.status] || "Not Done"
                                ).replace(/\s+/g, "-")}`}
                              >
                                {renderStatusIcon(
                                  brief.status_bar?.[step.status] || "Not Done"
                                )}
                              </div>
                              {stepIndex < steps.length - 1 && (
                                <div
                                  className={`line ${(
                                    brief.status_bar?.[
                                      steps[stepIndex + 1].status
                                    ] || "Not Done"
                                  ).replace(/\s+/g, "-")}`}
                                ></div>
                              )}
                            </div>
                            <div className="step-name">{step.name}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      ""
                    )}
                  </td>

                  <td>{formatDate(brief.deadline)}</td>
                  {/* <td>{brief?.allocation_info?.duration_days}</td> */}
                  {role !== "Project Coordinator" ? (
                    ""
                  ) : (
                    <td>
                      <button
                        className="action-button-showall"
                        onClick={() => handleActionClick(brief)}
                      >
                        Approve/Disapprove
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No briefs found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination-tdy-dl">
        <button
          className="prev-btn-tdy-dl"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &larr;Previous
        </button>

        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            className={`pagination-number-tdy-dl ${
              page === currentPage ? "active" : ""
            }`}
            onClick={() => typeof page === "number" && handlePageChange(page)}
            disabled={page === "..."}
          >
            {page}
          </button>
        ))}

        <button
          className="next-btn-tdy-dl"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next&rarr;
        </button>
      </div>
    </div>
  );
}

export default ShowallBrief;
