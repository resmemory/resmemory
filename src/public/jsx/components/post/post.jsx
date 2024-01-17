import React, { useState } from 'react';
import '../css/post.css';

// 이미지가 없을때 null x
const ImageUpload = ({ onImageChange, onDeleteImage }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageDescription, setImageDescription] = useState('');

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
    onImageChange(file);
  };

  const handleImageDescriptionChange = (event) => {
    setImageDescription(event.target.value);
  };

  const handleButtonAction = () => {
    if (selectedImage) {
      setSelectedImage(null);
      onDeleteImage();
    } else {
      document.querySelector('input[type="file"]').click();
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: 'none' }}
        className="img"
      />
      <label htmlFor="imageInput">
        <button
          onClick={handleButtonAction}
          style={{
            borderRadius: '6px',
            color: 'white',
            backgroundColor: selectedImage ? '#FF6E4E' : '#323232',
            height: '42px', // 높이 조절
            width: '120px', // 너비 조절
            marginRight: '3px', // 버튼과 textarea 사이 여백
          }}
        >
          {selectedImage ? `이미지 삭제` : '이미지 업로드'}
        </button>
      </label>
      <textarea
        readOnly
        value={selectedImage ? selectedImage.name : ''}
        style={{
          width: 'calc(100% - 130px)', // 100%에서 버튼 너비와 여백을 뺀 값
          height: '30px', // 높이 조절
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '5px',
          resize: 'none',
          fontSize: '20px',
          textAlign: 'left',
        }}
      />
    </div>
  );
};

const CategorySelect = ({ onCategoryChange }) => {
  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    onCategoryChange(selectedCategory);
  };

  return (
    <div className="annual">
      <select className="annual-select" onChange={handleCategoryChange}>
        <option value="" hidden>
          카테고리 선택
        </option>
        <option value="2020">2020's</option>
        <option value="2010">2010's</option>
        <option value="2000">2000's</option>
        <option value="1990">1990's</option>
        <option value="1980">1980's</option>
        <option value="1970">1970's</option>
        <option value="1960">1960's</option>
      </select>
    </div>
  );
};

const TitleInput = ({ title, onChange }) => {
  return (
    <div>
      <input
        type="text"
        class="title"
        placeholder="제목을 입력하세요"
        value={title}
        onChange={onChange}
      />
    </div>
  );
};

const ContentInput = ({ content, onChange }) => {
  return (
    <div>
      <textarea placeholder="내용을 입력하세요" value={content} onChange={onChange}></textarea>
    </div>
  );
};

const Post = () => {
  const [postData, setPostData] = useState({
    id: null,
    category: '',
    title: '',
    content: '',
    image: null,
  });

  const handleImageChange = (image) => {
    setPostData((prevData) => ({ ...prevData, image }));
  };

  const handleDeleteImage = () => {
    setPostData((prevData) => ({ ...prevData, image: null }));
  };

  const handleTitleChange = (event) => {
    setPostData((prevData) => ({ ...prevData, title: event.target.value }));
  };

  const handleContentChange = (event) => {
    setPostData((prevData) => ({ ...prevData, content: event.target.value }));
  };

  const handleCategoryChange = (selectedCategory) => {
    setPostData((prevData) => ({ ...prevData, category: selectedCategory }));
  };

  const handleWritePost = async () => {
    try {
      const form = new FormData();
      form.append('authorization', sessionStorage.getItem('Authorization'));
      form.append('category', postData.category);
      form.append('title', postData.title);
      form.append('content', postData.content);
      // 이미지가 있을 경우에만 추가
      if (postData.image && postData.image instanceof File) {
        form.append('img', postData.image);
      } else {
        form.append('img', new Blob(), 'placeholder.txt');
      }
      // FormData 내용을 각 항목 별로 출력
      form.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });
      const response = await fetch('./api/posts', {
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