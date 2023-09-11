document.addEventListener('DOMContentLoaded', () => {
  headerBtns();
});

const writingPost = async () => {
  const form = document.querySelector('#form');
  const authorization = document.querySelector('.Authorization');
  authorization.value = sessionStorage.getItem('Authorization');
  const formData = new FormData(form);
  const response = await fetch(`./api/posts`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  alert(code[data.responseData.code]);

  if (data.responseData.code === 311) {
    location.href = `./`;
  }
};

// 헤더버튼들
const headerBtns = () => {
  const login = document.querySelector('.login');
  const logout = document.querySelector('.logout');
  const mypage = document.querySelector('.mypage');

  if (sessionStorage.getItem('Authorization')) {
    logout.style.display = 'block';
    mypage.style.display = 'block';
  } else {
    login.style.display = 'block';
  }
};

// 취소 버튼 누를시 이전 페이지로 이동
const cancelPost = async () => {
  window.history.back();
};

// 버튼들
const buttons = () => {
  const login = document.querySelector('.login');
  const logout = document.querySelector('.logout');
  const mypage = document.querySelector('.mypage');

  if (sessionStorage.getItem('Authorization')) {
    logout.style.display = 'block';
    mypage.style.display = 'block';
  } else {
    login.style.display = 'block';
  }
};

// 로그아웃 버튼 누를시
const logout = async () => {
  const response = await fetch(`./api/logout`, {
    method: 'POST',
    headers: {
      Authorization: sessionStorage.getItem('Authorization'),
    },
  });
  const result = await response.json();

  alert(code[result.responseData.code]);
  sessionStorage.removeItem('Authorization');
  location.href = `./`;
};
