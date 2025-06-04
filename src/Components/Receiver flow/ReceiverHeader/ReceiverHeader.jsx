import React from 'react';
import './ReceiverHeader.scss';
// import User from '../../Components/assets/images/man.png'
import logocavin from '../../../Components/assets/images/logo cavincare.png'
import user from '../../assets/svg/addUser.svg'
import { ReactSVG } from 'react-svg';

const ReceiverHeader = () => {
  const role = localStorage.getItem('user_name')
  return (
    <header className="header">
      <div className="header-content">
        <img src={logocavin} className="logo-img" />
        <h1 className="header-title">Brief Approval Portal</h1>   
        <span></span>       
        <div className="header-right">          
          <div className="user-info">
            <div className="user-avatar">      
              <ReactSVG src={user}/>
            </div>
            <div className="user-details">
              <span className="username">{role}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ReceiverHeader;
