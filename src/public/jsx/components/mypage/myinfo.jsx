import React from 'react';
import '../../components/mypage/mypage.css';

const MyInfo = () => {
  return (
    <div className="myinfo_first">
      <div className="flex items-center justify-between mb-2">
        <p className="myinfo_nickname">닉네임</p>
        <p className="myinfo_edit">수정</p>
        <span className="myinfo_mynickname">낭만이란배를타고떠나갈거야어디까지써지는</span>
      </div>
      <div className="myinfo_sign">
        <p className="myinfo_signselect">가입방식</p>
        <p className="myinfo_signmenu">kakao</p>
      </div>
      <p className="myinfo_signout">회원탈퇴</p>
    </div>
  );
};

export default MyInfo;
