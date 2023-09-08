async function kakaoLogin() {
  await Kakao.init(kakaoJSkey);
  await Kakao.Auth.authorize({
    redirectUri: 'http://resmemory.shop/api/oauth',
  });
}
