import React, { useEffect } from 'react';

const KakaoLogin = () => {
  useEffect(() => {
    StartKakao();
  }, []);

  async function StartKakao() {
    try {
      const response = await fetch(`./api/kakaokey`, {
        method: 'POST',
      });
      const result = await response.json();
      await Kakao.init(result.responseData.kakaoJSkey);
      await Kakao.Auth.authorize({
        redirectUri: result.responseData.kakaoRedirectURI,
      });
    } catch (err) {
      alert('로그인이 정상적으로 완료되지 않았습니다. 새로고침 이후 다시 시도해 주세요.');
    }
  }

  return <></>;
};

export default KakaoLogin;
