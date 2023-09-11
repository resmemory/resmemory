const { ConnectParticipant } = require('aws-sdk');

document.addEventListener('DOMContentLoaded', () => {
  countPosts();
  buttons();
});
let currentPage = 1;
let annualViewCountMode = sessionStorage.getItem('annualViewCountMode') === 'true' || false;

// 게시물 총 개수 파악
const countPosts = async () => {
  if (annualViewCountMode) {
    annualPostsByViewCountOrder(currentPage);
  } else {
    annualPosts(currentPage);
  }
  let totalPosts = 0;

  const url = new URL(window.location.href);
  const category = url.searchParams.get('category');

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

  return totalPosts;
};

// 게시글 목록 - 최신순 정렬
const annualPosts = async (currentPage) => {
  sessionStorage.removeItem('annualViewCountMode');
  if (!currentPage) {
    currentPage = 1;
  }

  const url = new URL(window.location.href);
  const category = url.searchParams.get('category');

  totalPosts = await countPosts();

  const paginationViewCount = document.querySelector('.pagination_viewcount');
  if (paginationViewCount.childElementCount !== 0) {
    paginationViewCount.innerHTML = '';
  }

  const response = await fetch(`./api/posts?annualCategory=${category}&pageNum=${currentPage}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  if (data.responseData.code) {
    alert(code[data.responseData.code]);
  }

  const postlist = document.querySelector('.postlist');
  if (totalPosts == 0) {
    const tempHtml = `<tr class="postBox">
      <td></td>
      <td ></td>
      <td></td>
      <td></td>
      <td></td>
      </tr>`;
    postlist.innerHTML = tempHtml;
  } else {
    const postsData = data.responseData
      .map(
        (post) =>
          `<tr class="postBox">
          <td>${post.annualCategory}</td>
          <td onclick="clickPost(${post.postId})">${post.title}</td>
          <td>${post.nickname}</td>
          <td>${new Date(post.createdAt).toLocaleDateString('ko-KR', {
            timeZone: 'Asia/Seoul',
          })}</td>
          <td>${post.viewCount}</td>
          </tr>`,
      )
      .join('');
    postlist.innerHTML = postsData;

    createPaginationButtons(currentPage, totalPosts);
  }
};

// 게시글 목록 - 조회순 정렬
const annualPostsByViewCountOrder = async (currentPage) => {
  if (!currentPage) {
    currentPage = 1;
  }

  const url = new URL(window.location.href);
  const category = url.searchParams.get('category');

  totalPosts = await countPosts();

  const paginationCreatedat = document.querySelector('.pagination_createdat');
  if (paginationCreatedat.childElementCount !== 0) {
    paginationCreatedat.innerHTML = '';
  }

  const response = await fetch(
    `./api/posts/view?annualCategory=${category}&pageNum=${currentPage}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  const data = await response.json();
  if (data.responseData.code) {
    alert(code[data.responseData.code]);
  }

  const postlist = document.querySelector('.postlist');
  if (totalPosts == 0) {
    const tempHtml = `<tr class="postBox">
      <td></td>
      <td ></td>
      <td></td>
      <td></td>
      <td></td>
      </tr>`;
    postlist.innerHTML = tempHtml;
  } else {
    const postsData = data.responseData
      .map(
        (post) =>
          `<tr class="postBox">
          <td>${post.annualCategory}</td>
          <td class="post_title" onclick="clickPost(${post.postId})">${post.title}</td>
          <td>${post.nickname}</td>
          <td>${new Date(post.createdAt).toLocaleDateString('ko-KR', {
            timeZone: 'Asia/Seoul',
          })}</td>
          <td>${post.viewCount}</td>
          </tr>`,
      )
      .join('');
    postlist.innerHTML = postsData;

    annualViewCountMode = true;
    sessionStorage.setItem('annualViewCountMode', annualViewCountMode);
    createPaginationButtonsByViewCount(currentPage, totalPosts);
  }
};

// 페이지네이션 버튼 생성 함수 - 최신순 정렬
const createPaginationButtons = (currentPage, totalPosts) => {
  const paginationCreatedat = document.querySelector('.pagination_createdat');
  paginationCreatedat.innerHTML = '';
  const totalPages = Math.ceil(totalPosts / 10);

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement('button');
    button.innerText = i;
    button.addEventListener('click', () => {
      currentPage = i;
      annualPosts(currentPage);
    });

    if (i === currentPage) {
      button.classList.add('active');
    }
    paginationCreatedat.appendChild(button);
  }
};

// 페이지네이션 버튼 생성 함수 - 조회순 정렬
const createPaginationButtonsByViewCount = (currentPage, totalPosts) => {
  const paginationViewCount = document.querySelector('.pagination_viewcount');
  paginationViewCount.innerHTML = '';
  const totalPages = Math.ceil(totalPosts / 10);

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement('button');
    button.innerText = i;
    button.addEventListener('click', () => {
      currentPage = i;
      annualPostsByViewCountOrder(currentPage);
    });

    if (i === currentPage) {
      button.classList.add('active');
    }
    paginationViewCount.appendChild(button);
  }
};

// 버튼들
const buttons = () => {
  const login = document.querySelector('.login');
  const logout = document.querySelector('.logout');
  const mypage = document.querySelector('.mypage');
  const write = document.querySelector('.write');
  const thread = document.querySelector('.thread_btn');
  const chat = document.querySelector('.chat_btn');

  if (sessionStorage.getItem('Authorization')) {
    logout.style.display = 'block';
    mypage.style.display = 'block';
    write.style.display = 'block';
    thread.style.display = 'block';
    chat.style.display = 'block';
  } else {
    login.style.display = 'block';
  }
};

// 로그아웃 버튼 누를시
const logout = async () => {
  const response = await fetch(`./api/logout`, {
    method: 'POST',
    headers: {
      Authorization: sessionStorage.getItem('Authorization'),
    },
  });
  const result = await response.json();

  alert(code[result.responseData.code]);
  sessionStorage.removeItem('Authorization');
  location.href = `./`;
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
  location.href = `./post`;
};

// 로고 클릭시
const clickLogo = () => {
  sessionStorage.removeItem('viewCountMode');
  sessionStorage.removeItem('annualViewCountMode');
  location.href = `./`;
};
