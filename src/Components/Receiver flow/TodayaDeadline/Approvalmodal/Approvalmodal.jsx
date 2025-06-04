import React, { useEffect, useState, useRef } from "react";
import "./Approvalmodal.scss";
import "./Acceptmodal.scss";
import "./successpopup.scss";
import "./Rejectmodal.scss";
import back from "../../../assets/svg/back.svg";
import { ReactSVG } from "react-svg";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  acceptBriefTrack,
  calculateDate,
  clearCalculatedDateFromState,
  rejectBriefTrack,
  updateResetMessage,
} from "../../../../store/features/briefsData";
// import BriefStatus from "../../../Briefstatus/BriefStatus";
import successIcon from "../../../assets/svg/succesicon.svg";
import Attchments from "../../../assets/svg/totalattachment.svg";
import "../../../CreatorFlow/CreateBrief/SuccessPopup.scss";
import { comment } from "postcss";
import Modal from "../../../common/Modal/Modal";

function ApprovalPage({ onClose }) {
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    type: "",
  });

  const [formData, setFormData] = useState({
    categoryType: "",
    brand: "",
    start_date: "",
    questionnaire_coding_date: "",
    po_approval: "",
    agency_finalization: "",
    cpi_total: "",
    travel_cost: "",
    miscellaneous_cost: "",
    total_cost: "",
    comments: "",
    market_objective: "",
    research_objective: "",
    research_tg: "",
    additional_information: "",
    research_type: "",
    previous_research: "",
    attachments: null,
  });

  const initialFormData = {
    categoryType: "",
    brand: "",
    start_date: "",
    questionnaire_coding_date: "",
    po_approval: "",
    agency_finalization: "",
    cpi_total: "",
    travel_cost: "",
    miscellaneous_cost: "",
    total_cost: "",
    attachments: null,
  };

  const calculatedDates = useSelector(
    (state) => state?.briefs?.calculateDate?.calculated_dates
  );
  const successMessage = useSelector((state) => state?.briefs?.successMessage);
  const errorMessage = useSelector((state) => state?.briefs?.errorMessage);
  const navigate = useNavigate();
  const location = useLocation();
  const { brief, briefId } = location.state || {};
  const dispatch = useDispatch();
  const inputValue = useSelector((state) => state.briefs.inputValue);

  useEffect(() => {
    // dispatch(acceptBriefTrack());
    // dispatch(calculateDate())
  }, [dispatch]);

  const openRejectModal = () => {
    setIsRejectModalOpen(true);
  };
  const closeRejectModal = () => {
    setIsRejectModalOpen(false);
  };

  const openAcceptModal = () => {
    setIsAcceptModalOpen(true);
  };

  const closeAcceptModal = () => {
    setIsAcceptModalOpen(false);
    setFormData(initialFormData);
  };

  const handleBackClick = () => {
    navigate("/receiverlayout/todaydeadline");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "start_date" && value) {
      let date = new Date(value);

      let formattedDateForAPI = `${String(date.getDate()).padStart(
        2,
        "0"
      )}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;

      let formattedDateForInput = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

      setFormData((prevData) => ({
        ...prevData,
        [name]: formattedDateForInput,
      }));

      dispatch(calculateDate(formattedDateForAPI));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      attachments: file,
    });
  };

  useEffect(() => {
    if (calculatedDates) {
      setFormData((prevData) => ({
        ...prevData,
        po_approval: calculatedDates.po_approval || prevData.po_approval,
        agency_finalization:
          calculatedDates.agency_finalisation || prevData.agency_finalization,
        questionnaire_coding_date:
          calculatedDates.questionnaire_coding_date ||
          prevData.questionnaire_coding_date,
      }));
    }
  }, [calculatedDates]);

  useEffect(() => {
    const total =
      (parseFloat(formData.cpi_total) || 0) +
      (parseFloat(formData.travel_cost) || 0) +
      (parseFloat(formData.miscellaneous_cost) || 0);
    setFormData((prevData) => ({
      ...prevData,
      total_cost: total.toFixed(2),
    }));
  }, [formData.cpi_total, formData.travel_cost, formData.miscellaneous_cost]);

  const handleRejectionChange = (value) => {
    setRejectionReason(value.trim());
  };

  useEffect(() => {
    dispatch(updateResetMessage());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      setModalContent({
        title: "Success",
        message: successMessage || "Brief Rejected successfully",
        type: "success",
      });
      setShowModal(true);
      dispatch(updateResetMessage());
    } else if (errorMessage) {
      setModalContent({
        title: "Failed",
        message: errorMessage || "Failed",
        type: "failure",
      });
      console.log({ errorMessage });
      setShowModal(true);
      dispatch(updateResetMessage());
    }
  }, [successMessage, errorMessage, dispatch]);

  const handleContinue = () => {
    setShowModal(false);
    // navigate("/receiverlayout/todaydeadline");
    window.location.href = "/receiverlayout/todaydeadline";
  };
  const handleCloseModal = () => {
    setShowModal(false);
    // navigate("/receiverlayout/todaydeadline");
    window.location.href = "/receiverlayout/todaydeadline";
  };
  const handleRejectSubmit = () => {
    if (!rejectionReason.trim()) {
      // alert("Please provide a rejection reason.");
      return;
    }

    dispatch(rejectBriefTrack(briefId, rejectionReason));
    setIsRejectOpen(true);
    setIsRejectModalOpen(false);
  };

  const handleAcceptSubmit = async (e) => {
    e.preventDefault();
    const newFormData = new FormData();

    // newFormData.append("category_type", formData.categoryType);
    // newFormData.append("brand", formData.brand);
    newFormData.append("start_date", formData.start_date);
    newFormData.append("po_approval", formData.po_approval);
    newFormData.append("agency_finalisation", formData.agency_finalization);
    newFormData.append(
      "questionnaire_coding_date",
      formData.questionnaire_coding_date
    );
    newFormData.append("cpi_total", formData.cpi_total);
    newFormData.append("travel_cost", formData.travel_cost);
    newFormData.append("miscellaneous_cost", formData.miscellaneous_cost);
    newFormData.append("total_cost", formData.total_cost);

    newFormData.append("comments", formData.comments);
    newFormData.append("market_objective", formData.market_objective);
    newFormData.append("research_objective", formData.research_objective);
    newFormData.append("research_tg", formData.research_tg);
    newFormData.append("research_type", formData.research_type);
    newFormData.append("previous_research", formData.previous_research);
    newFormData.append(
      "additional_information",
      formData.additional_information
    );

    if (formData.attachments) {
      newFormData.append("research_design_attachment", formData.attachments);
    }

    try {
      const response = await dispatch(acceptBriefTrack(newFormData, briefId));
      console.log(response.status);
      if (response && response.status === "error") {
        console.error("Error:", response.message);
         alert("There was an error submitting the form.");
      } else {
        console.log("Form submitted successfully");

        dispatch(clearCalculatedDateFromState());
        resetForm();
        setIsSuccessOpen(true);

        setTimeout(() => {
          setIsAcceptModalOpen(false);
          setIsSuccessOpen(false);
          navigate("/receiverlayout/todaydeadline");
        }, 1500);
      }
    } catch (error) {
      console.error("Network or other error:", error);
      //  alert("An error occurred. Please try again.");
    }
  };

  const closeSuccessPopup = () => {
    setIsSuccessOpen(false);
  };
  const role = localStorage.getItem("role");

  if (!brief) {
    return <div>Loading...</div>;
  }

  return (
    <div className="approval-page-today-dl">
      <div className="approval-page-today-dl-header">
        <div>
          <button onClick={handleBackClick}>
            <ReactSVG src={back} />
          </button>
        </div>
        <div>
          <h3>Approve or Disapprove Brief</h3>
        </div>
      </div>

      <div className="form-container-approval-modal-tdy-dl">
        <div className="form-row-am-tdy-dl">
          <div className="form-column-am-tdy-dl">
            <label>Category</label>
            <input type="text" value={brief?.category} readOnly required />
          </div>
          <div className="form-column-am-tdy-dl">
            <label>Study Type</label>
            <input type="text" value={brief?.study_type} readOnly />
          </div>
          <div className="form-column-am-tdy-dl">
            <label>Product</label>
            <input type="text" value={brief?.product_type} readOnly />
          </div>
          <div className="form-column-am-tdy-dl">
            <label>Brand</label>
            <input type="text" value={brief?.brand} readOnly />
          </div>
        </div>

        <div className="form-row-am-tdy-dl">
          <div className="form-column-am-tdy-dl">
            <label>Creator</label>
            <input type="text" value={brief?.creator || "XYZ"} readOnly />
          </div>
          <div className="form-column-am-tdy-dl">
            <label>Deadline</label>
            <input type="text" value={brief?.deadline} readOnly />
          </div>
          <div className="form-column-am-tdy-dl"></div>
          <div className="form-column-am-tdy-dl"></div>
        </div>

        <>
          <div className="text-area-group">
            <label>Previous Research Learning</label>
            <textarea
              name="previous_research"
              placeholder="Add previous research details (max 2500 characters)"
              autoComplete="off"
              value={formData?.previous_research}
              onChange={handleInputChange}
              maxLength={2500}
              readOnly={role === "Admin" || role === "Super Admin"}
            />
          </div>

          <div className="text-area-group">
            <label>Market Objective</label>
            <textarea
              name="market_objective"
              placeholder="Market objective"
              autoComplete="off"
              // value={formData.market_objective}
              // onChange={handleInputChange}
              value={brief?.market_objective}
            />
          </div>
          <div className="text-area-group">
            <label>Research Objective</label>
            <textarea
              name="research_objective"
              placeholder="Research objective"
              autoComplete="off"
              value={brief?.research_objective}
              // value={formData.research_objective}
              // onChange={handleInputChange}
            />
          </div>
          <div className="text-area-group">
            <label>Research TG</label>
            <textarea
              name="research_tg"
              placeholder="Target group"
              autoComplete="off"
              value={brief?.research_tg}
              // value={formData.research_tg}
              // onChange={handleInputChange}
            />
          </div>
          <div className="text-area-group">
            <label>Key information area </label>
            <textarea
              name="research_tg"
              placeholder="Target group"
              autoComplete="off"
              value={brief?.key_information_area}
              // value={formData.research_tg}
              // onChange={handleInputChange}
            />
          </div>
          <div className="text-area-group">
            <label>Research Type</label>
            <textarea
              name="research_type"
              placeholder="Research design"
              autoComplete="off"
              value={brief?.research_type}
              // value={formData.research_type}
              // onChange={handleInputChange}
            />
          </div>
          <div className="text-area-group">
            <label>Additional Information</label>
            <textarea
              name="additional_information"
              placeholder="Additional information"
              autoComplete="off"
              value={brief?.Additional_information}
              // value={formData.additional_information}
              // onChange={handleInputChange}
            />
          </div>
          <div className="text-area-group">
            {/* <label>Attachments (Stimulus)</label> */}
            {brief.file_path && (
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
                  href={brief.file_path}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    textDecoration: "none",
                    color: "black",
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                  }}
                >
                  <ReactSVG src={Attchments} />
                  <span>{brief.creator_file || "Creator File"}</span>
                </a>
              </div>
            )}
          </div>
        </>

        <div className="button-group-tdl">
          {role === "Project Coordinator" && (
            <div className="button-group">
              <button className="reject-button" onClick={openRejectModal}>
                Reject
              </button>
              <button className="accept-button" onClick={openAcceptModal}>
                Accept
              </button>
            </div>
          )}
        </div>
      </div>

      {isRejectModalOpen && (
        <div className="modal-overlay-reject">
          <div className="modal-content-reject">
            <div className="modal-header-reject">
              <h2>Reject Brief</h2>
              <button onClick={closeRejectModal} className="close-modal-reject">
                &times;
              </button>
            </div>

            <div className="modal-body-reject">
              <span>Rejection Reason</span>
              <form onSubmit={handleRejectSubmit}>
              <textarea
                className="reject_text-area"
                required
                value={rejectionReason}
                onChange={(e) => handleRejectionChange(e.target.value.trim())}
               
              ></textarea>
              <button
              type="submit"
                className="modal-reject-button"
                // onClick={handleRejectSubmit}
              >
                Submit Rejection
              </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {isAcceptModalOpen && (
        <div className="modal-overlay-accept">
          <div className="modal-content-accept">
            <div className="modal-header-accept">
              <h3>Accept Brief Track</h3>
              <button onClick={closeAcceptModal} className="close-modal">
                &times;
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAcceptSubmit} className="form-grid">
                <div className="form-groups">
                  <label className="required">Start Date</label>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    placeholder="Date"
                    min={new Date().toISOString().split("T")[0]}
                    max="2099-12-31"
                    required
                  />
                </div>

                <div className="form-groups">
                  <label className="required">Po Approval</label>
                  <input
                    type="text"
                    name="po_approval"
                    value={formData.po_approval}
                    onChange={handleInputChange}
                    placeholder="Po approval"
                    readOnly
                    required
                  />
                </div>

                <div className="form-groups">
                  <label className="required">Agency Finalisation</label>
                  <input
                    type="text"
                    name="agency_finalisation"
                    value={formData.agency_finalization}
                    onChange={handleInputChange}
                    placeholder="Agency finalisation"
                    readOnly
                    required
                  />
                </div>
                <div className="form-groups">
                  <label className="required">Questionnaire coding</label>
                  <input
                    type="text"
                    name="questionnaire_coding_date"
                    value={formData.questionnaire_coding_date}
                    onChange={handleInputChange}
                    placeholder="Questionnaire_coding_date"
                    readOnly
                    required
                  />
                </div>

                <div className="form-groups">
                  <label className="required">Cpi total</label>
                  <input
                    type="number"
                    name="cpi_total"
                    value={formData.cpi_total}
                    onChange={handleInputChange}
                    onKeyDown={(e) =>
                      ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                    }
                    placeholder="Cpi total"
                    min="0"
                    step="any"
                    pattern="^[0-9]+(\.[0-9]+)?$"
                    autoComplete="off"
                    required
                  />
                </div>
                <div className="form-groups">
                  <label className="required">Travel cost(if any)</label>
                  <input
                    type="number"
                    name="travel_cost"
                    value={formData.travel_cost}
                    onChange={handleInputChange}
                    onKeyDown={(e) =>
                      ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                    }
                    placeholder="Travel cost"
                    min="0"
                    step="any"
                    // pattern="^[0-9]+(\.[0-9]+)?$"
                    autoComplete="off"
                    required
                  />
                </div>
                <div className="form-groups">
                  <label className="required">Miscellaneous cost(if any)</label>
                  <input
                    type="number"
                    name="miscellaneous_cost"
                    value={formData.miscellaneous_cost}
                    onChange={handleInputChange}
                    onKeyDown={(e) =>
                      ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                    }
                    placeholder="Miscellaneous cost"
                    min="0"
                    step="any"
                    pattern="^[0-9]+(\.[0-9]+)?$"
                    autoComplete="off"
                    required
                  />
                </div>

                <div className="form-groups">
                  <label className="required">Total Cost</label>
                  <input
                    type="number"
                    name="total_cost"
                    value={formData.total_cost}
                    onChange={handleInputChange}
                    placeholder="Total cost"
                    readOnly
                    min="0"
                    step="any"
                    pattern="^[0-9]+(\.[0-9]+)?$"
                    autoComplete="off"
                    required
                  />
                </div>

                <div className="form-groups full-width">
                  <label className="required">Research Design</label>
                  <input
                    type="file"
                    name="research_design_attachment"
                    onChange={handleFileChange}
                    autoComplete="off"
                    required
                  />
                </div>

                <div className="form-act">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={closeAcceptModal}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="submit-button">
                    Submit
                  </button>
                </div>
              </form>

              {isSuccessOpen && (
                <div className="success-popup">
                  <div className="success-popup-content">
                    <div className="-success-popup-header">
                      <h3>
                        <ReactSVG src={successIcon} />
                        Brief Accepted{" "}
                      </h3>
                    </div>
                    <p>Success! your brief has been Accepted successfully.</p>
                    <button
                      className="success-popup-ok-button"
                      onClick={closeSuccessPopup}
                    >
                      OK
                    </button>
                  </div>
                </div>
              )}

              {isRejectOpen && (
                <div className="success-popup">
                  <div className="success-popup-content">
                    <div className="-success-popup-header">
                      {/* <h3>
                        <ReactSVG src={successIcon} />
                        Brief Created{" "}
                      </h3> */}
                    </div>
                    <p>Bief rejected successfully</p>
                    <button
                      className="success-popup-ok-button"
                      onClick={closeSuccessPopup}
                    >
                      OK
                    </button>
                  </div>
                </div>
              )}
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
        // onTryAgain={handleTryAgain}
        onContinue={handleContinue}
      />
    </div>
  );
}

export default ApprovalPage;
