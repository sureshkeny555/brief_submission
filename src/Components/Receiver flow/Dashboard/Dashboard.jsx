import React, { useEffect, useState } from "react";
import "./Dashboard.scss";
import { ReactSVG } from "react-svg";
import metricifileIcon from "../../assets/svg/metricfileIcon.svg";
import metricpendingIcon from "../../assets/svg/metricpending.svg";
import metricprogressIcon from "../../assets/svg/metricprogress.svg";
import metricistudiesIcon from "../../assets/svg/metricstudies.svg";
import exportarrowIcon from "../../assets/svg/exportuparrow.svg";
import Barchart from "../../common/Barchart/Barchart";
import Donutchart from "../../common/Piechart/Piechart";
import { useDispatch, useSelector } from "react-redux";
import {
  dashboardBarchartValues,
  dashboardBarchartValuesSearch,
  dashboardCountValues,
  dashboardDonutchartSearchValues,
  dashboardDonutchartValues,
  dashboardTableNext,
  dashboardTablePast,
} from "../../../store/features/briefsData";
import { useSearchParams } from "react-router-dom";
import { values } from "lodash";
// import BarchartHorizontal from "../../common/Barchart/Horizontalchart";
import { userSignUp } from "../../../store/features/authorization";
import Select from "react-select/base";

function Dashboard() {
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("progress");
  const [activeTabDonut, setActiveTabDonut] = useState("study");
  // const [selectedStudy, setSelectedStudy] = useState("");
  const countvalues = useSelector(
    (state) => state?.briefs?.dashboardCountValues
  );
  const countvaluesProgress = useSelector(
    (state) => state?.briefs?.dashboardBarchartValues
  );
  const barChartDropDown = countvaluesProgress
    ? countvaluesProgress?.response?.study_name
    : [];

  const countvaluesProgressSearch = useSelector(
    (state) => state?.briefs?.dashboardBarchartValuesSearch
  );

  const countvaluesDonut = useSelector(
    (state) => state?.briefs?.dashboardDonutchartValues?.stats
  );
  const countvaluesDonutDropdown = useSelector(
    (state) => state?.briefs?.dashboardDonutchartValues?.department
  );

  const donutValues = countvaluesDonut
    ? Object.keys(countvaluesDonut).filter((key) => key !== "all_department")
    : [];

  const donutData = donutValues.map((department) => ({
    name: department,
    budget:
      activeTabDonut === "study"
        ? countvaluesDonut[department]?.total_count || 0
        : countvaluesDonut[department]?.total_cost || 0,
    completedCountPercentage:
      activeTabDonut === "study"
        ? countvaluesDonut[department]?.count_percentage_from_overall || 0
        : countvaluesDonut[department]?.budget_percentage_from_overall || 0,
  }));

  const donutSelect = countvaluesDonut ? Object.keys(countvaluesDonut) : [];
  const studyname = countvaluesProgress?.response?.progress_overview;
  const study = studyname ? Object.keys(studyname) : [];

  const pastValues = useSelector(
    (state) => state?.briefs.dashboardTablePast?.briefs
  );
  const pastValueTable = pastValues ? pastValues : [];

  const nextValues = useSelector(
    (state) => state?.briefs.dashboardTableNext?.briefs
  );
  const nextValueTable = nextValues ? nextValues : [];

  const [selectedStudy, setSelectedStudy] = useState(study[0] || "");
  const [selectedDept, setSelectedDept] = useState(study[0] || "");
  useEffect(() => {
    dispatch(dashboardCountValues());
  }, []);
  useEffect(() => {
    dispatch(dashboardBarchartValues());
  }, []);
  useEffect(() => {
    dispatch(dashboardTablePast());
  }, []);
  useEffect(() => {
    dispatch(dashboardTableNext());
    dispatch(dashboardDonutchartValues());
  }, []);

  const handleStudyChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedStudy(selectedValue);
    dispatch(dashboardBarchartValuesSearch(selectedValue));
  };
  const handleDeptChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedDept(selectedValue);
    dispatch(dashboardDonutchartSearchValues(selectedValue));
  };
  const handleStudyOverviewSearch = () => {
    dispatch(dashboardDonutchartValues());
  };

  useEffect(() => {
    if (barChartDropDown && barChartDropDown.length > 0) {
      setSelectedStudy(barChartDropDown[0]);
    }
  }, []);
  const resetStudyTabState = () => {
    setSelectedDept("");
    console.log({ selectedDept });
  };

  const resetBudgetTabState = () => {
    setSelectedDept("");
  };

  const handleMenuOpen = () => {
    console.log("Dropdown menu opened");
  };

  const barOptions = barChartDropDown?.map((item) => ({
    value: item,
    label: item && item.length > 20 ? `${item.substring(0, 15)}..` : item,
  }));

  return (
    <div className="dashboard-body">
      <div style={{ width: "100%" }}>
        <h3 style={{ fontWeight: "600", fontSize: "24px" }}>Dashboard</h3>
        <h4 style={{ fontWeight: "300", fontSize: "14px" }}>
          Here's your analytic details
        </h4>
        <br></br>
        <div className="card-header">
          <div className="card-1">
            <div className="card-value">
              <div className="card-number">
                {countvalues?.data?.total_briefs}
              </div>
              <div className="card-text">Total Study</div>
            </div>
            <div className="card-icon">
              <ReactSVG src={metricifileIcon} />
            </div>
          </div>
          <div className="card-2">
            <div className="card-value">
              <div className="card-number">
                {countvalues?.data?.completed_briefs}
              </div>
              <div className="card-text">Studies Completed</div>
            </div>
            <div className="card-icon">
              <ReactSVG src={metricistudiesIcon} />
            </div>
          </div>
          <div className="card-3">
            <div className="card-value">
              <div className="card-number">
                {countvalues?.data?.inprogress_briefs}
              </div>
              <div className="card-text">Studies In Progress</div>
            </div>
            <div className="card-icon">
              <ReactSVG src={metricprogressIcon} />
            </div>
          </div>

          <div className="card-4">
            <div className="card-value">
              <div className="card-number">
                {countvalues?.data?.pending_briefs}
              </div>
              <div className="card-text">Pending Studies</div>
            </div>
            <div className="card-icon">
              <ReactSVG src={metricpendingIcon} />
            </div>
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-card barchart-card">
            <div className="chart-header">
              {/* <div className="chart-buttons"> */}
              <button
                className={`button-chart ${
                  activeTab === "progress" ? "active" : ""
                }`}
                onClick={() => setActiveTab("progress")}
              >
                Progress Overview
              </button>
              {/* <button
                className={`button-chart ${
                  activeTab === "employee" ? "active" : ""
                // }`}
                onClick={() => setActiveTab("employee")}
              >
                Employee Overview
              </button> */}
              {/* </div> */}

              <select
                className="chart-select-bar"
                onChange={handleStudyChange}
                value={selectedStudy}
                title={selectedStudy}
              >
                <option disabled value="">
                  Select studyname
                </option>
                {barChartDropDown?.map((item) => (
                  <option key={item} value={item} title={item}>
                    {item && item.length > 20
                      ? `${item.substring(0, 15)}..`
                      : item}{" "}
                  </option>
                ))}
              </select>

              {/* <Select
              className="chart-select-bar"
              value={barOptions.find((opt) => opt.value === selectedStudy)}
              onChange={(selectedOption) =>
                setSelectedStudy(selectedOption?.value)
              }
              options={barOptions} // Pass the mapped options
              title={selectedStudy}
              onMenuOpen={handleMenuOpen} // Pass the onMenuOpen function
            /> */}
            </div>
            <Barchart
              countvaluesProgress={countvaluesProgress}
              selectedStudy={selectedStudy}
            />
            {/* {activeTab === "progress" ? (
           
          ) : (
            <BarchartHorizontal />
          )} */}
          </div>

          <div className="chart-card donutchart-card">
            <div className="chart-header">
              <div className="chart-buttons-donut">
                <button
                  className={`button-chart-donut ${
                    activeTabDonut === "study" ? "active" : ""
                  }`}
                  onClick={() => {
                    resetBudgetTabState();
                    setActiveTabDonut("study");
                    handleStudyOverviewSearch();
                  }}
                >
                  Study Overview
                </button>
                <button
                  className={`button-chart-donut ${
                    activeTabDonut === "budget" ? "active" : ""
                  }`}
                  onClick={() => {
                    resetStudyTabState();
                    setActiveTabDonut("budget");
                  }}
                >
                  Budget Overview
                </button>
              </div>

              {activeTabDonut === "study" && (
                <select
                  className="chart-select-donut"
                  onChange={handleDeptChange}
                  value={selectedDept}
                >
                  <option disabled selected value="">
                    Select Dept
                  </option>
                  {countvaluesDonutDropdown?.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              )}
            </div>
            <Donutchart
              donutData={donutData}
              activeTabDonut={activeTabDonut}
              selectedDept={selectedDept}
            />
          </div>
        </div>

        <div className="tables-container">
          <div className="table-card">
            <div className="table-header">
              <h4>Upcoming Deadlines</h4>
              <button className="export-btn">
                <ReactSVG src={exportarrowIcon} /> Export
              </button>
            </div>
            <div className="table-content">
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Study Name</th>
                      <th>Days Remaining</th>
                      <th>Study Allocated to</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nextValueTable.length > 0 ? (
                       nextValueTable.map((study, index) => (
                        <tr key={index}>
                          <td
                            style={{
                              maxWidth: "100px",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {study.study_name}
                          </td>
                          <td>{study.days_info.remaining_days}</td>
                          <td>{study.allocated_users.map((item) => item)}</td>
                        </tr>
                      ))
                    )  : (
                      <tr>
                        <td
                          colSpan="3"
                          style={{ textAlign: "center", padding: "10px" }}
                        >
                          No data found
                        </td>
                      </tr>
                    )}
                   
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="table-card">
            <div className="table-header">
              <h4>Delayed Studies</h4>
              <button className="export-btn">
                <ReactSVG src={exportarrowIcon} /> Export
              </button>
            </div>
            <div className="table-content">
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Study Name</th>
                      <th>Days Delayed</th>
                      <th>Study Allocated to</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pastValueTable.length > 0 ? (
                      pastValueTable.map((study, index) => (
                        <tr key={index}>
                          <td
                            style={{
                              maxWidth: "100px",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {study.study_name}
                          </td>
                          <td>{study.days_info?.delayed_days || "N/A"}</td>
                          <td>{study.allocated_to || "N/A"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="3"
                          style={{ textAlign: "center", padding: "10px" }}
                        >
                          No data found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div> 
          </div>
         </div>
      </div>
    </div>
  );
}

export default Dashboard;
