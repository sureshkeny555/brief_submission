import React, { useEffect, useState } from "react";
import s from "./NewPassword.module.scss";
import loginPoster from "../assets/images/loginck.jpg";
import Inputs from "../common/Inputs/Inputs";
import logo from "../assets/images/login_logo.png";
import backArrow from "../assets/svg/signbackArrow.svg";
import Button from "../common/Button/Button";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as jwt_decode from "jwt-decode";
// import { toast } from "react-toastify";
import { forgotPassword, updateResetMessage } from "../../store/features/authorization";
import cx from "classnames";
import { ReactSVG } from "react-svg";
import Modal from "../common/Modal/Modal";

const isTokenExpired = (decodedToken) => {
  const currentTime = Math.floor(Date.now() / 1000);
  return decodedToken?.exp < currentTime;
};

function NewPassword() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    type: "",
  });

  const successMessage = useSelector(
    (state) => state?.authorization?.successMessage
  );
  const errorMessage = useSelector(
    (state) => state?.authorization?.errorMessage
  );

  const getTokenFromUrl = () => {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get("token");
  };

  const token = getTokenFromUrl();
  console.log("Token:", token);

  // let decodedToken;
  // try {
  //   decodedToken = jwt_decode(token);
  //   console.log("Decoded Token:", decodedToken);

  //   if (isTokenExpired(decodedToken)) {
  //     toast.error("Token is expired.");
  //     return <div>Token is expired.</div>;
  //   }
  // } catch (error) {
  //   toast.error("Invalid or expired token.");
  //   // return <div>Token is invalid or expired.</div>;
  // }
  useEffect(() => {
      dispatch(updateResetMessage()); 
    }, [dispatch]);

  useEffect(() => {
    if (successMessage === 200) {
      setModalContent({
        title: "Password reset",
        message: "Your Password reset successfully",
        type: "success",
      });
      setShowModal(true);
      reset();
    } else if (errorMessage) {
      setModalContent({
        title: "Password reset",
        message: errorMessage || "Failed",
        type: "failure",
      });
      setShowModal(true);
    }
  }, [successMessage, errorMessage, reset, dispatch]);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleTryAgain = () => {
    // setFormSubmitted(false); 
    // setEmail(''); 
    // setPassword('');
    setShowModal(false);
  };

  // const { user_email, role } = decodedToken || {};

  const newPassword = watch("newPassword", "");
  const confirmPassword = watch("confirmPassword", "");

  const onSubmit = (data) => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    console.log({token})
    dispatch(
      forgotPassword({
        ...data,
      },
      token
    )
    );
  };

  return (
    <div className={cx(s.main)}>
      <div className={cx(s.imgSection)}>
        <img src={loginPoster} height="1080" alt="Login Poster" />
      </div>
      <div className={cx(s.loginPart)}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={cx(s.logo)}>
            <img src={logo} alt="Logo" />
          </div>
          <div className={cx(s.divisions, "text-center")}>
            <p className={s.loginTxt}>Forgot your Password</p>
            <p className={s.txt}>Enter your new password</p>
          </div>
          <div className={s.inputText}>
            <Inputs
              label="Enter New Password"
              labelClassName={s.label}
              inputClassName={s.input}
              name="newPassword"
              autoComplete="off"
              placeholder="******"
              password={true}
              passwordIcon={true}
              error={errors.newPassword}
              register={register}
              validation={{
                required: "*Password is required",
              }}
            />
            {errors.newPassword && (
              <span role="alert" className={s.errorText}>
                {errors.newPassword.message}
              </span>
            )}
          </div>
          <div className={s.inputText}>
            <Inputs
              label="Confirm Password"
              labelClassName={s.label}
              inputClassName={s.input}
              name="confirmPassword"
              autoComplete="off"
              placeholder="******"
              password={true}
              passwordIcon={true}
              error={errors.confirmPassword}
              register={register}
              validation={{
                required: "*Confirm password is required",
                validate: (value) =>
                  value === newPassword || "Passwords do not match",
              }}
            />
            {errors.confirmPassword && (
              <span role="alert" className={s.errorText}>
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          <div className={cx(s.divisions)}>
            <Button
              label="Reset Password"
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
        <Modal
          show={showModal}
          onClose={handleCloseModal}
          title={modalContent.title}
          message={modalContent.message}
          type={modalContent.type}
          onContinue={handleTryAgain}
        />
      </div>
    </div>
  );
}

export default NewPassword;
