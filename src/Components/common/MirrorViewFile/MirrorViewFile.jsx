// import "./MirrorViewFile.scss";
// import back from "../../assets/svg/back.svg";
import { ReactSVG } from "react-svg";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../../CreatorFlow/CreateBrief/SuccessPopup.scss";
import { useEffect } from "react";
import styles from "./MirrorViewFile.module.scss";
import Attchments from "../../assets/svg/totalattachment.svg";

function MirrorViewFile({ onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { brief, briefId } = location.state || {};

  console.log({ brief });
  const dispatch = useDispatch();
  const inputValue = useSelector((state) => state.briefs.inputValue);

  useEffect(() => {
    if (!briefId || !brief) {
      console.error("No brief data found.");
    }
  }, [briefId, brief]);

  const handleBackClick = () => {
    if (location.pathname.includes("/layout/")) {
      navigate("/layout/briefstatus");
    } else if (location.pathname.includes("/receiverlayout/")) {
      navigate("/receiverlayout/receiverbrief");
    }
  };

  const role = localStorage.getItem("role");

  if (!brief) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles["approval-page-creator-mirror"]}>
      <h3>{brief.study_name}</h3>
      <div className={styles["form-container-approval-cre-mirror"]}>
        <div className={styles["modal-body-mirror"]}>
          <form className={styles["newbriefcre-form-mirror"]}>
            <div className={styles["form-row-cre-mirror"]}>
              <div className={styles["form-column-mirror"]}>
                <label className={`test-label-mirror`}>Category </label>
                <input
                  type="text"
                  name="category"
                  value={brief.category}
                  className={styles["styled-select-input-mirror"]}
                  readOnly
                />
              </div>

              <div className={styles["form-column-mirror"]}>
                <label className={`test-label-mirror`}>Product </label>
                <input
                  type="text"
                  name="product"
                  value={brief.product_type}
                  className={styles["styled-select-input-mirror"]}
                  readOnly
                />
              </div>

              <div className={styles["form-column-mirror"]}>
                <label className={`test-label-mirror`}>Brand </label>
                <input
                  type="text"
                  name="brand"
                  value={brief.brand}
                  className={styles["styled-select-input-mirror"]}
                  readOnly
                />
              </div>

              <div className={styles["form-column-mirror"]}>
                <label className="test-label-mirror ">Study Type </label>
                <input
                  type="text"
                  name="studyType"
                  value={brief.study_type}
                  className={styles["styled-select-input-mirror"]}
                  readOnly
                />
              </div>
            </div>

            {/* <dic className="form-row-cre-mirror"> */}
            {/* <div className={styles["form-column"]}>
              <div className={styles["research-sample-container"]}>
                <div className={styles["research-main-container"]}>
                  <label
                    className={`test-label`}
                  >
                    Research Type
                  </label>
                  <div>
                    {" "}
                    <input
                      type="text"
                      className={styles["styled-select-input-mirror"]}
                      name="otherResearchDesign"
                      value={brief.research_type}
                       //="Please specify the type"
                      style={{ width: "100%" }}
                      readOnly
                    />
                  </div>
                </div>

                <div className={styles["sample-main-container"]}>
                  <label
                    className={`test-label`}
                  >
                    Sample Size
                  </label>
                  <input
                    type="number"
                    className={styles["sample-size-input-mirror"]}
                    name="sampleSize"
                    value={brief.sampleSize || ""}
                     //="Sample Size"
                    readOnly
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            </div> */}

            <div className={styles["form-row-cre-mirror"]}>
              <div className={styles["form-column-mirror"]}>
                <div className={styles["research-sample-container-mirror"]}>
                  <div className={styles["research-main-container-mirror"]}>
                    <label className="test-label-mirror">Research Type</label>
                    <input
                      type="text"
                      className={styles["styled-select-input-mirror"]}
                      name="otherResearchDesign"
                      value={brief.research_type === "Others" ? brief.other_research_type : brief.research_type}
                      //  //="Please specify the type"
                      style={{ width: "100%" }}
                      readOnly
                    />
                  </div>

                  <div className={styles["sample-main-container-mirror"]}>
                    <label className="test-label-mirror ">Sample Size</label>
                    <input
                      type="number"
                      className={styles["sample-size-input-mirror"]}
                      name="sampleSize"
                      value={brief.sample_size || ""}
                      //  //="Size"
                      readOnly
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>
              </div>

              <div className={styles["form-column-mirror"]}>
                <label className="test-label-mirror ">Deadline </label>
                <input
                  type="text"
                  //  //="Select date"
                  // style={{width:"320px",marginRight:"261px"}}
                  className={styles["input-deadline-mirror"]}
                  name="deadline"
                  value={brief.deadline}
                  min={new Date().toISOString().split("T")[0]}
                  autoComplete="off"
                  readOnly
                />
              </div>
              <div className={styles["form-column-mirror"]}>
                <label className={`test-label-mirror`}>
                  Stimulus Dispatch Date{" "}
                </label>
                <input
                  type="text"
                  // style={{marginLeft:"-260px",marginBottom:"80px",width:"320px"}}
                  name="stimulusDispatchDate"
                  className={styles["styled-select-input-mirror"]}
                  value={brief.stimulus_dispatch_date}
                  autoComplete="off"
                  min={new Date().toISOString().split("T")[0]}
                  readOnly
                />
              </div>

              <div className={styles["form-column-mirror"]}>
                {/* <label className="test-label-mirror ">
                  city{" "}
                </label>
                <input
                  type="text"
                  name="city"
                   //="Select Cities"
                  maxSelectedLabels={3}
                  className="basic-multi-selectcity"
                  value={brief?.city}
                  readOnly
                /> */}
              </div>
            </div>

            {brief.previous_research !== null && (
              <div className={styles["form-groups-create-mirror"]}>
                <label className="test-label-mirror">Previous research </label>
                <textarea
                  type="text"
                  name="marketObjective"
                  value={brief.previous_research}
                  autoComplete="off"
                  className={styles["textarea-mirror"]}
                  readOnly
                />
              </div>
            )}

            <div className={styles["form-groups-create-mirror"]}>
              <label className="test-label-mirror ">Market Objective </label>
              <textarea
                type="text"
                name="marketObjective"
                value={brief.market_objective}
                //  //="Mention Market Objective"
                autoComplete="off"
                className={styles["textarea-mirror"]}
                readOnly
              />
            </div>

            <div className={styles["form-groups-create-mirror"]}>
              <label className="test-label-mirror ">Research Objective </label>
              <textarea
                type="text"
                name="researchObjective"
                className={styles["textarea-mirror"]}
                value={brief.research_objective}
                 //="Mention Research Objective"
                readOnly
              />
            </div>

            <div className={styles["form-groups-create-mirror"]}>
              <label className="test-label-mirror ">Research TG </label>
              <textarea
                // style={{font:"Open Sans",fontWeight:"400", fontSize:"14px"}}
                type="text"
                name="researchTG"
                className={styles["textarea-mirror"]}
                value={brief.research_tg}
                 //="Mention Research TG"
                readOnly
              />
            </div>

            <div className={styles["form-groups-create-mirror"]}>
              <label className="test-label-mirror ">
                Key Information Area{" "}
              </label>
              <textarea
                type="text"
                name="keyInfoArea"
                className={styles["textarea-mirror"]}
                value={brief.key_information_area}
                 //="Mention Key Information Area"
                readOnly
              />
            </div>

            <div className={styles["form-groups-create-mirror"]}>
              <label className="test-label-mirror ">
                Additional Information{" "}
              </label>
              <textarea
                type="text"
                name="additionalInfo"
                className={styles["textarea-mirror"]}
                value={brief.Additional_information}
                 //="Mention Additional Information"
                readOnly
              />
            </div>
            {brief.rejection_reason && (
  <div className={styles["form-groups-create-mirror"]}>
    <label className="test-label-mirror" style={{ fontWeight: "bold", fontSize: "16px" }}>
      Rejection Reason:{" "}
      <span
        style={{
          color: "#004EFF", 
          fontWeight: "600",
          fontSize: "16px", 
          // backgroundColor: "lightyellow",
          padding: "5px",
          borderRadius: "4px", 
        }}
      >
        {brief.rejection_reason}
      </span>
    </label>
  </div>
)}

            
            {/* <div className={styles["form-groups-create-mirror"]}>
              <label className="test-label-mirror ">Comments</label>
              <textarea
                type="text"
                name="additionalInfo"
                className={styles["textarea-mirror"]}
                value={brief.comments}
                 //="Mention Additional Information"
                readOnly
              />
            </div> */}

            <div className={styles["form-groups-create-mirror full-width"]}>
              <label className={`test-label-mirror`}>
                Attachments (Stimulus)
              </label>

              {brief.creator_file_path && (
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
                    href={brief.creator_file_path}
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
                    <span>{brief.creator_file_path || "Creator File"}</span>
                  </a>
                </div>
              )}

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
                    <span>{brief.research_design_attachment || "File"}</span>
                  </a>
                </div>
              )}

              {/* Show pc_file_path if it exists */}
              {/* {brief.pc_file_path && (
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
                    href={brief.pc_file_path}
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
                    <span>{brief.study_name || "File 2"}</span>
                  </a>
                </div>
              )} */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default MirrorViewFile;
