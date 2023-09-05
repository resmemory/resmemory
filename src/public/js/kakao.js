async function kakaoLogin() {
  await Kakao.init(kakaoJSkey);

  await Kakao.Auth.authorize({
    redirectUri: 'http://localhost:8000/api/oauth',
  });
}
