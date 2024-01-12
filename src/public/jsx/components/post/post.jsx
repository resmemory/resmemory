import React, { useState } from 'react';
import '../css/post.css';

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
            borderRadius :"6px",
            color : 'white',
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
          fontSize:'20px',
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
    <div className='annual'>
      <select className="annual-select" onChange={handleCategoryChange}>
        <option value="" disabled hidden>카테고리 선택</option>
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
}

const TitleInput = ({ title, onChange }) => {
  return (
    <div>
      <input type="text" class="title" placeholder="제목을 입력하세요" value={title} onChange={onChange} />
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
      const authorization = document.querySelector('.Authorization');
      authorization.value = sessionStorage.getItem('Authorization');
      form.append('category', postData.category);
      form.append('title', postData.title);
      form.append('content', postData.content);
      form.append('img', postData.image);

      const response = await fetch('./api/posts', {
        method: 'POST',
        headers: {
          Authorization: sessionStorage.getItem('Authorization'),
        },
        body: form,
      });
      const data = await response.json();
      console.log(form.title)
      console.log(postData)
      console.log(postData.title)
      if (data.response.ok) {
        console.log('글이 성공적으로 작성되었습니다.');
      } else {
        console.error('글 작성 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('네트워크 오류 또는 예외가 발생했습니다.', error);
    }
  };

  const handleEditPost = async () => {
    try {
      // 게시물 수정 로직
    } catch (error) {
      console.error('게시물 수정 중 오류가 발생했습니다.', error);
    }
  };

  return (
    <div className="post-container">
      <input type="hidden" name="authorization" class="Authorization" />
      <CategorySelect onCategoryChange={handleCategoryChange} />
      <TitleInput title={postData.title} onChange={handleTitleChange} />
      <ImageUpload onImageChange={handleImageChange} onDeleteImage={handleDeleteImage} />
      <div className='content'>
      <ContentInput content={postData.content} onChange={handleContentChange} />
      </div>
      <div className="button-container">
        {postData.id ? (
          <>
            <button className='cancel'>취소</button>
            <button className='edit' onClick={handleEditPost}>수정</button>
          </>
        ) : (
          <>
            <button className='cancel'>취소</button>
            <button className='write' onClick={handleWritePost}>작성</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Post;
