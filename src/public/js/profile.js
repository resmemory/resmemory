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
  if (sessionStorage.getItem('Authorization')) {
    logout.style.display = 'block';
  } else {
    login.style.display = 'block';
  }
}

async function logout() {
  const response = await fetch(`./api/logout`, {
    method: 'POST',
    headers: {
      Authorization: sessionStorage.getItem('Authorization'),
    },
  });
  const result = await response.json();

  alert(code[result.responseData.code]);
  sessionStorage.removeItem('Authorization');
  location.href = './';
}

async function bookmarks() {
  const response = await fetch(`./api/bookmarks`, {
    method: 'GET',
    headers: {
      Authorization: sessionStorage.getItem('Authorization'),
    },
  });
  const result = await response.json();

  const bookmarks = result.responseData.bodies
    .map((bookmark) => {
      return `
      <div class = "bookmarkInnerBox" >
      <h2 class = "title" onclick = "location.href='./detail?post=${bookmark.postId}'">${
        bookmark.title
      }</h2> 
      
      <p>
    
      ${bookmark.category} | ${new Date(bookmark.createdAt).toLocaleDateString('ko-KR', {
        timeZone: 'Asia/Seoul',
      })} | ${bookmark.nickname}
     
      </p>
      <button class = "removeBookmark" onclick="removeBookmark(${
        bookmark.bookmarkId
      })">해제</button>
     
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
      Authorization: sessionStorage.getItem('Authorization'),
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
      Authorization: sessionStorage.getItem('Authorization'),
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
      Authorization: sessionStorage.getItem('Authorization'),
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
      Authorization: sessionStorage.getItem('Authorization'),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });
  const result = await response.json();
  alert(code[result.responseData.code]);
  if (result.responseData.code == 141) {
    sessionStorage.removeItem('Authorization');
    location.href = './';
  }
}

async function profile() {
  const response = await fetch(`./api/users`, {
    method: 'GET',
    headers: {
      Authorization: sessionStorage.getItem('Authorization'),
    },
  });
  const result = await response.json();
  console.log(result);

  if (result.responseData.bodies.userId == 1) {
    const adminBtn = document.querySelector('.admin');
    adminBtn.style.display = 'block';
  }

  if (result.responseData.bodies.email == 'kakaoId') {
    const editPassword = document.querySelector('.editPassword');
    editPassword.style.display = 'none';
  }
  const tempHtml = `
  <div>
  <p>${result.responseData.bodies.nickname}</p>
  <p>${result.responseData.bodies.email}</p>
  </div>`;

  const profile = document.querySelector('.profile');
  profile.innerHTML = tempHtml;
}
