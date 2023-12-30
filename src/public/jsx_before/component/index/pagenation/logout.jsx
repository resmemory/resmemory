import React from 'react';

function LogoutButton() {
  const handleLogout = async () => {
    try {
      const response = await fetch(`./api/logout`, {
        method: 'POST',
        headers: {
          Authorization: sessionStorage.getItem('Authorization'),
        },
      });

      const result = await response.json();
      alert(code[result.responseData.code]);
      sessionStorage.removeItem('Authorization');
      window.location.href = `./`;
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <button onClick={handleLogout}>로그아웃</button>
  );
}

export default LogoutButton;
