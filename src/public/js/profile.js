code = { 131: '로그아웃에 성공하였습니다.', 100: '일시적인 오류가 발생하였습니다.' };

document.addEventListener('DOMContentLoaded', () => {
  headerBtns();
  bookmarks();
});

function headerBtns() {
  const login = document.querySelector('.login');
  const logout = document.querySelector('.logout');
  if (localStorage.getItem('Authorization')) {
    logout.style.display = 'block';
  } else {
    login.style.display = 'block';
  }
}

async function logout() {
  const response = await fetch(`./api/logout`, {
    method: 'POST',
    headers: {
      Authorization: localStorage.getItem('Authorization'),
    },
  });
  const result = await response.json();
  console.log(result);
  alert(code[result.responseData.code]);
  localStorage.removeItem('Authorization');
  location.reload();
}

async function bookmarks() {
  const response = await fetch(`./api/bookmarks`, {
    method: 'GET',
    headers: {
      Authorization: localStorage.getItem('Authorization'),
    },
  });
  const result = await response.json();
  console.log(result);
  const bookmarks = result.responseData.bodies[0]
    .map((bookmark) => {
      return `
    <div>
    ${bookmark.annualCategory}   
    ${bookmark.title}   
    ${bookmark.viewCount}   
    ${bookmark.createdAt}
    </div>
    `;
    })
    .join('');
  const target = document.querySelector('.bookmarks');
  target.innerHTML = bookmarks;
}
