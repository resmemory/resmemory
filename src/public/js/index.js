document.addEventListener('DOMContentLoaded', () => {
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
    })
    .catch((error) => {
      console.error('Error fetching total posts:', error);
    });
});

const totalPostCount = async () => {
  await fetch(`./api/posts/list`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      totalPosts = data.responseData.bodies;
      loadPosts(currentPage, totalPosts);
    })
    .catch((error) => {
      console.error('Error fetching total posts:', error);
    });
};

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
        `<div class="postBox">
        <p>${post.annualCategory}</p>
        <p>${post.title}</p>
        <p>${post.nickname}</p>
        <p>${new Date(post.createdAt).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' })}</p>
        </div>`,
    )
    .join('');
  postlist.innerHTML = postsData;

  createPaginationButtons(page, totalPosts);
};

const createPaginationButtons = (currentPage, totalPosts) => {
  const paginationContainer = document.querySelector('.pagination');
  const totalPages = Math.ceil(totalPosts / 10);
  console.log(totalPosts);

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement('button');
    button.innerText = i;
    button.addEventListener('click', () => {
      currentPage = i;
      loadPosts(currentPage, totalPosts);
    });

    if (i === currentPage) {
      button.classList.add('active');
    }
    paginationContainer.appendChild(button);
  }
};
