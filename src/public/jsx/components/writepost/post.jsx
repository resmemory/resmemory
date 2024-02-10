import React, { useState, useEffect } from 'react';

import Picture from '../svg/Picture.jsx';

import './post.css';

const ImageUpload = ({ onImageChange, onDeleteImage }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
    onImageChange(file);
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
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: 'none' }}
      />

      <button
        id="imgae-upload"
        onClick={handleButtonAction}
        style={{ background: selectedImage ? '#FF6E4E' : '#323232' }}
      >
        <Picture /> {selectedImage ? `이미지 삭제` : `이미지 업로드`}
      </button>

      <textarea id="image-path" readOnly value={selectedImage ? selectedImage.name : ''} />
    </div>
  );
};

const CategorySelect = ({ onCategoryChange }) => {
  useEffect(() => {
    loginChecker();
  }, []);
  const [displayNotice, setDisplayNotice] = useState('none');

  const loginChecker = async () => {
    if (sessionStorage.getItem('Authorization')) {
      const profileresponse = await fetch(`./api/users`, {
        method: 'GET',
        headers: {
          Authorization: sessionStorage.getItem('Authorization'),
        },
      });
      const profileresult = await profileresponse.json();
      if (profileresult.responseData.bodies.userId == 1) {
        setDisplayNotice('block');
      }
    }
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    onCategoryChange(selectedCategory);
  };

  return (
    <div>
      <select className="annual-select" onChange={handleCategoryChange}>
        <option className="none" value="" disabled selected>
          카테고리 선택
        </option>
        <option value="2020">2020</option>
        <option value="2010">2010</option>
        <option value="2000">2000</option>
        <option value="1990">1990</option>
        <option value="1980">1980</option>
        <option value="1970">1970</option>
        <option value="notice" style={{ display: displayNotice }}>
          notice
        </option>
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
      <textarea
        id="content"
        placeholder="내용을 입력하세요"
        value={content}
        onChange={onChange}
      ></textarea>
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
      if (
        postData.category === undefined ||
        postData.title === undefined ||
        postData.content === undefined
      ) {
        alert('카테고리, 제목, 내용을 전부 작성해주세요');
        return;
      }
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
      alert(code[result.responseData.code]);
      window.location.href = './';
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
    <div>
      <CategorySelect onCategoryChange={handleCategoryChange} />
      <TitleInput title={postData.title} onChange={handleTitleChange} />
      <ImageUpload onImageChange={handleImageChange} onDeleteImage={handleDeleteImage} />

      <ContentInput content={postData.content} onChange={handleContentChange} />

      <div id="write-post-buttons">
        <button id="post-cancle">취소</button>
        <button id="post-write" onClick={handleWritePost}>
          작성
        </button>
      </div>
    </div>
  );
};

export default Post;
