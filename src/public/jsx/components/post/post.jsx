import React, { useState, useEffect } from 'react';
import './post.css';

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
        <option className="none" value="" disabled selected>
          카테고리 선택
        </option>
        <option value="2020">2020's</option>
        <option value="2010">2010's</option>
        <option value="2000">2000's</option>
        <option value="1990">1990's</option>
        <option value="1980">1980's</option>
        <option value="1970">1970's</option>
        <option value="1960">1960's</option>
        <option value="notice">notice</option>
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

const Post = ({ postId }) => {
  const [postData, setPostData] = useState({
    id: null,
    category: '',
    title: '',
    content: '',
    image: null,
  });

  useEffect(() => {
    // 여기서 postId를 사용하여 API 호출 또는 데이터를 가져오는 로직을 작성
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/posts?postId=${postId}`);
        const result = await response.json();
        console.log(result);
        setPostData(result); // API에서 받아온 데이터로 상태 업데이트
      } catch (error) {
        console.error('데이터를 불러오는 중 에러 발생', error);
      }
    };

    fetchData();
  }, [postId]);

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
      if (postData.image && postData.image instanceof File) {
        form.append('img', postData.image);
      } else {
        form.append('img', new Blob(), 'placeholder.txt');
      }
      const response = await fetch('./api/posts', {
        method: 'POST',
        body: form,
      });
      const result = await response.json();
    } catch (error) {
      console.error('네트워크 오류 또는 예외가 발생했습니다.', error);
    }
  };

  const handleEditPost = async () => {
    try {
      const form = new FormData();
      form.append('authorization', sessionStorage.getItem('Authorization'));
      form.append('category', postData.category);
      form.append('title', postData.title);
      form.append('content', postData.content);
      form.append('img', postData.image);

      const response = await fetch(`./api/posts/${postId}`, {
        method: 'PATCH',
        body: form,
      });
      const result = await response.json();
    } catch (error) {
      console.error('게시물 수정 중 오류가 발생했습니다.', error);
    }
  };

  return (
    <div className="post-container">
      <CategorySelect onCategoryChange={handleCategoryChange} />
      <TitleInput title={postData.title} onChange={handleTitleChange} />
      <ImageUpload onImageChange={handleImageChange} onDeleteImage={handleDeleteImage} />
      <div className="content">
        <ContentInput content={postData.content} onChange={handleContentChange} />
      </div>
      <div className="button-container">
        {postData.id ? (
          <>
            <button className="cancel">취소</button>
            <button className="edit" onClick={handleEditPost}>
              수정
            </button>
          </>
        ) : (
          <>
            <button className="cancel">취소</button>
            <button className="write" onClick={handleWritePost}>
              작성
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Post;
