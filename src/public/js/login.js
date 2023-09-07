function modalOn(classname) {
  const target = document.querySelector(classname);
  target.style.display = 'block';
}
function modalClose(classname) {
  const target = document.querySelector(classname);
  target.style.display = 'none';
}

async function login() {
  const password = document.querySelector('.password').value;
  const email = document.querySelector('.email').value;
  const response = await fetch(`./api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const result = await response.json();
  alert(code[result.responseData.code]);
  if (result.responseData.code == 121 || result.responseData.code == 123) {
    localStorage.setItem('Authorization', response.headers.get('Authorization'));
    localStorage.setItem('nickname', result.responseData.nickname);
    window.location.href = './';
  }
}

async function email() {
  const email = document.querySelector('.signupEmail').value;

  const response = await fetch(`./api/mail`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  const result = await response.json();
  alert(code[result.responseData.code]);
}

async function verified() {
  const receiveNumber = document.querySelector('.receiveNumber').value;
  const email = document.querySelector('.signupEmail').value;

  const response = await fetch(`./api/verified`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ receiveNumber, email }),
  });

  const result = await response.json();
  alert(code[result.responseData.code]);
}

async function signup() {
  const password = document.querySelector('.signupPassword').value;
  const email = document.querySelector('.signupEmail').value;
  const confirm = document.querySelector('.confirm').value;
  const nickname = document.querySelector('.nickname').value;

  const response = await fetch(`./api/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, confirm, nickname }),
  });

  const result = await response.json();
  alert(code[result.responseData.code]);
  location.reload();
}
