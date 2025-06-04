import React, { useEffect, useState } from "react";
import "./StudyTracker.scss";
import { ReactSVG } from "react-svg";
import deleteIcontracker from "../../assets/svg/deleteIcontracker.svg";
import AddIconTracker from "../../assets/svg/addIcontracker.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  studySubmit,
  studySubmittedActivity,
  studyTrackerDropDown,
  updateResetMessage,
  UpdateStudySubmittedActivity,
} from "../../../store/features/briefsData";
// import data from "./data.json";
import Modal from "../../common/Modal/Modal";

function StudyTracker() {
  const [rows, setRows] = useState([
    { id: 1, studyName: "", task: "", status: "", remarks: "" },
  ]);
  const [selectedDate, setSelectedDate] = useState("");
  const dispatch = useDispatch();
  const dropDown = useSelector((state) => state?.briefs?.studyDropdown);
  const submittedData = useSelector(
    (state) => state?.briefs?.studySubmittedActivity?.activities
  );

  const successMessage = useSelector((state) => state?.briefs?.successMessage);
  const errorMessage = useSelector((state) => state?.briefs?.errorMessage);

  console.log({ submittedData });
  const newtask = dropDown.task_status;
  const userId = localStorage.getItem("userId");

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    type: "",
  });

  const [activeTab, setActiveTab] = useState("study");

  const [selectAll, setSelectAll] = useState(false);
  const [submittedDatas, setSubmittedDatas] = useState([]);
  const [selectedStudyId, setSelectedStudyId] = useState(null);

  useEffect(() => {
    dispatch(studySubmittedActivity());
  }, []);

  useEffect(() => {
    dispatch(studyTrackerDropDown());
  }, []);

  useEffect(() => {
    dispatch(updateResetMessage());
  }, [dispatch]);

  const addRow = () => {
    const newRow = {
      id: rows.length + 1,
      studyName: "",
      task: "",
      status: "",
      remarks: "",
      // checked: false,
    };
    setRows([...rows, newRow]);
  };

  const deleteRow = (id) => {
    const updatedRows = rows.filter((row) => row.id !== id);
    setRows(updatedRows);
  };

  const handleSelectAll = () => {
    const newState = !selectAll;
    setSelectAll(newState);
    setRows(rows.map((row) => ({ ...row, checked: newState })));
  };

  const handleChange = (id, name, value) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id
          ? {
              ...row,
              [name]: value,
              ...(name === "studyName" && { study_id: value.split("/")[0] }), 
            }
          : row
      )
    );
  };
  

  const handleRowCheckboxChange = (id) => {
    setRows((prevRows) => {
      const updatedRows = prevRows.map((row) =>
        row.id === id ? { ...row, checked: !row.checked } : row
      );

      const allChecked = updatedRows.every((row) => row.checked);
      setSelectAll(allChecked);
      return updatedRows;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  
    if (!selectedDate) {
      setModalContent({
        title: "Validation Error",
        message: "Please select a date before submitting.",
        type: "failure",
      });
      setShowModal(true);
      return;
    }
  
    const selectedRows = rows.filter((row) => row.checked);
  
    if (selectedRows.length === 0) {
      alert("Select at least one row before submitting!");
      return;
    }
  
    const updatedRows = selectedRows.map((row) => ({
      ...row,
      action_date: selectedDate,
      study_id: row.study_id, 
    }));
  
    setSubmittedDatas((prevData) => {
      const updatedData = [...prevData, ...updatedRows];
      console.log("Updated submittedDatas before dispatch:", updatedData);
      return updatedData;
    });
  
    setRows([
      {
        id: 1,
        studyName: "",
        task: "",
        status: "",
        remarks: "",
        checked: false,
      },
    ]);
  
    setSelectAll(false);
  };
  
  useEffect(() => {
    if (submittedDatas.length > 0) {
      console.log("Dispatching data:", submittedDatas);
      dispatch(studySubmit(submittedDatas, userId));

      setSubmittedDatas([]);
    }
  }, [submittedDatas]);

  useEffect(() => {
    if (successMessage) {
      setModalContent({
        title: "Success",
        message: "Your study track has been created successfully!",
        type: "success",
      });
      setShowModal(true);
      // setFormSubmitted(false);
      dispatch(updateResetMessage());
    } else if (errorMessage) {
      setModalContent({
        title: "Failed",
        message: errorMessage || "Failed create study track",
        type: "failure",
      });
      setShowModal(true);
      dispatch(updateResetMessage());
    }
  }, [successMessage, errorMessage, dispatch]);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleTryAgain = () => {
    setShowModal(false);
  };
  const handleContinue = () => {
    setShowModal(false);
    window.location.reload();
  };

  return (
    <div className="tracker-body">
      <div className="tracker-content">
        <div className="tracker-top">
          <div className="tracker-header">
            <h3 className="tracker-name">Study Tracker</h3>
          </div>
          <div className="tracker-button">
            <div className="track-buttons">
              <button
                className={`button-track ${
                  activeTab === "study" ? "active" : ""
                }`}
                onClick={() => setActiveTab("study")}
              >
                Select Study
              </button>
              <button
                className={`button-track ${
                  activeTab === "submitted" ? "active" : ""
                }`}
                onClick={() => setActiveTab("submitted")}
              >
                Submitted Activity
              </button>
            </div>
            {activeTab === "study" && (
              <div>
                <input
                  className="tracker-date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                />
              </div>
            )}
          </div>
        </div>

        <div className="tracker-table">
          {activeTab === "study" ? (
            <form onSubmit={handleSubmit}>
              <table>
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th>SI. No</th>
                    <th>Study Name</th>
                    <th>Task</th>
                    <th>Status</th>
                    <th>Remarks</th>
                    <th>Action</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={row.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={row.checked}
                          onChange={() => handleRowCheckboxChange(row.id)}
                          required
                        />
                      </td>
                      <td>{index + 1}</td>
                      <td>
                        <select
                          value={row.studyName}
                          onChange={(e) => {
                            const selectedValue = e.target.value;
                            const extractedId = selectedValue.split("/")[0];
                            setSelectedStudyId(extractedId);
                            handleChange(row.id, "studyName", selectedValue);
                          }}
                          required
                        >
                          <option value="">Select Study Name</option>
                          {dropDown?.study_name?.map((task) => (
                            <option key={task} value={task}>
                              {task}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td>
                        <select
                          value={row.task}
                          onChange={(e) =>
                            handleChange(row.id, "task", e.target.value)
                          }
                          required
                        >
                          <option value="">Select Task</option>
                          {dropDown?.tasks?.map((task, index) => (
                            <option key={index} value={task}>
                              {task}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select
                          value={row.status}
                          onChange={(e) =>
                            handleChange(row.id, "status", e.target.value)
                          }
                          required
                        >
                          <option value="">Select Status</option>
                          {dropDown?.statuses?.map((status, index) => (
                            <option key={index} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          placeholder="Enter remarks"
                          value={row.remarks}
                          onChange={(e) =>
                            handleChange(row.id, "remarks", e.target.value.replace(/\s+/g,''))
                          }
                        />
                      </td>
                      <td>
                        <ReactSVG
                          src={deleteIcontracker}
                          onClick={() => rows.length > 1 && deleteRow(row.id)} 
                          style={{
                            cursor: rows.length > 1 ? "pointer" : "not-allowed", 
                            opacity: rows.length > 1 ? 1 : 0.5, 
                          }}
                        />
                      </td>
                      <td>
                        {index === rows.length - 1 && (
                          <ReactSVG
                            src={AddIconTracker}
                            onClick={addRow}
                            style={{ cursor: "pointer" }}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="tracker-footer">
                <button className="tracker-cancel" type="button">
                  Cancel
                </button>
                <button type="submit" className="tracker-submit">
                  Submit
                </button>
              </div>
            </form>
          ) : null}
        </div>

        {activeTab === "submitted" && (
          <div className="table-wrapper-tdy-dl">
            <table className="tdy-dl-table-tracker">
              <thead className="tdy-dl-thead">
                <tr>
                  <th>Sl.no</th>
                  <th>Activity Date</th>
                  <th>Study Name</th>
                  <th>Task</th>
                  <th>Status</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {submittedData.map((data, index) => (
                  <tr key={index}>
                    <td>{data.sl_no}</td>
                    <td>{data.activity_date}</td>
                    <td>{data.study_name}</td>
                    <td>{data.task}</td>
                    <td>{data.status}</td>
                    <td>{data.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Modal
        show={showModal}
        onClose={handleCloseModal}
        title={modalContent.title}
        message={modalContent.message}
        type={modalContent.type}
        onTryAgain={handleTryAgain}
        onContinue={handleContinue}
      />
    </div>
  );
}

export default StudyTracker;
