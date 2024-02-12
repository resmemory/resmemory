import React from 'react';
import './PostEditModal.css';

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
            <div className="edit-post">
              <h3>글 수정하기</h3>
              <div>
                <label>제목</label>

                <textarea name="title" type="text">
                  {postDetails.title}
                </textarea>
              </div>
              <div>
                <label>내용</label>

                <textarea name="content" type="text">
                  {postDetails.content}
                </textarea>
              </div>
              <div>
                <label>연도</label>

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

              <div>
                <label>현재사진</label>

                <input name="previousImg" type="text" value={postDetails.img} />
                <button id="img-delete" onClick={handleImageDelete}>
                  삭제
                </button>
              </div>
              <div>
                <label>변경사진</label>

                <input id="change-image" name="img" type="file" accept="image/*" />
              </div>
              <div id="post-edit-post-buttons">
                <button onClick={() => updatePost()}>수정</button>
                <button id="post-edit-close" onClick={() => modalClose('#edit-post-Modal')}>
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
