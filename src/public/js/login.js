const code = {
  121: '로그인에 성공하였습니다.',
  122: '로그인에 실패하였습니다.',
  123: '로그인에 성공하였습니다.',
  120: '알 수 없는 오류가 발생하였습니다.',
  181: '인증번호를 발송하였습니다. 입력하신 메일의 수신함을 확인해 주세요',
  182: '가입된 이메일입니다. 다른 이메일 주소를 입력해 주세요.',
  180: '알 수 없는 오류가 발생하였습니다.',
  191: '인증번호가 일치하지 않습니다.',
  192: '인증 시간이 만료되었습니다.',
  193: '인증에 성공하였습니다.',
  190: '알 수 없는 오류가 발생하였습니다.',
  111: '응답하라 추억시대 가입을 환영합니다.',
  112: '회원 가입에 실패하였습니다.',
  113: '올바른 이메일을 입력해 주세요.',
  114: '비밀번호는 6자 이상 12자 이하 영문 숫자 조합입니다.',
  115: '모든 항목을 입력해 주세요.',
  116: '비밀번호와 비밀번호 확인이 일치하지 않습니다.',
  117: '중복되는 닉네임입니다.',
  110: '알 수 없는 오류가 발생하였습니다.',
};

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
    window.location.href = './main';
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

  const response = await fetch(`./api/verified`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ receiveNumber }),
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
