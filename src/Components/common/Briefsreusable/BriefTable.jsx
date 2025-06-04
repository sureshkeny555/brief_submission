// components/BriefTable.js
import React from "react";
import ProgressTracker from "../../common/StepIndicator/Step";

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const BriefTable = ({ briefs, handleActionClick }) => (
  <div className="table-wrapper">
    <table className="briefs-table-showall">
      <thead>
        <tr className="study-name-column">
          <th>NPD/EPD</th>
          <th>Study Name</th>
          <th>Study Status</th>
          <th>Deadline</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {briefs?.length > 0 ? (
          briefs.map((brief, index) => (
            <tr key={index}>
              <td>{brief.study_type}</td>
              <td>{brief.brand}</td>
              <td>
                <div className="status-indicators-showall">
                  <ProgressTracker />
                </div>
              </td>
              <td>{formatDate(brief.deadline)}</td>
              <td>
                <button
                  className="action-button-showall"
                  onClick={() => handleActionClick(brief)}
                >
                  Approve/Disapprove
                </button>
              </td>
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
);

export default BriefTable;
