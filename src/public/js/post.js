document.addEventListener('DOMContentLoaded', () => {
  headerBtns();
});

const writingPost = async () => {
  const annualCategory = document.querySelector('.annualcategory').value;
  const title = document.querySelector('.post_title').value;
  const content = document.querySelector('.post_content').value;
  const img = document.querySelector('.post_img').value;

  const response = await fetch(`./api/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('Authorization'),
    },
    body: JSON.stringify({ title, content, annualCategory, img }),
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

  if (localStorage.getItem('Authorization')) {
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
      Authorization: localStorage.getItem('Authorization'),
    },
  });
  const result = await response.json();

  alert(code[result.responseData.code]);
  localStorage.removeItem('Authorization');
  location.href = `./`;
};

// 취소 버튼 누를시 이전 페이지로 이동
const cancelPost = async () => {
  window.history.back();
};
