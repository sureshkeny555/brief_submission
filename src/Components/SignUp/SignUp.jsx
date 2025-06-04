import React, { useEffect, useState } from "react";
import s from "./SignUp.module.scss";
import loginPoster from "../assets/images/loginck.jpg";
import Inputs from "../common/Inputs/Inputs";
import logo from "../assets/images/cavin_care.png";
import Button from "../common/Button/Button";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateResetMessage, userSignUp } from "../../store/features/authorization";
import cx from "classnames";
import Modal from "../common/Modal/Modal";
import { getBriefInput } from "../../store/features/briefsData";

function Signup() {
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
    type: ""
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [departments, setDepartments] = useState([]); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const successMessage = useSelector((state) => state?.authorization?.successMessage);
  const errorMessage = useSelector((state) => state?.authorization?.errorMessage); 
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
    setEmail('');
    setPassword('');
  }, []);

  useEffect(() => {
    if (successMessage === 201) {
      setModalContent({
        title: "Account Created",
        message: "Your account has been created successfully!",
        type: "success"
      });
      setShowModal(true);
      reset();
      setFormSubmitted(false); 
      dispatch(updateResetMessage());
    } else if (errorMessage) {
      setModalContent({
        title: "Sign-up Failed",
        message: errorMessage || "Failed to signup",
        type: "failure"
      });
      setShowModal(true);
      setFormSubmitted(false); 
      dispatch(updateResetMessage());
    }
  }, [successMessage, errorMessage, reset, dispatch]);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (redirectTo) {
      navigate(redirectTo);
    }
  }, [redirectTo, navigate]);

  const onSubmit = (data) => {
    setFormSubmitted(true);
    dispatch(userSignUp({ ...data }));
  
  };
  const handleContinue = () => {
    navigate('/');
  };
  
  const handleTryAgain = () => {
    setShowModal(false);
  };

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setSelectedRole(selectedRole); 

    if (roles_departments && selectedRole) {
      setDepartments(roles_departments[selectedRole] || []);
    } else {
      setDepartments([]);
    }
  };

  return (
    <div className={cx(s.main)}>
      <div className={cx(s.imgSection)}>
        <img src={loginPoster} alt="Login Poster" />
      </div>

      <div className={cx(s.loginPart)}>
        <div className={cx(s.loginContent)}>
          <div className={s.frame}>
            <div className={s.header}>
              <div className={cx(s.logo)}>
                <img src={logo} alt="Logo" />
              </div>
              <div className={cx(s.divisions)}>
                <p className={s.loginTxt}>Get Started</p>
                <p className={s.txt}>Create your account now</p>
              </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className={cx(s.doubleInput)}>
                <div className={s.halfWidth}>
                  <Inputs
                    label="First Name"
                    labelClassName={s.label}
                    register={register}
                    inputClassName={s.input}
                    name="firstName"
                    autoComplete="off"
                    placeholder="First Name"
                    validation={{
                      required: "*Required",
                    }}
                  />
                </div>
                <div className={s.halfWidth}>
                  <Inputs
                    label="Last Name"
                    labelClassName={s.label}
                    register={register}
                    inputClassName={s.input}
                    name="lastName"
                    autoComplete="off"
                    placeholder="Last Name"
                    validation={{
                      required: "*Required",
                    }}
                  />
                </div>
              </div>

              <div className="inputText">
                <Inputs
                  label="Email"
                  labelClassName={s.label}
                  register={register}
                  inputClassName={s.input}
                  name="email"
                  autoComplete="off"
                  placeholder="Email ID"
                  validation={{
                    required: "*Required",
                    pattern: {
                      value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i,
                      message: "Invalid Email ID",
                    },
                  }}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && (
                  <span role="alert" className={s.errorText}>
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className="inputText">
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
                  onChange={(e) => setPassword(e.target.value)}
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
                  onChange={handleRoleChange} 
                >
                  <option value="">Select Role</option>
                  {roles_departments && Object.keys(roles_departments).map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                {errors.role && (
                  <span role="alert" className={s.errorText}>
                    {errors.role.message}
                  </span>
                )}
              </div>

              <div className="inputText">
                <label className={s.label}>Department</label>
                <select
                  {...register("department", { required: "*Required" })}
                  className={s.input}
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <span role="alert" className={s.errorText}>
                    {errors.department.message}
                  </span>
                )}
              </div>
              {/* </div> */}
            

              {/* <div className={cx(s.divisions)}> */}
              <div className={cx(s.signupSec)}>
                <Button
                  label="Sign up"
                  type="submit"
                  style={{
                    width: "420px",
                    backgroundColor: "blue",
                    color: "white",
                    fontWeight: "600",
                    fontSize: "18px",
                    marginTop: "30px",
                  }}
                />
                </div>
               </form>
            
            <p style={{alignItems:"center", display:"flex", marginLeft:"84px",marginTop:"80px", gap:"8px"}}>
                Already have an account? <Link to="/" style={{textDecoration:"none", color:"#004EFF"}}>Sign in</Link>
              </p>
           
            <div style={{ marginTop: "270px", marginLeft: "80px", fontWeight: "100" }}>
              <p>© 2025 CavinKare Private Limited</p>
            </div>
          </div>
          <Modal
            show={showModal}
            onClose={handleCloseModal}
            title={modalContent.title}
            message={modalContent.message}
            type={modalContent.type}
            onContinue={handleContinue}
            onTryAgain={handleTryAgain}
          />
        </div>
      </div>
    </div>
  );
}

export default Signup;
