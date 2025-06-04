// import React from "react";
// import cx from "classnames";
// import s from "./Modal.module.scss";
// import successIcon from '../../assets/svg/signupsuccess.svg'; 
// import failureIcon from '../../assets/svg/signupfailure.svg'; 
// import signupClose from '../../assets/svg/signupclose.svg'; 
// import { ReactSVG } from "react-svg";

// function Modal({ show, onClose, title, message, type, onContinue, onTryAgain }) {
//   if (!show) return null; 

//   const modalTypeClass = type === "success" ? s.success : s.failure;
//   const buttonText = type === "success" ? "Continue" : "Try Again";
//   const buttonAction = type === "success" ? onContinue : onTryAgain; 

//   return (
//     <div className={cx(s.modalOverlay)}>
//       <div className={cx(s.modal, modalTypeClass)}>
//         <div className={s.modalHeader}>
//           {type === "success" && <ReactSVG src={successIcon} alt="Success" className={s.icon} />} 
//           {type === "failure" && <ReactSVG src={failureIcon} alt="Failure" className={s.icon} />}
//           <h2 className={s.modalTitle}>{title}</h2>
//           <button onClick={onClose} className={s.closeBtn}>
//             <ReactSVG src={signupClose} style={{ width: "24px", height: "24px" }} />
//           </button>
//         </div>
//         <div className={s.modalBody}>
//           <p>{message}</p>
//         </div>
//         <div className={s.modalFooter}>
//           <button onClick={buttonAction} className={s.okBtn}>
//             {buttonText}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Modal;

import React from "react";
import cx from "classnames";
import s from "./Modal.module.scss";
import successIcon from '../../assets/svg/signupsuccess.svg'; 
import failureIcon from '../../assets/svg/signupfailure.svg'; 
import signupClose from '../../assets/svg/signupclose.svg'; 
import { ReactSVG } from "react-svg";

function Modal({ show, onClose, title, message, type, onContinue, onTryAgain }) {
  if (!show) return null; 

  const modalTypeClass = type === "success" ? s.success : s.failure;
  const buttonText = type === "success" ? "Continue" : "Try Again";
  const buttonAction = type === "success" ? onContinue : onTryAgain; 

  return (
    <div className={cx(s.modalOverlay)}>
      <div className={cx(s.modal, modalTypeClass)}>
        <div className={s.modalHeader}>
          {type === "success" && <ReactSVG src={successIcon} alt="Success" className={s.icon} />} 
          {type === "failure" && <ReactSVG src={failureIcon} alt="Failure" className={s.icon} />}
          <h2 className={s.modalTitle}>{title}</h2>
          <button onClick={onClose} className={s.closeBtn}>
            <ReactSVG src={signupClose} style={{ width: "24px", height: "24px" }} />
          </button>
        </div>
        <div className={s.modalBody}>
          <p>{message}</p>
        </div>
        <div className={s.modalFooter}>
          <button onClick={buttonAction} className={s.okBtn}>
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
