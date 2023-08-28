const code = {
  121: '로그인에 성공하였습니다.',
  122: '로그인에 실패하였습니다.',
  123: '로그인에 성공하였습니다.',
  120: '알 수 없는 오류가 발생하였습니다.',
  181: '인증번호를 발송하였습니다. 입력하신 메일의 수신함을 확인해 주세요',
  182: '가입된 이메일입니다. 다른 이메일 주소를 입력해 주세요.',
  180: '알 수 없는 오류가 발생하였습니다.',
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
  const response = await fetch(`http://localhost:8000/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const result = await response.json();
  console.log(result.responseData.code);
  alert(code[result.responseData.code]);
  if (result.responseData.code == 121 || result.responseData.code == 123) {
    localStorage.setItem('Authorization', response.headers.get('Authorization'));
    window.location.href = './main.html';
  }
}
