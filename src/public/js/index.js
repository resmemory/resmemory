document.addEventListener('DOMContentLoaded', () => {
  loadPosts();
});

let currentPage = 1;
let totalPosts = 0;

fetch(`./api/posts/list`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
})
  .then((response) => response.json())
  .then((data) => {
    totalPosts = data.responseData.bodies;
    loadPosts(currentPage, totalPosts);
  });

const loadPosts = async (page, totalPosts) => {
  const response = await fetch(`./api/posts?pageNum=${page}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  const postlist = document.querySelector('.postlist');

  const postsData = data.responseData
    .map(
      (post) =>
        `<tr class="postBox">
        <td>${post.annualCategory}</td>
        <td class="post_title" onclick="clickPost(${post.postId})">${post.title}</td>
        <td>${post.nickname}</td>
        <td>${new Date(post.createdAt).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' })}</td>
        <td>${post.viewCount}</td>
        </tr>`,
    )
    .join('');
  postlist.innerHTML = postsData;

  createPaginationButtons(page, totalPosts);
};

const createPaginationButtons = (currentPage, totalPosts) => {
  const paginationContainer = document.querySelector('.pagination');
  const totalPages = Math.ceil(totalPosts / 10);

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement('button');
    button.innerText = i;
    button.addEventListener('click', () => {
      currentPage = i;
      loadPosts(currentPage);
    });

    if (i === currentPage) {
      button.classList.add('active');
    }
    paginationContainer.appendChild(button);
  }
};

// 연도별 조회로 이동
const annualCategory = (category) => {
  location.href = `./annual?category=${category}`;
};

// 상세 페이지로 이동
const clickPost = (postId) => {
  location.href = `./detail?post=${postId}`;
};
