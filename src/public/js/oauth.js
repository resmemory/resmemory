document.addEventListener('DOMContentLoaded', () => {
  oauth();
});

async function oauth() {
  const baseUrl = 'https://kauth.kakao.com/oauth/token';

  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;

  const responseToken = await fetch(finalUrl, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
  });
  const resultToken = await responseToken.json();
  const accessToken = resultToken.access_token;

  const userDataResponse = await fetch('https://kapi.kakao.com/v2/user/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-type': 'application/json',
    },
  });
  const userDataResult = await userDataResponse.json();
  const authId = userDataResult.id;

  await fetch(`./oauth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ kakaoId: authId }),
  });

  const response = await fetch(`./kakaoLogin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ kakaoId: authId }),
  });
  const result = await response.json();

  if (result.responseData.code == 121 || result.responseData.code == 123) {
    localStorage.setItem('Authorization', response.headers.get('Authorization'));
    alert(
      '로그인을 환영합니다! 최초로 카카오 로그인을 진행할 경우 랜덤 닉네임이 부여됩니다! 닉네임은 로그인 이후 마이페이지에서 수정할 수 있습니다.',
    );
  } else {
    alert(code[result.responseData.code]);
  }
  location.href = '../';
}
