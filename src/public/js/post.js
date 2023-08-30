const code = {
  0: '로그인이 필요한 기능입니다.',
  100: '일시적인 오류가 발생했습니다.',
  311: '게시글을 작성하였습니다.',
  312: '로그인이 필요한 기능입니다.',
  313: '제목을 입력해주세요.',
  314: '내용을 입력해주세요.',
  315: '카테고리를 설정해주세요.',
  310: '일시적인 오류가 발생했습니다.',
};

const writingPost = async () => {
  const annualCategory = document.querySelector('.annualcategory').value;
  const title = document.querySelector('.title').value;
  const content = document.querySelector('.content').value;

  const response = await fetch(`./api/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('Authorization'),
    },
    body: JSON.stringify({ title, content, annualCategory }),
  });

  const data = await response.json();
  alert(code[data.responseData.code]);

  if (data.responseData.code === 311) {
    location.href = `./`;
  }
};

// 취소 버튼 누를시 이전 페이지로 이동
const cancelPost = async () => {
  window.history.back();
};
