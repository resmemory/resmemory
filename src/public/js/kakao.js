async function kakaoLogin() {
  await Kakao.init(kakaoJSkey);

  await Kakao.Auth.authorize({
    redirectUri: 'http://oemoem.shop:8000/api/oauth',
  });
}
