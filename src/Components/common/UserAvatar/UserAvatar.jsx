import React from 'react';
import s from "./UserAvatar.module.scss";

const UserAvatar = ({ item }) => {
  const backgroundColors = ['#FFCCBC', '#B2DFDB', '#FFAB91', '#FFD180', '#80DEEA', '#CF93A5'];
  return (
    <div>
      <div className="d-flex gap-1 align-items-center">
        <div className={s.userAvatarList}>
          {item?.map((id, index) => {
            const randomIndex = Math.floor(Math.random() * backgroundColors.length);
            const backgroundColor = backgroundColors[randomIndex];
            return (
              <div key={index} className={s.item} data={id} style={{ backgroundColor }} />
            );
          })}
          {/* {item?.length > 4 && (
            <div className="ms-1 mt-1">{`+${item?.length - 4}`}</div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default UserAvatar;
