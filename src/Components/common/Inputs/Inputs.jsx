import { Form } from "react-bootstrap";
import { useState } from "react";
import eyeIcon from "../../assets/svg/eye.svg";
import eyeHidden from "../../assets/svg/eyeHidden.svg";
import s from "./Input.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";
import { ReactSVG } from "react-svg";

export default function Inputs(props) {
  const {
    label,
    mutedText,
    error,
    showError = false,
    validation = {},
    type = "text",
    placeholder,
    register = () => ({}),
    name,
    inputClassName = "",
    inputGroupClassname = "",
    autofocus,
    passwordIcon = false,
    password = false,
  } = props || {};

  const [isPasswordVisible, setIsPasswordVisible] = useState(true);

  const additionalAttributes = {};
  if (type === "textarea") {
    additionalAttributes.as = "textarea";
    additionalAttributes.rows = 4;
  }

  return (
    <Form.Group
      className={cx(inputGroupClassname, s.input)}
      controlId="formBasicEmail"
    >
      {label ? <Form.Label className={s.text}>{label}</Form.Label> : ""}
      <div className={s.inputContainer}>
        {passwordIcon && (
          <ReactSVG
            src={isPasswordVisible ? eyeIcon : eyeHidden}
            className={s.icon}
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          />
        )}
        <Form.Control
          autoFocus={autofocus}
          className={inputClassName}
          type={password && isPasswordVisible ? "password" : "text"}
          {...additionalAttributes}
          placeholder={placeholder}
          {...register(name, validation)}
          autoComplete="off"
        />
      </div>
      {mutedText ? (
        <Form.Text className="text-muted">{mutedText}</Form.Text>
      ) : (
        ""
      )}
      {showError && error ? (
        <div className={s.errorText}>{error?.name?.message}</div>
      ) : (
        ""
      )}
    </Form.Group>
  );
}
