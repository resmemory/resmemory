import React from 'react';
import { Link } from 'react-router-dom';

function Logo() {
  const handleLogoClick = () => {
    sessionStorage.removeItem('viewCountMode');
    sessionStorage.removeItem('annualViewCountMode');
  };

  return (
    <Link to="/" onClick={handleLogoClick}>
      <img src="logo.png" alt="로고" />
    </Link>
  );
}

export default Logo;
