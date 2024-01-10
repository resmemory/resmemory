import React from 'react';
import '../../components/mypage/card.css';

const Card = () => {
  return (
    <div className="card">
      <div className="p-6">
        <div className="cardHeader">
          <div className="avatarContainer">
            <img src="/placeholder.svg" alt="User avatar" className="avatar" />
          </div>
          <div className="userInfo">
            <span className="text-sm font-semibold">2000's</span>
            <span className="text-xs text-gray-500">엣쥐(Edge)</span>
          </div>
          <div className="flex items-center space-x-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 text-red-500"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
            </svg>
            <span className="text-xs font-medium">14</span>
          </div>
        </div>
        <img src="#" alt="Post image" className="postImage" />
        <p className="postContent">글자수표시제한10자</p>
        <span className="postDate">2023.10.10</span>
      </div>
    </div>
  );
};

export default Card;
