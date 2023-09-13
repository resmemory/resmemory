async function kakaoLogin() {
  try {
    await Kakao.init(kakaoJSkey);
    await Kakao.Auth.authorize({
      redirectUri: 'https://resmemory.shop/api/oauth',
    });
  } catch (err) {
    alert('로그인이 정상적으로 완료되지 않았습니다. 새로고침 이후 다시 시도해 주세요.');
  }
}
