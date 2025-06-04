import React, { useEffect, useRef, useState } from "react";
import Search from "../../../Components/assets/images/Serach.png";
import "../CreateBrief/Createbrief.scss";
import styles from "../CreateBrief/Createmodal.module.scss";
import "../CreateBrief/SuccessPopup.scss";
import { useDispatch, useSelector } from "react-redux";
// import { toast } from "react-toastify";
import { createBrief, getBriefInput } from "../../../store/features/briefsData";
import { useNavigate } from "react-router-dom";
import { ReactSVG } from "react-svg";
import actionIcon from "../../assets/svg/action.svg";
import successIcon from "../../assets/svg/succesicon.svg";
import intimation from "../../assets/svg/intimation.svg";
//  import Select from "../common/SelectBox/SelectBox";
import SelectBox from "../../common/SelectBox/SelectBox";
import Select from "react-select";
import Modal from "../../common/Modal/Modal";
import { updateResetMessage } from "../../../store/features/briefsData";
import { MultiSelect } from "react-multi-select-component";
// import { MultiSelect } from 'primereact/multiselect'

function NewBrief() {
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
    // multiValue: (provided) => ({
    //   ...provided,
    //   backgroundColor: "#e9ecef",
    //   color: "#495057",
    //   borderRadius: "4px",
    //   padding: "2px 6px",
    //   margin: "2px",
    //   maxWidth: "100%",
    // }),
    // multiValueLabel: (provided) => ({
    //   ...provided,
    //   color: "black",
    // }),
    // multiValueRemove: (provided) => ({
    //   ...provided,
    //   color: "#ff0000",
    //   ":hover": {
    //     backgroundColor: "#ff0000",
    //     color: "white",
    //   },
    // }),
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    marketObjective: "",
    researchObjective: "",
    researchTG: "",
    keyInfoArea: "",
    additionalInfo: "",
  });
  const [errors, setErrors] = useState({});
  const cityRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const isRequired = true;
  const [formData, setFormData] = useState({
    category: "",
    product: "",
    brand: "",
    studyType: "",
    marketObjective: "",
    researchObjective: "",
    researchTG: "",
    researchDesign: "",
    otherResearchDesign: "",
    keyInfoArea: "",
    deadline: "",
    additionalInfo: "",
    stimulusDispatchDate: "",
    city: [],
    currentProjectFocus: "",
    epd: "",
    conceptTest: "",
    productTest: "",
    packTest: "",
    advertisementTest: "",
    reason: "",
    conceptReason: "",
    productReason: "",
    packReason: "",
    attachments: null,
  });
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    type: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const successMessage = useSelector((state) => state?.briefs?.successMessage);
  const errorMessages = useSelector((state) => state?.briefs?.errorMessage);
  const inputValue = useSelector((state) => state.briefs.inputValue);
  const city = inputValue?.city || [];
  const [cityError, setCityError] = useState(false);
  // const cities = Array.isArray(inputValue?.city) ? inputValue?.city : [];

  useEffect(() => {
    dispatch(updateResetMessage());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getBriefInput());
  }, [dispatch]);

  const selectCategory = inputValue.data ? Object.keys(inputValue.data) : [];

  const products =
    formData.category && inputValue.data[formData.category]
      ? Object.keys(inputValue.data[formData.category])
      : [];

  const brands =
    formData.product && inputValue.data[formData.category][formData.product]
      ? Object.keys(inputValue.data[formData.category][formData.product])
      : [];

  const study =
    formData.brand &&
    inputValue.data[formData.category]?.[formData.product]?.[formData.brand]
      ? inputValue.data[formData.category][formData.product][formData.brand]
          .study_type
      : [];

  const previousStudies =
    formData.brand &&
    inputValue.data[formData.category]?.[formData.product]?.[formData.brand]
      ?.previous_study
      ? inputValue.data[formData.category][formData.product][formData.brand]
          .previous_study
      : {};

  const openModal = () => {
    // setIsModalOpen(true);
    navigate("/layout/newbrief");
  };

  const closeModal = () => {
    navigate("/layout/createbrief");

    setFormData({
      category: "",
      product: "",
      brand: "",
      studyType: "",
      marketObjective: "",
      researchObjective: "",
      researchTG: "",
      researchDesign: "",
      otherResearchDesign: "",
      sampleSize: "",
      keyInfoArea: "",
      deadline: "",
      additionalInfo: "",
      stimulusDispatchDate: "",
      city: [],
      currentProjectFocus: "",
      epd: "",
      conceptTest: "",
      productTest: "",
      packTest: "",
      advertisementTest: "",
      conceptReason: "",
      productReason: "",
      packReason: "",
      reason: "",
      attachments: null,
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openSuccessPopup = () => {
    setIsSuccessOpen(true);
  };
  const closeWarningPopup = () => {
    setIsWarningOpen(false);
  };

  const handleFormDataChange = (name, value) => {
    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: value,
      };
      return updatedData;
    });

    if (value.length > 0) {
      setErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[name];
        return updatedErrors;
      });
    }
  };

  useEffect(() => {
    console.log("Updated formData.city:", formData.city);
  }, [formData.city]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (value.length === 200) {
      setErrorMessage("You have reached the 200 character limit");
    } else {
      setErrorMessage("");
    }

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

    const noCurrentProjectTypes = [
      "UX testing",
      "U&A",
      "Need Gap study",
      "Consumer Understanding",
      "Market potential analysis",
      "Mystery Audit",
      "Retail Audit",
      "CSAT",
      "ESAT",
      "SSO",
      "Audit",
      "Ad diagnostic",
      "A/B testing",
    ];

    if (name === "studyType" && noCurrentProjectTypes.includes(value)) {
      setFormData((prevData) => ({
        ...prevData,
        currentProjectFocus: "",
      }));
    }

    if (name === "currentProjectFocus" && value !== "EPD") {
      setFormData((prevData) => ({
        ...prevData,
        epd: "",
      }));
    }

    if (name === "studyType") {
      setFormData((prevData) => ({
        ...prevData,
        reason: "",
      }));
    }

    if (name === "studyType" && value === "Concept test") {
      setFormData((prevData) => ({
        ...prevData,
        reason: "",
      }));
    }

    if (name === "studyType" && value === "Product test") {
      setFormData((prevData) => ({
        ...prevData,
        conceptTest: "",
        epd: "",
      }));
    }

    if (name === "studyType" && value === "Pack test") {
      setFormData((prevData) => ({
        ...prevData,
        conceptTest: "",
        productTest: "",
        advertisementTest: "",
      }));
    }

    if (name === "studyType" && value === "Advertisement test") {
      setFormData((prevData) => ({
        ...prevData,
        productTest: "",
        packTest: "",
        conceptTest: "",
      }));
    }

    if (name === "studyType" && value === "Brand track") {
      setFormData((prevData) => ({
        ...prevData,
        productTest: "",
        packTest: "",
        conceptTest: "",
        advertisementTest: "",
      }));
    }
    if (name === "studyType" && value === "UX testing") {
      setFormData((prevData) => ({
        ...prevData,
        reason: "",
      }));
    }

    if (
      name === "studyType" &&
      value !== "Pack test" &&
      value !== "Product test" &&
      value !== "Advertisement test" &&
      value !== "Brand track"
    ) {
      setFormData((prevData) => ({
        ...prevData,
        // conceptTest: "",
        // productTest: "",
        // advertisementTest: "",
        reason: "",
      }));
    }

    if (name === "epd" && value === "Single Stage Revamp") {
      setFormData((prevData) => ({
        ...prevData,
        conceptTest:
          prevData.studyType === "Concept test" ? prevData.conceptTest : "",
        productTest:
          prevData.studyType === "Product test" ? prevData.productTest : "",
        packTest: prevData.studyType === "Pack test" ? prevData.packTest : "",
        advertisementTest:
          prevData.studyType === "Advertisement test"
            ? prevData.advertisementTest
            : "",
      }));
    }

    if (
      name === "studyType" &&
      (value === "Concept test" ||
        value === "Product test" ||
        value === "Pack test" ||
        value === "Advertisement test" ||
        value === "Brand track")
    ) {
      setFormData((prevData) => ({
        ...prevData,
        epd: "",
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      attachments: file,
    });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.city || formData.city.length === 0) {
      newErrors.city = "City is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setTimeout(() => {
        scrollToErrorField();
      }, 100);
      return false;
    }
    return true;
  };

  const scrollToErrorField = () => {
    if (cityRef.current) {
      cityRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      cityRef.current.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const newFormData = new FormData();

    newFormData.append("category_type", formData.category);
    newFormData.append("product_type", formData.product);
    newFormData.append("brand", formData.brand);
    newFormData.append("study_type", formData.studyType);
    newFormData.append("market_objective", formData.marketObjective);
    newFormData.append("research_objective", formData.researchObjective);
    newFormData.append("research_tg", formData.researchTG);
    newFormData.append("research_type", formData.researchDesign);
    newFormData.append("other_research_type", formData.otherResearchDesign);
    newFormData.append("sample_size", formData.sampleSize);
    newFormData.append("key_information_area", formData.keyInfoArea);
    newFormData.append("deadline", formData.deadline);
    newFormData.append("Additional_information", formData.additionalInfo);
    newFormData.append("Stimulus_dispatch_date", formData.stimulusDispatchDate);
    newFormData.append("city", JSON.stringify(formData.city));
    newFormData.append("project_focus", formData.currentProjectFocus);
    newFormData.append("epd_stage", formData.epd);
    newFormData.append("product test", formData.productTest || "");
    newFormData.append("pack test", formData.packTest || "");
    newFormData.append("advertisement test", formData.advertisementTest || "");
    newFormData.append("concept test", formData.conceptTest || "");
    newFormData.append("reason", formData.reason);
    newFormData.append("concept_reason", formData.conceptReason);
    newFormData.append("product_reason", formData.productReason);
    newFormData.append("pack_reason", formData.packReason);
    newFormData.append("file_attachment", formData.attachments);

    if (formData.currentProjectFocus !== "EPD") {
      newFormData.delete("epd");
    }

    const linkedBriefIds = [];

    if (formData.conceptTest) {
      linkedBriefIds.push(formData.conceptTest);
    }
    if (formData.productTest) {
      linkedBriefIds.push(formData.productTest);
    }
    if (formData.packTest) {
      linkedBriefIds.push(formData.packTest);
    }
    if (formData.advertisementTest) {
      linkedBriefIds.push(formData.advertisementTest);
    }

    newFormData.append("linked_brief_id", JSON.stringify(linkedBriefIds));

    try {
      const response = await dispatch(createBrief(newFormData));

      if (response?.data?.statusCode === 201) {
        setIsSuccessOpen(true);
        setFormData({
          category: "",
          product: "",
          brand: "",
          studyType: "",
          marketObjective: "",
          researchObjective: "",
          researchTG: "",
          researchDesign: "",
          sampleSize: "",
          keyInfoArea: "",
          deadline: "",
          additionalInfo: "",
          stimulusDispatchDate: "",
          city: [],
          currentProjectFocus: "",
          epd: "",
          conceptTest: "",
          productTest: "",
          packTest: "",
          advertisementTest: "",
          reason: "",
          attachments: null,
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        console.error("Error submitting form:", response.message);
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeSuccessPopup = () => {
    setIsSuccessOpen(false);
    window.location.reload();
  };

  const customSelectedLabel = (selected) => {
    const selectedCount = selected.length;
    if (selectedCount <= 3) {
      return selected.map((item) => (
        <span key={item.value} style={{ color: "black", marginRight: "5px" }}>
          {item.label}
        </span>
      ));
    } else {
      const firstThree = selected.slice(0, 3).map((item) => (
        <span key={item.value} style={{ color: "black", marginRight: "5px" }}>
          {item.label}
        </span>
      ));
      return (
        <>
          {firstThree}
          <span style={{ color: "black", marginRight: "5px" }}>
            +{selectedCount - 0} selected
          </span>
        </>
      );
    }
  };
  const generateOptions = (testType) => {
    return Object.entries(previousStudies[testType] || {}).map(([id, file]) => {
      const fileName = file.split("\\").pop().split(".")[0];
      return { value: id, label: fileName };
    });
  };

  const handleSelectChange = (selectedOption, name) => {
    handleChange({
      target: { name, value: selectedOption ? selectedOption.value : "" },
    });
  };

  const conceptTestOptions = Object.entries(
    previousStudies["concept test"] || {}
  ).map(([id, file]) => {
    const fileNames = file ? file.split("\\").pop() : "";
    const fileName = fileNames.split(".")[0];
    return { value: id, label: fileName };
  });

  const productTestOptions = Object.entries(
    previousStudies["product test"] || {}
  ).map(([id, file]) => {
    const fileNames = file ? file.split("\\").pop() : "";
    const fileName = fileNames.split(".")[0];
    return { value: id, label: fileName };
  });

  const packTestOptions = Object.entries(
    previousStudies["pack test"] || {}
  ).map(([id, file]) => {
    const fileNames = file ? file.split("\\").pop() : "";
    const fileName = fileNames.split(".")[0];
    return { value: id, label: fileName };
  });

  const advertisementTestOptions = Object.entries(
    previousStudies["advertisement test"] || {}
  ).map(([id, file]) => {
    const fileNames = file ? file.split("\\").pop() : "";
    const fileName = fileNames.split(".")[0];
    return { value: id, label: fileName };
  });

  useEffect(() => {
    if (successMessage) {
      setModalContent({
        title: "Brief Created",
        message: "Success Your brief has been created successfully.",
        type: "success",
      });
      setIsSuccessOpen(true);
      // reset();
      // setFormSubmitted(false);
      dispatch(updateResetMessage());
    } else if (errorMessages) {
      setModalContent({
        title: "Action Required",
        message: errorMessages || "Failed to signup",
        type: "failure",
      });
      setIsSuccessOpen(true);
      // setFormSubmitted(false);
      dispatch(updateResetMessage());
    }
  }, [successMessage, errorMessages, dispatch]);

  const handleContinue = () => {
    setIsSuccessOpen(false);
    window.location.reload();
  };
  const handleTryAgain = () => {
    setIsSuccessOpen(false);
  };
  const handleCloseModal = () => {
    setIsSuccessOpen(false);
  };
  const customValueRenderer = (selected) => {
    if (selected.length === 0) {
      return (
        <span
          style={{
            color: "#667085",
            fontWeight: "400",
            fontFamily: "Open Sans",
          }}
        >
          Select Cities
        </span>
      );
    }
    return selected.map((item) => item.label).join(", ");
  };

  return (
    <div className={styles["approval-page-creator"]}>
      <h3>Create brief</h3>
      <div className={styles["form-container-approval-cre"]}>
        <div className={styles["modal-body"]}>
          <form className={styles["newbriefcre-form"]} onSubmit={handleSubmit}>
            <div className={styles["form-row-cre"]}>
              <div className={styles["form-column"]}>
                <label className={`test-label ${isRequired ? "required" : ""}`}>
                  Select Category{" "}
                </label>
                <select
                  name="category"
                  value={formData.category}
                  className={styles["styled-select-input"]}
                  onChange={handleChange}
                  required
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

              <div className={styles["form-column"]}>
                <label className={`test-label ${isRequired ? "required" : ""}`}>
                  Select Product{" "}
                </label>
                <select
                  name="product"
                  value={formData.product}
                  className={styles["styled-select-input"]}
                  onChange={handleChange}
                  required
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

              <div className={styles["form-column"]}>
                <label className={`test-label ${isRequired ? "required" : ""}`}>
                  Select Brand{" "}
                </label>
                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className={styles["styled-select-input"]}
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

              <div className={styles["form-column"]}>
                <label className={`test-label ${isRequired ? "required" : ""}`}>
                  Select Study Type{" "}
                </label>
                <select
                  name="studyType"
                  value={formData.studyType}
                  className={styles["styled-select-input"]}
                  onChange={handleChange}
                  required
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
            </div>

            <div className={styles["form-row-cre"]}>
              <div className={styles["form-column"]}>
                <div
                  className={styles["research-sample-container"]}
                  style={{
                    display: "flex",
                    gap: "20px",
                    alignItems: "flex-start",
                  }}
                >
                  {/* Research Type Field */}
                  <div
                    className={styles["research-main-container"]}
                    style={{ flex: 1 }}
                  >
                    <label
                      className={`test-label ${isRequired ? "required" : ""}`}
                    >
                      Research Type
                    </label>
                    <select
                      name="researchDesign"
                      value={formData.researchDesign || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData({
                          ...formData,
                          researchDesign: value,
                        });
                      }}
                      className={styles["styled-select-input"]}
                      required
                      style={{ width: "100%" }}
                    >
                      <option value="" disabled hidden>
                        Select Type
                      </option>
                      <option value="Qualitative">Qualitative</option>
                      <option value="Quantitative">Quantitative</option>
                      <option value="Exploratory">Exploratory</option>
                      <option value="Others">Others</option>
                    </select>

                    {/* Separate input field for "Others" */}
                    {formData.researchDesign === "Others" && (
                      <input
                        type="text"
                        className={styles["styled-select-input"]}
                        name="otherResearchDesign"
                        value={formData.otherResearchDesign || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || value.trim() !== "") {
                            setFormData({
                              ...formData,
                              otherResearchDesign: value,
                            });
                          }
                        }}
                        placeholder="Please specify the type"
                        required
                        style={{ width: "100%", marginTop: "10px" }}
                        autoComplete="off"
                      />
                    )}
                  </div>

                  {/* Sample Size Field */}
                  <div
                    className={styles["sample-main-container"]}
                    style={{ flex: 1 }}
                  >
                    <label
                      className={`test-label ${isRequired ? "required" : ""}`}
                    >
                      Sample Size
                    </label>
                    <input
                      type="number"
                      className={styles["sample-size-input"]}
                      name="sampleSize"
                      value={formData.sampleSize || ""}
                      min="0"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sampleSize: e.target.value,
                        })
                      }
                      onKeyDown={(e) =>
                        ["e", "E", "+", "-"].includes(e.key) &&
                        e.preventDefault()
                      }
                      placeholder="Sample Size"
                      required
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>
              </div>
              <div className={styles["form-column"]}>
                <label className={`test-label ${isRequired ? "required" : ""}`}>
                  Deadline{" "}
                </label>
                <input
                  type="date"
                  placeholder="Select date"
                  className={`${styles["styled-select-input"]} ${
                    styles["date-input"]
                  } ${formData.deadline ? styles["has-value"] : ""}`}
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  max="2099-12-31"
                  min={new Date().toISOString().split("T")[0]}
                  autoComplete="off"
                  required
                />
              </div>
              <div className={styles["form-column"]}>
                <label className={`test-label`}>Stimulus Dispatch Date </label>
                <input
                  type="date"
                  // style={{marginLeft:"-260px",marginBottom:"80px",width:"320px"}}
                  name="stimulusDispatchDate"
                  className={`${styles["styled-select-input"]} ${
                    styles["date-input"]
                  } ${formData.deadline ? styles["has-value"] : ""}`}
                  value={formData.stimulusDispatchDate}
                  onChange={handleChange}
                  autoComplete="off"
                  max="2099-12-31"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div ref={cityRef} className={styles["form-column"]}>
                <label className={`test-label ${isRequired ? "required" : ""}`}>
                  Select the city{" "}
                </label>
                <MultiSelect
                  name="city"
                  placeholder="Select Cities"
                  valueRenderer={customValueRenderer}
                  styles={customStyles}
                  className="custom-multi-select"
                  menuPortalTarget={document.body}
                  value={formData.city.map((item) => ({
                    value: item,
                    label: item,
                  }))}
                  onChange={(selected) =>
                    handleFormDataChange(
                      "city",
                      selected.map((item) => item.value)
                    )
                  }
                  options={city.map((item) => ({
                    value: item,
                    label: item,
                  }))}
                  overrideStrings={{
                    selectSomeItems: "Select Cities",
                    allItemsAreSelected: "All cities are selected",
                    selectAll: "Select All",
                    removeSelected: "Remove Selected",
                    search: "Search",
                    clearSearch: "Clear Search",
                  }}
                />
                {errors.city && (
                  <span style={{ color: "red" }}>{errors.city}</span>
                )}
                {/* <Select
                  name="city"
                  placeholder="Select City"
                  styles={customStyles}
                  className="basic-multi-selectcity"
                  required
                  isMulti
                  menuPortalTarget={document.body}
                  value={
                    Array.isArray(formData.city)
                      ? formData.city.map((item) => ({
                          value: item,
                          label: item,
                        }))
                      : []
                  }
                  onChange={(selected) =>
                    handleFormDataChange(
                      "city",
                      selected.map((item) => item.value)
                    )
                  }
                  options={city.map((item) => ({
                    value: item,
                    label: item,
                  }))}
                /> */}
              </div>
            </div>

            <div className={styles["form-groups-create"]}>
              <label className={`test-label ${isRequired ? "required" : ""}`}>
                Market Objective{" "}
              </label>
              <textarea
                type="text"
                name="marketObjective"
                value={formData.marketObjective}
                onChange={handleChange}
                placeholder="Mention Market Objective (max 2500 characters)"
                autoComplete="off"
                className={styles["textarea"]}
                maxLength={2500}
                required
                // style={{zIndex:"-1"}}
              />
              {errorMessage.marketObjective && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  {errorMessage.marketObjective}
                </span>
              )}
            </div>

            <div className={styles["form-groups-create"]}>
              <label className={`test-label ${isRequired ? "required" : ""}`}>
                Research Objective{" "}
              </label>
              <textarea
                type="text"
                name="researchObjective"
                className={styles["textarea"]}
                value={formData.researchObjective}
                onChange={handleChange}
                placeholder="Mention Research Objective (max 2500 characters)"
                autoComplete="off"
                maxLength={2500}
                required
                // style={{zIndex:"-1"}}
              />
              {errorMessage.researchObjective && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  {errorMessage.researchObjective}
                </span>
              )}
            </div>
            <div className={styles["form-groups-create"]}>
              <label className={`test-label ${isRequired ? "required" : ""}`}>
              Research Background{" "}
              </label>
              <textarea
                type="text"
                name="researchObjective"
                className={styles["textarea"]}
                value={formData.researchObjective}
                onChange={handleChange}
                placeholder="Mention Research Objective (max 2500 characters)"
                autoComplete="off"
                maxLength={2500}
                required
                // style={{zIndex:"-1"}}
              />
              {errorMessage.researchObjective && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  {errorMessage.researchObjective}
                </span>
              )}
            </div>

            <div className={styles["form-groups-create"]}>
              <label className={`test-label ${isRequired ? "required" : ""}`}>
                Research TG{" "}
              </label>
              <textarea
                // style={{font:"Open Sans",fontWeight:"400", fontSize:"14px"}}
                type="text"
                name="researchTG"
                className={styles["textarea"]}
                value={formData.researchTG}
                onChange={handleChange}
                placeholder="Mention Research TG (max 2500 characters)"
                autoComplete="off"
                maxLength={2500}
                required
              />
              {errorMessage.researchTG && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  {errorMessage}
                </span>
              )}
            </div>

            <div className={styles["form-groups-create"]}>
              <label className={`test-label ${isRequired ? "required" : ""}`}>
                Key Information Area{" "}
              </label>
              <textarea
                type="text"
                name="keyInfoArea"
                className={styles["textarea"]}
                value={formData.keyInfoArea}
                onChange={handleChange}
                placeholder="Mention Key Information Area (max 2500 characters)"
                autoComplete="off"
                required
                maxLength={2500}
              />
              {errorMessage.keyInfoArea && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  {errorMessage}
                </span>
              )}
            </div>

            <div className={styles["form-groups-create"]}>
              <label className={`test-label ${isRequired ? "required" : ""}`}>
                Additional Information{" "}
              </label>
              <textarea
                type="text"
                name="additionalInfo"
                className={styles["textarea"]}
                value={formData.additionalInfo}
                onChange={handleChange}
                placeholder="Mention Additional Information (max 2500 characters)"
                autoComplete="off"
                required
                maxLength={2500}
              />
              {errorMessage.additionalInfo && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  {errorMessage}
                </span>
              )}
            </div>

            <div className={styles["epd-npd-container"]}>
              {formData.studyType === "Product test" ||
              formData.studyType === "Concept test" ||
              formData.studyType === "Pack test" ||
              formData.studyType === "Advertisement test" ||
              formData.studyType === "Brand track" ? (
                <div className={styles["form-row-cre"]}>
                  <div className={styles["form-column"]}>
                    <label
                      className={`test-label ${isRequired ? "required" : ""}`}
                    >
                      Your current project focus on{" "}
                    </label>
                    <select
                      name="currentProjectFocus"
                      value={formData.currentProjectFocus}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled hidden>
                        Select Focus
                      </option>
                      {formData.studyType !== "Brand track" && (
                        <option value="NPD">NPD</option>
                      )}
                      <option value="EPD">EPD</option>
                    </select>
                  </div>
                </div>
              ) : (
                ""
              )}

              {formData.currentProjectFocus === "EPD" &&
                formData.studyType !== "Brand track" && (
                  <div className={styles["form-row-cre"]}>
                    <div className={styles["form-column"]}>
                      <label
                        className={`test-label ${isRequired ? "required" : ""}`}
                      >
                        EPD{" "}
                      </label>
                      <select
                        name="epd"
                        value={formData.epd || ""}
                        onChange={handleChange}
                        required
                      >
                        <option value="" disabled hidden>
                          Select Focus
                        </option>
                        <option value="Relaunch">Relaunch</option>
                        <option value="Single Stage Revamp">
                          Single Stage Revamp
                        </option>
                      </select>
                    </div>
                  </div>
                )}
              {(formData.studyType === "Product test" ||
                formData.studyType === "Pack test" ||
                formData.studyType === "Advertisement test") &&
                formData.currentProjectFocus &&
                formData.epd !== "Single Stage Revamp" && (
                  // formData.currentProjectFocus === "NPD" &&
                  <h5 style={{ display: "flex", alignItems: "center" }}>
                    <ReactSVG src={intimation} style={{ marginRight: "8px" }} />
                    <strong style={{ color: "black", fontFamily: "Open Sans" }}>
                      Please link the previous stage gates.
                    </strong>{" "}
                    <span
                      style={{
                        color: "black",
                        fontFamily: "Open Sans",
                        fontWeight: "400",
                      }}
                    >
                      Click on select file and choose the appropriate file to
                      link
                    </span>
                  </h5>
                )}

              <div className={styles["epd-npd-grid"]}>
                {(formData.epd === "Relaunch" ||
                  formData.currentProjectFocus === "NPD") && (
                  <>
                    {(formData.studyType === "Product test" ||
                      formData.studyType === "Pack test" ||
                      formData.studyType === "Advertisement test") && (
                      <>
                        <div>
                          <label>Stage</label>
                        </div>
                        <div>
                          <label>Select File</label>
                        </div>
                        <div>
                          <label>Reason</label>
                        </div>
                        <div>
                          <label
                            className={`test-label ${
                              isRequired ? "required" : ""
                            }`}
                          >
                            Concept Test
                          </label>
                        </div>

                        <div>
                          <Select
                            styles={customStyles}
                            options={conceptTestOptions}
                            value={
                              conceptTestOptions.find(
                                (option) =>
                                  option.value === formData.conceptTest
                              ) || null
                            }
                            onChange={(selectedOption) =>
                              handleChange({
                                target: {
                                  name: "conceptTest",
                                  value: selectedOption
                                    ? selectedOption.value
                                    : "", // Deselect if no file is chosen
                                },
                              })
                            }
                            isSearchable
                            isClearable
                            menuPortalTarget={document.body}
                            placeholder="Select Concept Test File"
                            components={{
                              Option: (props) => (
                                <div
                                  {...props.innerProps}
                                  className="custom-option"
                                  style={{ position: "relative" }}
                                  title={props.data.label}
                                >
                                  <span
                                    style={{
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      maxWidth: "200px",
                                      display: "inline-block",
                                    }}
                                  >
                                    {props.data.label.length > 20
                                      ? `${props.data.label.substring(
                                          0,
                                          20
                                        )}...`
                                      : props.data.label}
                                  </span>
                                  {formData.conceptTest ===
                                    props.data.value && (
                                    <span
                                      style={{
                                        marginLeft: "10px",
                                        color: "green",
                                      }}
                                    >
                                      ✔
                                    </span>
                                  )}
                                </div>
                              ),
                              SingleValue: ({ data }) => (
                                <div
                                  title={data.label}
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "200px",
                                  }}
                                >
                                  {data.label.length > 20
                                    ? `${data.label.substring(0, 20)}...`
                                    : data.label}
                                </div>
                              ),
                            }}
                          />
                        </div>

                        <div>
                          <textarea
                            name="reason"
                            value={formData.conceptReason || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === "" || value.trim() !== "") {
                                setFormData({
                                  ...formData,
                                  conceptReason: value,
                                });
                              }
                            }}
                            placeholder="Enter Reason"
                            style={{ height: "41px" }}
                            disabled={formData.conceptTest ? true : false}
                          />
                        </div>
                      </>
                    )}

                    {(formData.studyType === "Pack test" ||
                      formData.studyType === "Advertisement test") && (
                      <>
                        {/* <div><label>Stage</label></div>
                      <div><label>Select File</label></div>
                      <div><label>Reason</label></div> */}
                        <div>
                          <label
                            className={`test-label ${
                              isRequired ? "required" : ""
                            }`}
                          >
                            Product Test
                          </label>
                        </div>

                        <div>
                          <Select
                            styles={customStyles}
                            options={productTestOptions}
                            value={
                              productTestOptions.find(
                                (option) =>
                                  option.value === formData.productTest
                              ) || null
                            }
                            onChange={(selectedOption) =>
                              handleChange({
                                target: {
                                  name: "productTest",
                                  value: selectedOption
                                    ? selectedOption.value
                                    : "",
                                },
                              })
                            }
                            isSearchable
                            isClearable
                            menuPortalTarget={document.body}
                            placeholder="Select Product Test File"
                            components={{
                              Option: (props) => (
                                <div
                                  {...props.innerProps}
                                  className="custom-option"
                                  style={{ position: "relative" }}
                                  title={props.data.label}
                                >
                                  <span
                                    style={{
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      maxWidth: "200px",
                                      display: "inline-block",
                                    }}
                                  >
                                    {props.data.label.length > 20
                                      ? `${props.data.label.substring(
                                          0,
                                          20
                                        )}...`
                                      : props.data.label}
                                  </span>
                                  {formData.productTest ===
                                    props.data.value && (
                                    <span
                                      style={{
                                        marginLeft: "10px",
                                        color: "green",
                                      }}
                                    >
                                      ✔
                                    </span>
                                  )}
                                </div>
                              ),
                              SingleValue: ({ data }) => (
                                <div
                                  title={data.label}
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "200px",
                                  }}
                                >
                                  {data.label.length > 20
                                    ? `${data.label.substring(0, 20)}...`
                                    : data.label}
                                </div>
                              ),
                            }}
                          />
                        </div>

                        <div>
                          <textarea
                            name="productTestReason"
                            value={formData.productReason || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === "" || value.trim() !== "") {
                                setFormData({
                                  ...formData,
                                  productReason: value,
                                });
                              }
                            }}
                            placeholder="Enter Reason"
                            style={{ height: "41px" }}
                            disabled={formData.productTest ? true : false}
                          />
                        </div>
                      </>
                    )}

                    {formData.studyType === "Advertisement test" && (
                      <>
                        {/* <div><label>Stage</label></div>
                        <div><label>Select File</label></div>
                        <div><label>Reason</label></div> */}
                        <div>
                          <label
                            className={`test-label ${
                              isRequired ? "required" : ""
                            }`}
                          >
                            Pack Test
                          </label>
                        </div>

                        <div>
                          <Select
                            styles={customStyles}
                            options={packTestOptions}
                            value={packTestOptions.find(
                              (option) => option.value === formData.packTest
                            )}
                            onChange={(selectedOption) =>
                              handleChange({
                                target: {
                                  name: "packTest",
                                  value: selectedOption
                                    ? selectedOption.value
                                    : "",
                                },
                              })
                            }
                            isSearchable
                            isClearable
                            placeholder="Select Pack Test File"
                            menuPortalTarget={document.body}
                            components={{
                              Option: (props) => (
                                <div
                                  {...props.innerProps}
                                  className="custom-option"
                                  style={{ position: "relative" }}
                                  title={props.data.label}
                                >
                                  <span
                                    style={{
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      maxWidth: "200px",
                                      display: "inline-block",
                                    }}
                                  >
                                    {props.data.label.length > 20
                                      ? `${props.data.label.substring(
                                          0,
                                          20
                                        )}...`
                                      : props.data.label}
                                  </span>
                                  {formData.packTest === props.data.value && (
                                    <span
                                      style={{
                                        marginLeft: "10px",
                                        color: "green",
                                      }}
                                    >
                                      ✔
                                    </span>
                                  )}
                                </div>
                              ),
                              SingleValue: ({ data }) => (
                                <div
                                  title={data.label}
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "200px",
                                  }}
                                >
                                  {data.label.length > 20
                                    ? `${data.label.substring(0, 20)}...`
                                    : data.label}
                                </div>
                              ),
                            }}
                          />
                        </div>

                        <div>
                          <textarea
                            name="packTestReason"
                            value={formData.packReason || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (
                                value === "" ||
                                value === "" ||
                                value.trim() !== ""
                              ) {
                                setFormData({
                                  ...formData,
                                  packReason: value,
                                });
                              }
                            }}
                            placeholder="Enter Reason"
                            style={{ height: "41px" }}
                            disabled={formData.packTest ? true : false}
                          />
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className={styles["form-groups-create full-width"]}>
              <label className={`test-label ${isRequired ? "required" : ""}`}>
                Attachments (Stimulus)
              </label>
              <input
                type="file"
                ref={fileInputRef}
                name="file_attachment"
                onChange={handleFileChange}
                required
              />
            </div>
            <div className={styles["form-actions"]}>
              <button
                type="button"
                className={styles["cancel-btn"]}
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles["submit-button"]}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting.." : "Submit"}
              </button>
            </div>
          </form>

          <Modal
            show={isSuccessOpen}
            onClose={handleCloseModal}
            title={modalContent.title}
            message={modalContent.message}
            type={modalContent.type}
            onContinue={handleContinue}
            onTryAgain={handleTryAgain}
          />

          {isWarningOpen && (
            <div className={styles["success-popup"]}>
              <div className={styles["success-popup-content"]}>
                <div className={styles["-success-popup-header"]}>
                  <h3>
                    <ReactSVG src={actionIcon} />
                    Action Required{" "}
                  </h3>
                </div>
                <p>
                  Cannot submit brief without completing previous stage gates.If
                  you still want to proceed,please provide reason and submit.
                </p>
                <button
                  className={styles["success-popup-ok-button"]}
                  onClick={closeWarningPopup}
                >
                  OK
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default NewBrief;
