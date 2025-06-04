import React, { useEffect, useState } from "react";
import s from "./Login.module.scss";
import loginPoster from "../assets/images/loginck.jpg";
import Inputs from "../common/Inputs/Inputs";
import logo from "../assets/images/login_logo.png";
import Button from "../common/Button/Button";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  updateForgotPassword,
  updateResetMessage,
  userLogin,
} from "../../store/features/authorization";
import cx from "classnames";
import { getBriefInput } from "../../store/features/briefsData";
import Modal from "../common/Modal/Modal";
// import {showSuccessToast,showErrorToast} from '../common/ToastNotification/Toast.js'
// import { ToastContainer } from "react-toastify";

function Login() {
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

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [rememberMe, setRememberMe] = useState(false);

  const successMessage = useSelector(
    (state) => state?.authorization?.successMessage
  );
  const errorMessage = useSelector(
    (state) => state?.authorization?.errorMessage
  );
  const redirectTo = useSelector((state) => state?.authorization?.redirectTo);
  const dropdown = useSelector((state) => state?.briefs?.inputValue);
  const roles_departments = dropdown?.roles_departments;

  useEffect(() => {
    const token = localStorage.getItem("token"); 
    const userRole = localStorage.getItem("role"); 
    
    if (token) {
     
      if (userRole === "Creator") {
        navigate("/layout/createbrief"); 
      } else if (userRole === "Project Coordinator") {
        navigate("/receiverlayout/todaydeadline"); 
      } 
      else if (userRole === "Admin") {
        navigate("/receiverlayout/todaydeadline"); 
      }
      else if (userRole === "Super Admin") {
        navigate("/receiverlayout/todaydeadline"); 
      }
      else {
        navigate("/"); 
      }
    }
  }, [navigate]);
  

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
    if (successMessage === 201) {
      setModalContent({
        title: "Account Created",
        message: "Your account has been created successfully!",
        type: "success",
      });
      setShowModal(true);
      reset();
      setFormSubmitted(false);
      dispatch(updateResetMessage());
    } else if (errorMessage) {
      setModalContent({
        title: "Log-in Failed",
        message: errorMessage || "Failed to signup",
        type: "failure",
      });
      setShowModal(true);
      dispatch(updateResetMessage());
    }
  }, [successMessage, errorMessage, reset, dispatch]);

  const onSubmit = (data) => {
    if (rememberMe) {
      sessionStorage.setItem("email", data.email);
      sessionStorage.setItem("rememberMe", true);
    } else {
      sessionStorage.removeItem("email");
      sessionStorage.removeItem("rememberMe");
    }

    dispatch(userLogin({ ...data, rememberMe }))
    // .unwrap()
    .then(() => {
      // showSuccessToast("Login successful!", "success");
    })
    .catch((error) => {
      showErrorToast(error?.message || "Login failed!", "error");
    });
  };

  const handleCheckboxChange = (e) => {
    setRememberMe(e.target.checked);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleTryAgain = () => {
    setShowModal(false);
  };
  const handleForgotPassword = () => {
    dispatch(updateResetMessage()); // Clear error messages before navigation
    navigate("/forgotpassword");
  };

  return (
    <div className={cx(s.main)}>
      <div className={cx(s.imgSection)}>
        <img src={loginPoster} height="1080" alt="Login Poster" />
      </div>
      <div className={cx(s.loginPart)}>
        <form className={cx(s.formlog)} onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <div className={cx(s.logo)}>
            <img src={logo} alt="Logo" />
          </div>
          <div className={cx(s.divisions, "text-center")}>
            <p className={s.loginTxt}>Welcome Back</p>
            <p className={s.txt}>Please enter your details</p>
          </div>
          <div className={s.inputText}>
            <Inputs
              label="UserName"
              labelClassName={s.label}
              register={register}
              inputClassName={s.input}
              name="email"
              autoComplete="off"
              placeholder="Please Enter Email ID"
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
          <div className={s.inputText}>
            <Inputs
              label="Password"
              labelClassName={s.label}
              register={register}
              inputClassName={s.input}
              name="password"
              autoComplete="off"
              placeholder="******"
              validation={{
                required: "*Required",
              }}
              password={true}
            />
            {errors.password && (
              <span role="alert" className={s.errorText}>
                {errors.password.message}
              </span>
            )}
          </div>
          <div className="inputText">
            <label className={s.label}>Role</label>
            <select
              {...register("role", { required: "*Required" })}
              className={s.input}
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
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={handleCheckboxChange}
                style={{
                  backgroundColor: "blue",
                  width: "auto",
                  height: "auto",
                  marginRight: "8px",
                }}
              />
              <span>Remember me</span>
            </div>

            <div>
              <span
                onClick={handleForgotPassword}
                style={{
                  textDecoration: "none",
                  color: "#004EFF",
                  cursor: "pointer",
                }}
              >
                Forgot password
              </span>
            </div>
          </div>

          <div className={cx(s.divisions)}>
            <Button
              label="Sign in"
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
          <p
            style={{
              alignItems: "center",
              display: "flex",
              marginLeft: "84px",
              gap: "8px",
              marginTop:"10px"
            }}
          >
            Don't have an account?{" "}
            <Link
              to="/signup"
              style={{ textDecoration: "none", color: "#004EFF" }}
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
      <Modal
        show={showModal}
        onClose={handleCloseModal}
        title={modalContent.title}
        message={modalContent.message}
        type={modalContent.type}
        onTryAgain={handleTryAgain}
      />
    </div>
  );
}

export default Login;
