import React, { useEffect, useState } from "react";
import "./Allocatestudy.scss";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import successIcon from "../../assets/svg/signupsuccess.svg";
import {
  getAllocateBrifId,
  getAllocateMember,
  getAllocateStudy,
  getBriefInput,
  updateResetMessage,
} from "../../../store/features/briefsData";
import { useNavigate } from "react-router-dom";
// import { MultiSelect } from "react-multi-select-component";
import { MultiSelect } from "react-multi-select-component";
import { ReactSVG } from "react-svg";
import SelectBox from "../../common/SelectBox/SelectBox";
import Modal from "../../common/Modal/Modal";
// import Multiselect from "multiselect-react-dropdown";

const AllocateStudy = () => {
  const customStyles = {
    container: (provided) => ({
      ...provided,
      width: "100%",
      position: "relative",
      minHeight: "40px",
      height: "auto",
      padding: "2px",
      zIndex: 3,
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
      position: "absolute",
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    control: (provided) => ({
      ...provided,
      minHeight: "40px",
      height: "10px",
      flexWrap: "wrap",
      padding: "2px",
      overflow: "auto",
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: "2.4rem",
      display: "flex",
      flexWrap: "wrap",
      overflow: "visible",
      maxHeight: "none",
      padding: "0 6px",
    }),
    multiValueLabel: (base) => ({
      ...base,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "100px",
    }),
    input: (provided) => ({
      ...provided,
      margin: "0px",
      padding: "0px",
      flex: "1 1 auto",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: "auto",
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      display: "none",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      padding: "5px",
      color: "gray",
      marginTop: "1px",
    }),
    clearIndicator: (provided) => ({
      ...provided,
      padding: "5px",
      color: "gray",
      cursor: "pointer",
    }),
  };

  const [isOpen, setIsOpen] = useState(false);
  const [creatorFilePaths, setCreatorFilePaths] = useState([]);
  const [UserId, setUserId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const errorMessages = useSelector((state) => state?.briefs?.errorMessage);
  const successMessage = useSelector((state) => state?.briefs?.successMessage);
  const [formData, setFormData] = useState({
    category: "",
    product: "",
    brand: "",
    studyType: "",
    studyAllocate: [],
    briefIds: [],
  });
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    type: "",
  });
  const [error, setError] = useState("");
  const [studyAllocateError, setStudyAllocateError] = useState(false);
  const [briefIdsError, setBriefIdsError] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(updateResetMessage());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      setModalContent({
        title: "Study Allocated",
        message:
          " The study has been successfully assigned to the designated members",
        type: "success",
      });
      setShowModal(true);
      dispatch(updateResetMessage());
    } else if (errorMessages) {
      console.log({ errorMessage });
      setModalContent({
        title: "Allocation Failed",
        message: errorMessages || "Failed to allocate",
        type: "failure",
      });
      setShowModal(true);
      dispatch(updateResetMessage());
    }
  }, [successMessage, errorMessages, dispatch]);

  const token = localStorage.getItem("token");
  useEffect(() => {
    if (token) {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );

      const payload = JSON.parse(jsonPayload);

      const id = payload.user_id;
      setUserId(id);

      const now = Date.now() / 1000;
      if (payload.exp < now) {
        setFormData({
          category: "",
          product: "",
          brand: "",
          studyType: "",
          studyAllocate: [],
          briefIds: [],
        });
      }
    } else {
      setFormData({
        category: "",
        product: "",
        brand: "",
        studyType: "",
        studyAllocate: [],
        briefIds: [],
      });
      console.log("No token found");
    }
  }, [token]);

  const inputValue = useSelector((state) => state.briefs.allocateBriefId);

  const options =
    inputValue?.data?.map((item) => {
      const [key, value] = Object.entries(item)[0];
      const id = value;
      return { value: key, label: `${id}` };
    }) || [];

  const allocateMember = useSelector(
    (state) => state.briefs.allocateMember?.project_coordinators
  );
  const member = Array.isArray(allocateMember) ? allocateMember : [];
  //  const member = ["naveennaveennavee","chander","naveen"]

  useEffect(() => {
    dispatch(getAllocateMember());
    dispatch(getBriefInput());
    dispatch(getAllocateBrifId());
  }, [dispatch]);

  // const selectCategory = inputValue.data ? Object.keys(inputValue.data) : [];
  // // console.log({ selectCategory });

  // const products =
  //   formData.category && inputValue.data[formData.category]
  //     ? Object.keys(inputValue.data[formData.category])
  //     : [];

  // const brands =
  //   formData.product && inputValue.data[formData.category][formData.product]
  //     ? Object.keys(inputValue.data[formData.category][formData.product])
  //     : [];

  // const study =
  //   formData.brand &&
  //   inputValue.data[formData.category]?.[formData.product]?.[formData.brand]
  //     ?.previous_study
  //     ? Object.keys(
  //         inputValue.data[formData.category][formData.product][formData.brand]
  //           .previous_study
  //       )
  //     : [];

  useEffect(() => {
    const filePaths = [];

    const previousStudies =
      formData.category &&
      formData.product &&
      formData.brand &&
      inputValue.data[formData.category]?.[formData.product]?.[formData.brand]
        ?.previous_study
        ? inputValue.data[formData.category][formData.product][formData.brand]
            .previous_study[formData.studyType]
        : [];

    if (previousStudies && previousStudies.length > 0) {
      previousStudies.forEach((studyEntry) => {
        const briefId = Object.keys(studyEntry)[0];
        const filePath = studyEntry[briefId];
        if (filePath) {
          filePaths.push({
            value: briefId,
            label: `ID: ${briefId} Path: ${filePath}`,
          });
        }
      });
    }

    setCreatorFilePaths(filePaths);
  }, [inputValue, formData]);

  const handleFormDataChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "studyAllocate"  && value.length > 0) {
      setStudyAllocateError(false);
    }
    if(name === "briefIds" && value.length > 0){
      setBriefIdsError(false)
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "researchDesign") {
      if (value === "Others") {
        setIsOtherSelected(true);
        setFormData((prevState) => ({
          ...prevState,
          [name]: "",
        }));
      } else {
        setIsOtherSelected(false);
        setFormData((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      }
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }

    if (name === "category") {
      setFormData((prevData) => ({
        ...prevData,
        product: "",
        brand: "",
        studyType: "",
      }));
    }

    if (name === "product") {
      setFormData((prevData) => ({
        ...prevData,
        brand: "",
        studyType: "",
      }));
    }

    if (name === "brand") {
      setFormData((prevData) => ({
        ...prevData,
        studyType: "",
      }));
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

   let hasError = false;

if (!formData.studyAllocate || formData.studyAllocate.length === 0) {
  setStudyAllocateError(true);
  hasError = true;
} else {
  setStudyAllocateError(false);
}

if (!formData.briefIds || formData.briefIds.length === 0) {
  setBriefIdsError(true);
  hasError = true;
} else {
  setBriefIdsError(false);
}

if (hasError) return;


    dispatch(getAllocateStudy(formData, UserId))
      .then(() => {
        setIsOpen(true);
        setFormData((prevData) => ({
          ...prevData,
          studyAllocate: [],
          briefIds: [],
        }));
      })
      .catch((error) => {
        const errorMsg = useSelector((state) => state?.briefs?.errorMessage);

        if (errorMsg) {
          setErrorMessage(errorMsg);
        } else {
          alert("An unexpected error occurred. Please try again.");
        }
      });
  };

  const closePopup = () => {
    setIsOpen(false);
    setFormData({
      category: "",
      product: "",
      brand: "",
      studyType: "",
      studyAllocate: [],
      briefIds: [],
    });
    setErrorMessage("");
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleTryAgain = () => {
    setShowModal(false);
  };
  const handleContinue = () => {
    setShowModal(false);
    setFormData({
      category: "",
      product: "",
      brand: "",
      studyType: "",
      studyAllocate: [],
      briefIds: [],
    });
    window.location.reload()
  };

  // const customSelectedLabel = (selected) => {
  //   const selectedCount = selected.length;
  //   if (selectedCount <= 2) {
  //     return selected.map((item) => (
  //       <span key={item.value} style={{ color: "black", marginRight: "5px" }}>
  //         {item.label}
  //       </span>
  //     ));
  //   } else {
  //     const firstThree = selected.slice(0, 3).map((item) => (
  //       <span key={item.value} style={{ color: "black", marginRight: "5px" }}>
  //         {item.label}
  //       </span>
  //     ));
  //     return (
  //       <>
  //         {firstThree}
  //         <span style={{ color: "black", marginRight: "5px" }}>
  //           {selectedCount - 0} selected
  //         </span>
  //       </>
  //     );
  //   }
  // };

  return (
    <div className="allocate-study-container">
      <h3>Allocate Study</h3>
      <form className="allocate-study-form" onSubmit={handleSubmit}>
        {/* <div className="allocate-form-row">
          <div className="form-group">
            <label>
              Select the category <span>*</span>
            </label>
            <select
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
            >
              <option value="" disabled hidden>
                Select Category
              </option>
              {selectCategory.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>
              Select the Product <span>*</span>
            </label>
            <select
              name="product"
              required
              value={formData.product}
              onChange={handleChange}
            >
              <option value="" disabled hidden>
                Select Product
              </option>
              {products.length > 0
                ? products.map((product, index) => (
                    <option key={index} value={product}>
                      {product}
                    </option>
                  ))
                : ""}
            </select>
          </div>

          <div className="form-group">
            <label>
              Select the brand <span>*</span>
            </label>
            <select
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              required
            >
              <option value="" disabled hidden>
                Select Brand
              </option>
              {brands.map((brand, index) => (
                <option key={index} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>
              Select study type <span>*</span>
            </label>
            <select
              required
              name="studyType"
              value={formData.studyType}
              onChange={handleChange}
            >
              <option value="" disabled hidden>
                Select Type
              </option>
              {study.map((test, index) => (
                <option key={index} value={test}>
                  {test}
                </option>
              ))}
            </select>
          </div>
        </div> */}

        <div className="allocate-form-row">
          <div className="form-groups-allocate">
            <label>
              Allocate Study To <span>*</span>
            </label>
            <MultiSelect
              placeholder="Select Members"
              isMulti
              name="studyAllocate"
              className="custom-multi-select"
              required
              menuPortalTarget={document.body}
              options={member.map((item) => ({
                value: item,
                label: item,
              }))}
              onChange={(selected) =>
                handleFormDataChange(
                  "studyAllocate",
                  selected.map((item) => item.value)
                )
              }
              value={
                formData.studyAllocate
                  ? formData.studyAllocate.map((value) => ({
                      value,
                      label: value,
                    }))
                  : []
              }
              //  className="basic-multi-select"
              classNamePrefix="select"
              styles={customStyles}
              // overrideStrings={{
              //   selectSomeItems: "Select Cities",
              //   allItemsAreSelected: "All cities are selected",
              //   selectAll: "Select All",
              //   removeSelected: "Remove Selected",
              //   search: "Search",
              //   clearSearch: "Clear Search",
              // }}
              // valueRenderer={(selected) => customSelectedLabel(selected)}
              //  styles={customStyles}
            />
           {studyAllocateError && <span style={{color:"red",fontSize:"12px"}}>Please select a Study Allocate option</span>}
          </div>
          {/* <SelectBox
              placeholder="Select Members"
              isMultiSelect={true} 
              name="studyAllocate"
              required
              options={member.map((item) => ({
                value: item,
                label: item,
              }))}
              onChange={(selected) => {
                // Handle the selected values being passed back from SelectBox
                handleFormDataChange(
                  "studyAllocate",
                  selected.map((item) => item.value) // Make sure you send the values as an array of strings
                );
              }}
              value={
                formData.studyAllocate
                  ? formData.studyAllocate.map((value) => ({
                      value,
                      label: value,
                    })) // Map formData.studyAllocate to the correct object format
                  : []
              }
              classNamePrefix="select"
              styles={customStyles}
            /> */}

          <div className="form-groups-allocate">
            <label>
              Brief ID <span>*</span>
            </label>
            <MultiSelect
              placeholder="Select Brief ID"
              // classNames="brief-id"
              // className="custom-multi-select"
              isMulti
              required
              options={options}
              menuPortalTarget={document.body}
              // value={member.map((id) => ({
              //   value: id,
              //   label: id,
              // }))}
              value={formData.briefIds.map((id) => ({
                value: id,
                label: id,
              }))}
              onChange={(selected) =>
                handleFormDataChange(
                  "briefIds",
                  selected.map((item) => item.value)
                )
              }
              name="colors"
              className="custom-multi-select"
              classNamePrefix="select"
              styles={customStyles}
              getOptionLabel={(e) =>
                e.label.length > 15 ? `${e.label.substring(0, 12)}...` : e.label
              }
              // overrideStrings={{
              //   selectSomeItems: "Select Cities",
              //   allItemsAreSelected: "All cities are selected",
              //   selectAll: "Select All",
              //   removeSelected: "Remove Selected",
              //   search: "Search",
              //   clearSearch: "Clear Search",
              // }}
              // valueRenderer={(selected) => customSelectedLabel(selected)}
            />
            {briefIdsError && <span style={{color:"red",fontSize:"12px"}}>Please select at least one Brief ID</span>}
          </div>
          <div className="form-group"></div>
          <div className="form-group"></div>
        </div>

        <button type="submit" className="allocate-button">
          Allocate Study
        </button>
      </form>
      {/* {errorMessage && <div className="error-message">{errorMessage}</div>}
      {isOpen && (
        <div className="popup">
          <div className="popup-content">
            <div className="popup-header">
              <span className="popup-icon">
                <ReactSVG src={successIcon} />
              </span>
              <h3>Study Allocated</h3>
            </div>
            <p>
              The study has been successfully assigned to the designated
              members.
            </p>
            <button className="popup-ok-button" onClick={closePopup}>
              Continue
            </button>
          </div>
        </div>
      )} */}
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
};

export default AllocateStudy;
