document.addEventListener('DOMContentLoaded', () => {
  oauth();
});
const urlParams = new URL(location.href).searchParams;
const code = urlParams.get('code');
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
    localStorage.setItem('nickname', result.responseData.nickname);
  }
}
