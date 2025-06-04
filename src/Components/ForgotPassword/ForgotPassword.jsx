import React, { useEffect, useState } from "react";
import s from "./ForgotPassword.module.scss";
import loginPoster from "../assets/images/loginck.jpg";
import Inputs from "../common/Inputs/Inputs";
import logo from "../assets/images/login_logo.png";
import backArrow from "../assets/svg/signbackArrow.svg";
import Button from "../common/Button/Button";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  forgotPassword,
  updateForgotPassword,
  updateResetMessage,
} from "../../store/features/authorization";
import cx from "classnames";
import { ReactSVG } from "react-svg";
import Modal from "../common/Modal/Modal";
import { getBriefInput } from "../../store/features/briefsData";
// import ForgotPassword from "../ForgotPassword/ForgotPassword";

function ForgotPassword() {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    type: "",
  });

  const successMessage = useSelector(
    (state) => state?.authorization?.successMessage
  );
  console.log({ successMessage });
  const errorMessage = useSelector(
    (state) => state?.authorization?.errorMessage
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [rememberMe, setRememberMe] = useState(false);

  // const isForgotPassword = useSelector(
  //   (state) => state?.authorization?.forgotPassword
  // );
  // const errorMessage = useSelector(
  //   (state) => state?.authorization?.errorMessage
  // );
  const redirectTo = useSelector((state) => state?.authorization?.redirectTo);
  const dropdown = useSelector((state) => state?.briefs?.inputValue);
  const roles_departments = dropdown?.roles_departments;

  useEffect(() => {
      dispatch(updateResetMessage()); 
    }, [dispatch]);
    
  useEffect(() => {
      dispatch(getBriefInput()); 
    }, [dispatch]);

  useEffect(() => {
    const savedEmail = sessionStorage.getItem("email");
    const savedRememberMe = sessionStorage.getItem("rememberMe") === "true";

    if (savedEmail && savedRememberMe) {
      setValue("email", savedEmail);
      setRememberMe(true);
    }
  }, [setValue]);

  useEffect(() => {
    if (redirectTo) {
      navigate(redirectTo);
    }
  }, [redirectTo, navigate]);

  useEffect(() => {
    if (successMessage === 200 || successMessage === 201) {
      setModalContent({
        title: "Password reset",
        message:
          "Your Password reset link sent your registered email successfully",
        type: "success",
      });
      setShowModal(true);
      reset();
    } else if (errorMessage) {
      setModalContent({
        title: "Password reset",
        message: errorMessage || "Failed to set the new password",
        type: "failure",
      });
      setShowModal(true);
      // setFormSubmitted(false);
      // dispatch(updateResetMessage());
    }
  }, [successMessage, errorMessage, reset, dispatch]);

  const onSubmit = (data) => {
    console.log("data", data.email);
    if (rememberMe) {
      sessionStorage.setItem("email", data.email);
      sessionStorage.setItem("rememberMe", true);
    } else {
      sessionStorage.removeItem("email");
      sessionStorage.removeItem("rememberMe");
    }

    dispatch(forgotPassword({ ...data }));
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleTryAgain = () => {
    setShowModal(false);
    window.location.reload()
  };

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    // setSelectedRole(selectedRole);

    if (roles_departments && selectedRole) {
      setDepartments(roles_departments[selectedRole] || []);
    } else {
      setDepartments([]);
    }
  };

  return (
    <div className={cx(s.main)}>
      <div className={cx(s.imgSection)}>
        <img src={loginPoster} height="1080" alt="Login Poster" />
      </div>
      <div className={cx(s.loginPartForgot)}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={cx(s.logo)}>
            <img src={logo} alt="Logo" />
          </div>
          <div className={cx(s.divisions, "text-center")}>
            <p className={s.loginTxt}>Forgot your password</p>
            <p className={s.txt}>Enter your email to reset it</p>
          </div>
          {/* {errorMessage && (
            <div className={s.errorMessage}>
              <span>{errorMessage}</span>
            </div>
          )} */}
          <div className={s.inputText}>
            <Inputs
              label="Email"
              labelClassName={s.label}
              register={register}
              inputClassName={s.input}
              name="email"
              autoComplete="off"
              placeholder="Enter your Email"
              validation={{
                required: "*Required",
                pattern: {
                  value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                  message: "Invalid Email ID",
                },
              }}
            />
            {errors.email && (
              <span role="alert" className={s.errorText}>
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="inputText">
            <label className={s.label}>Role</label>
            <select
              {...register("role", { required: "*Required" })}
              className={s.input}
              onChange={handleRoleChange}
            >
              <option value="">Select Role</option>
              {roles_departments &&
                Object.keys(roles_departments).map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
            </select>
            {errors.role && (
              <span role="alert" className={s.errorText}>
                {errors.role.message}
              </span>
            )}
          </div>

          <div
            className={cx(s.divisions)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          ></div>

          <div className={cx(s.divisions)}>
            <Button
              label="Confirm"
              type="submit"
              style={{
                width: "400px",
                backgroundColor: "blue",
                color: "white",
                fontWeight: "600",
                fontSize: "18px",
              }}
            />
          </div>
          <div
            style={{ display: "flex", alignItems: "center", marginTop: "20px" }}
          >
            <ReactSVG src={backArrow} style={{ marginRight: "8px" }} />
            <Link
              to="/"
              style={{
                textDecoration: "none",
                color: "#01161E",
                fontWeight: "400",
                fontSize: "12px",
              }}
            >
              Return back to sign in page
            </Link>
          </div>
        </form>
        {/* <div style={{fontWeight:"100"}}>
              <p>© 2025 CavinKare Private Limited</p>
              </div> */}
      </div>
      <Modal
        show={showModal}
        onClose={handleCloseModal}
        title={modalContent.title}
        message={modalContent.message}
        type={modalContent.type}
        onContinue={handleTryAgain}
        onTryAgain={handleTryAgain}
      />
      {/* {isForgotPassword && <ForgotPassword />} */}
    </div>
  );
}

export default ForgotPassword;
