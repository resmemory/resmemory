document.addEventListener('DOMContentLoaded', () => {
  countPosts();
  headerBtns();
});

const countPosts = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category');
  let currentPage = 1;
  let totalPosts = 0;

  const response = await fetch(`./api/posts/list?annualCategory=${category}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  if (data.responseData.code) {
    alert(code[data.responseData.code]);
  }

  totalPosts = data.responseData.bodies;
  if (totalPosts > 100) {
    totalPosts = 100;
  }

  annualPosts(currentPage, category, totalPosts);
};

const annualPosts = async (page, category, totalPosts) => {
  const response = await fetch(`./api/posts?annualCategory=${category}&pageNum=${page}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  if (data.responseData.code) {
    alert(code[data.responseData.code]);
  }

  const titleColumn = document.querySelector('.title_column');
  if (totalPosts == 0) {
    titleColumn.innerHTML = `<p style=color:gray;>${category}년대 카테고리에 아직 작성된 게시물이 없습니다. 첫 작성자가 되어주세요!✋</p>`;
  }

  const postlist = document.querySelector('.postlist');
  const postsData = data.responseData
    .map(
      (post) =>
        `<tr class="postBox">
      <td>${post.annualCategory}</td>
      <td onclick="clickPost(${post.postId})">${post.title}</td>
      <td>${post.nickname}</td>
      <td>${new Date(post.createdAt).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' })}</td>
      <td>${post.viewCount}</td>
      </tr>`,
    )
    .join('');
  postlist.innerHTML = postsData;

  createPaginationButtons(page, category, totalPosts);
};

const createPaginationButtons = (currentPage, category, totalPosts) => {
  const paginationContainer = document.querySelector('.pagination');
  const totalPages = Math.ceil(totalPosts / 10);

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement('button');
    button.innerText = i;
    button.addEventListener('click', () => {
      currentPage = i;
      annualPosts(currentPage, category);
    });

    if (i === currentPage) {
      button.classList.add('active');
    }
    paginationContainer.appendChild(button);
  }
};

// 헤더버튼들
const headerBtns = () => {
  const login = document.querySelector('.login');
  const logout = document.querySelector('.logout');
  const mypage = document.querySelector('.mypage');

  if (localStorage.getItem('Authorization')) {
    logout.style.display = 'block';
    mypage.style.display = 'block';
  } else {
    login.style.display = 'block';
  }
};

// 로그아웃 버튼 누를시
const logout = async () => {
  const response = await fetch(`./api/logout`, {
    method: 'POST',
    headers: {
      Authorization: localStorage.getItem('Authorization'),
    },
  });
  const result = await response.json();

  alert(code[result.responseData.code]);
  localStorage.removeItem('Authorization');
  location.reload();
};

// 다른 연도별 조회로 이동
const annualCategory = (category) => {
  location.href = `./annual?category=${category}`;
};

// 상세 페이지로 이동
const clickPost = (postId) => {
  location.href = `./detail?post=${postId}`;
};

// 글 작성 페이지로 이동
const writingPost = () => {
  const Authorization = localStorage.getItem('Authorization');
  if (!Authorization) {
    alert(code[0]);
    location.href = `./login`;
  } else {
    location.href = `./post`;
  }
};
