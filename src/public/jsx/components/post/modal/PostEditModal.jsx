import React from 'react';

function PostEditModal({ postId, postDetails }) {
  const updatePost = async () => {
    const form = document.querySelector('#form');
    const authorization = document.querySelector('.Authorization');
    authorization.value = sessionStorage.getItem('Authorization');
    const formData = new FormData(form);
    const response = await fetch(`./api/posts/${postId}`, {
      method: 'PATCH',
      body: formData,
    });

    const data = await response.json();
    alert(code[data.responseData.code]);

    if (data.responseData.code === 351) {
      window.location.reload();
    }
  };

  function handleImageDelete() {
    const target = document.querySelector('.post_img');
    target.value = '';
  }

  const modalClose = (classname) => {
    const target = document.querySelector(classname);
    target.style.display = 'none';
  };
  return (
    <>
      <form
        action="./api/posts"
        method="PATCH"
        enctype="multipart/form-data"
        onSubmit={(e) => e.preventDefault()}
        id="form"
      >
        <input type="hidden" name="authorization" className="Authorization" />
        <div className="modal" id="edit-post-Modal" style={{ display: 'none' }}>
          <div className="modal-content">
            <div className="edit-post-Box">
              {/* Edit Post Modal Content */}
              <div>
                <h3>글 수정하기</h3>
                <label>제목</label>
                <br />
                <textarea name="title" className="post_title" type="text">
                  {postDetails.title}
                </textarea>
              </div>
              <div>
                <label>내용</label>
                <br />
                <textarea name="content" className="post_content" type="text">
                  {postDetails.content}
                </textarea>
              </div>
              <div>
                <label>연도</label>
                <br />
                <select name="category" className="post_category">
                  <option selected>{postDetails.category}</option>
                  <option>1970</option>
                  <option>1980</option>
                  <option>1990</option>
                  <option>2000</option>
                  <option>2010</option>
                  <option>2020</option>
                </select>
              </div>
              <br />
              <div>
                <label>현재 이미지</label>
                <br />
                <input
                  name="previousImg"
                  className="post_img"
                  type="text"
                  value={postDetails.img}
                />

                <br />
                <label>변경할 이미지</label>
                <br />
                <input name="img" className="post_img" type="file" accept="image/*" />
                <button onClick={handleImageDelete}>이미지 삭제</button>
              </div>
              <div className="edit-post-Box-btn">
                <button className="edit-post-btn" onClick={() => updatePost()}>
                  수정
                </button>
                <button className="edit-close-btn" onClick={() => modalClose('#edit-post-Modal')}>
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default PostEditModal;
