import React, { useCallback, useEffect, useState } from "react";
import "./TodayDeadline.scss";
import ProgressTracker from "../../common/StepIndicator/Step";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getSearchValue,
  getTodayBriefStatus,
  getTodayBriefStatusSearch,
} from "../../../store/features/briefsData";
import { Paginator } from "primereact/paginator";
import CancelIcon from "../../assets/svg/cancel.svg";
import WarningIcon from "../../assets/svg/warning.svg";
import CheckIcon from "../../assets/svg/check.svg";
import { ReactSVG } from "react-svg";
import searchIcon from "../../assets/svg/searchicon.svg";

const STATUS_ICONS = {
  Completed: CheckIcon,
  "In Progress": WarningIcon,
  "Not Done": CancelIcon,
};

function TodayDeadline() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const todayBrief = useSelector((state) => state?.briefs?.todayBriefStatus);
  const [loading, setLoading] = useState(true);
  const currentPage = useSelector(
    (state) => state?.briefs?.todayBriefPage || 1
  );
  const briefCount = useSelector((state) => state?.briefs?.briefsCount || 0);
  const searchTerm = useSelector((state) => state?.briefs?.searchTerm);
  const searchCount = useSelector((state) => state?.briefs?.searchCount || 0);
  const rowsPerPage = 10;
  // const totalPages = Math.ceil(briefCount / rowsPerPage);
  const role = localStorage.getItem("role");

  const formatDate = (date) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  const displayedData = searchQuery ? searchTerm?.briefs : todayBrief?.briefs || "";
  const totalPages = searchQuery
    ? Math.ceil(searchCount / rowsPerPage)
    : Math.ceil(briefCount / rowsPerPage);

  const handleSearchChange = (e) => {
    const search = e.target.value
    setSearchQuery(e.target.value);
    const endpoint = "todays_deadlines";
    dispatch(getTodayBriefStatusSearch(search));
  };

  useEffect(() => {
    dispatch(getTodayBriefStatus(currentPage));
    setLoading(false);
  }, [dispatch, currentPage, totalPages]);

  // const handlePageChangeToday = (event) => {
  //   const newPage = event.page + 1;
  //   setLoading(true)
  //   dispatch(getTodayBriefStatus(newPage))
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // };
  
  const handlePageChangeToday = (page) => {
    if (page >= 1 && page <= totalPages) {
      if (searchQuery) {
        dispatch(getTodayBriefStatusSearch(searchQuery, page));
      } else {
        dispatch(getTodayBriefStatus(page));
      }
    }
  };

  const getTodayGMTDate = () => {
    const todayGMT = new Date().toISOString().split("T")[0];
    return todayGMT;
  };

  // const todayGMTDate = getTodayGMTDate();

  const briefsForToday = todayBrief?.briefs?.filter((brief) => {
    const briefDeadlineDate = new Date(brief.deadline)
      .toISOString()
      .split("T")[0];
    return briefDeadlineDate;
  });

  const filteredData = briefsForToday?.filter((item) => {
    return Object.values(item).some((value) => {
      if (typeof value === "string" || typeof value === "number") {
        return value.toString().toLowerCase().includes(searchQuery);
      }
      return false;
    });
  });

  const handleActionClick = (brief) => {
    navigate("/receiverlayout/approvalmodal", {
      state: { briefId: brief.brief_id, brief: brief },
    });
  };

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

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }

  const isVissibleProgressBar = (studyType) => {
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
        <div
          style={{
            position: "relative",
            width: "300px",
          }}
        >
          <input
            type="text"
            style={{
              width: "100%",
              padding: "10px 40px 10px 10px",
              borderRadius: "16px",
              border: "1px solid #d3d3d3",
              outline: "none",
              // marginBottom: "12px",
            }}
            placeholder="Search by study name..."
            onChange={handleSearchChange}
            value={searchQuery}
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
            <tr>
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
                    title={brief.study_name}
                  >
                    <Link
                      to="/receiverlayout/mirrorview"
                      state={{ briefId: brief.brief_id, brief: brief }}
                      title={brief.study_name}
                      style={{ textDecoration: "underline", color: "blue" }}
                    >
                      {brief.study_name}
                    </Link>
                  </td>
                  <td>{brief.creator}</td>
                  <td>
                    {isVissibleProgressBar(brief.study_type) ? (
                      <div className="status-indicators-showall">
                        {steps.map((step, stepIndex) => (
                          <div key={stepIndex} className="step-container">
                            <div className="circle-line-wrapper">
                              <div
                                className={`circle ${
                                  brief.status_bar[step.status]?.replace(
                                    /\s+/g,
                                    "-"
                                  ) || ""
                                }`}
                              >
                                {renderStatusIcon(
                                  brief.status_bar[step.status]
                                )}
                              </div>
                              {stepIndex < steps.length - 1 && (
                                <div
                                  className={`line ${
                                    brief.status_bar[
                                      steps[stepIndex + 1].status
                                    ]?.replace(/\s+/g, "-") || ""
                                  }`}
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
          onClick={() => handlePageChangeToday(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &larr;Previous
        </button>

        {getPageNumbersToday().map((page, index) => (
          <button
            key={index}
            className={`pagination-number-tdy-dl ${
              page === currentPage ? "active" : ""
            }`}
            onClick={() =>
              typeof page === "number" && handlePageChangeToday(page)
            }
            disabled={page === "..."}
          >
            {page}
          </button>
        ))}

        <button
          className="next-btn-tdy-dl"
          onClick={() => handlePageChangeToday(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next&rarr;
        </button>
      </div>
    </div>
  );
}

export default TodayDeadline;
