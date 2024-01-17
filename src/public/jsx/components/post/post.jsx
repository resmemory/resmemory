import React, { useState, useEffect } from 'react';

function Post() {
  const [isWritingPostInProgress, setWritingPostInProgress] = useState(false);

  useEffect(() => {
    // 컴포넌트가 마운트될 때 실행되는 코드
  }, []); // 빈 배열을 전달하여 한 번만 실행되도록 설정

  const writingPost = async () => {
    if (isWritingPostInProgress) {
      alert('잠시만 기다려주세요.');
      return;
    }

    const form = document.querySelector('#form');
    const authorization = document.querySelector('.Authorization');
    authorization.value = sessionStorage.getItem('Authorization');

    const formData = new FormData(form);

    // 이미지가 있는지 확인
    const imgFile = formData.get('img');

    if (!imgFile || !(imgFile instanceof File)) {
      // 이미지가 없는 경우 빈 파일 추가
      formData.append('img', new Blob(), 'placeholder.txt');
    }

    try {
      const response = await fetch(`./api/posts`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      alert(code[data.responseData.code]);

      if (data.responseData.code === 311) {
        setWritingPostInProgress(true);
        window.location.href = `./`;
      } else if (data.responseData.code === 312) {
        window.location.href = `./login`;
      }
    } catch (error) {
      console.error(error);
      // 처리 중 오류 발생 시에 대한 처리 추가
      // 예: alert('게시글 작성 중 오류가 발생했습니다.');
    }
  };

  const cancelPost = async () => {
    window.history.back();
  };

  return (
    <>
      <div>
        <form
          action="./api/posts"
          method="POST"
          encType="multipart/form-data"
          onSubmit={(e) => e.preventDefault()} // 기본 form submit 방지
          id="form"
        >
          <input type="hidden" name="authorization" className="Authorization" />
          <div className="container">
            <div>
              <label>카테고리</label>
              <select name="category">
                <option value="" selected></option>
                <option value="1970">1970</option>
                <option value="1980">1980</option>
                <option value="1990">1990</option>
                <option value="2000">2000</option>
                <option value="2010">2010</option>
                <option value="2020">2020</option>
              </select>
            </div>
            <div className="write_box">
              <input name="title" type="text" placeholder="제목을 입력해주세요." />
              <input name="img" type="file" />
              <textarea name="content" type="text" placeholder="내용을 입력해주세요."></textarea>
            </div>
            <div className="post_buttons">
              <button onClick={writingPost}>게시글 작성</button>
              <button onClick={cancelPost}>취소</button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default Post;
