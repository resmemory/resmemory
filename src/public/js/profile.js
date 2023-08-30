code = {
  131: '로그아웃에 성공하였습니다.',
  100: '일시적인 오류가 발생하였습니다.',
  141: '회원 탈퇴에 성공하였습니다. 지금까지 응답하라 추억시대를 이용해 주셔서 감사합니다.',
  142: '문구를 올바르게 적어 주세요.',
  143: '회원 탈퇴에 실패하였습니다.',
  140: '알 수 없는 오류가 발생하였습니다.',
  231: '북마크 삭제에 성공하였습니다.',
  232: '북마크 삭제에 실패하였습니다.',
  230: '알 수 없는 오류가 발생하였습니다.',
  151: '닉네임 수정에 성공하였습니다.',
  152: '닉네임 수정에 실패하였습니다.',
  153: '수정할 닉네임을 입력해 주세요.',
  154: '이미 존재하는 닉네임 입니다.',
  150: '알 수 없는 오류가 발생하였습니다.',
  161: '비밀번호 수정에 성공하였습니다.',
  162: '비밀번호 수정에 실패하였습니다.',
  163: '확인 비밀번호가 일치하지 않습니다.',
  164: '모든 항목을 입력해 주세요.',
  160: '알 수 없는 오류가 발생하였습니다.',
};

document.addEventListener('DOMContentLoaded', () => {
  headerBtns();
  bookmarks();
  profile();
});

function modalOn(classname) {
  const target = document.querySelector(classname);
  target.style.display = 'block';
}
function modalClose(classname) {
  const target = document.querySelector(classname);
  target.style.display = 'none';
}

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
  const bookmarks = result.responseData.bodies
    .map((bookmark) => {
      return `
      <div class = "bookmarkInnerBox">
      <h1 class = "title">${bookmark.title}</h1> 
      <p>${bookmark.annualCategory} | ${new Date(bookmark.createdAt).toLocaleDateString('ko-KR', {
        timeZone: 'Asia/Seoul',
      })} | ${bookmark.nickname}</p>
      <button class = "removeBookmark" onclick="removeBookmark(${
        bookmark.bookmarkId
      })">삭제</button>
      </div>
    `;
    })
    .join('');
  const target = document.querySelector('.bookmarks');
  target.innerHTML = bookmarks;
}

async function removeBookmark(bookmarkId) {
  const response = await fetch(`./api/bookmarks/${bookmarkId}`, {
    method: 'DELETE',
    headers: {
      Authorization: localStorage.getItem('Authorization'),
    },
  });
  const result = await response.json();
  alert(code[result.responseData.code]);
  location.reload();
}

async function editNickname() {
  const nickname = document.querySelector('.nickname').value;
  const response = await fetch(`./api/users/nickname`, {
    method: 'PATCH',
    headers: {
      Authorization: localStorage.getItem('Authorization'),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nickname }),
  });
  const result = await response.json();
  alert(code[result.responseData.code]);
  location.reload();
}

async function editPassword() {
  const password = document.querySelector('.password').value;
  const confirm = document.querySelector('.confirm').value;
  const response = await fetch(`./api/users/password`, {
    method: 'PATCH',
    headers: {
      Authorization: localStorage.getItem('Authorization'),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password, confirm }),
  });
  const result = await response.json();
  alert(code[result.responseData.code]);
  location.reload();
}

async function signout() {
  const message = document.querySelector('.message').value;
  const response = await fetch(`./api/users`, {
    method: 'DELETE',
    headers: {
      Authorization: localStorage.getItem('Authorization'),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });
  const result = await response.json();
  alert(code[result.responseData.code]);
  location.href = './';
}

async function profile() {
  const response = await fetch(`./api/users`, {
    method: 'GET',
    headers: {
      Authorization: localStorage.getItem('Authorization'),
    },
  });
  const result = await response.json();
  console.log(result);
  const tempHtml = `
  <div>
  <p>${result.responseData.bodies.nickname}</p>
  <p>${result.responseData.bodies.email}</p>
  </div>`;

  const profile = document.querySelector('.profile');
  profile.innerHTML = tempHtml;
}
