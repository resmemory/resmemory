import React, { useEffect, useState, useRef } from 'react';
import Masonry from 'react-masonry-css';

import View from '../svg/View.jsx';
import Heart from '../svg/Heart.jsx';

import './CardSection.css';

const CardSection = () => {
  const [board, setBoard] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [observeSentinel, setObserveSentinel] = useState(true);
  const [bookmark, setBookmark] = useState(false);
  const containerRef = useRef(null);
  const sentinelRef = useRef(null);
  const itemsPerPage = 12;
  const itemsPerRow = 3;

  const fetchData = async (page, bookmark) => {
    try {
      setLoading(true);
      let endpoint;
      bookmark
        ? (endpoint = `./api/bookmarks?pageNum=${page}`)
        : (endpoint = `./api/myposts?pageNum=${page}`);

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          Authorization: sessionStorage.getItem('Authorization'),
        },
      });

      const responseData = await response.json();
      console.log(responseData.responseData.result);
      return responseData.responseData.result;
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = (postId) => {
    const postUrl = `./post?post=${postId}`;
    window.location.href = postUrl;
  };

  const loadMoreData = async () => {
    if (!loadingMore && hasMoreData) {
      setLoadingMore(true);

      try {
        const data = await fetchData(currentPage, bookmark);

        if (data.length > 0) {
          setBoard((prevBoard) => [...prevBoard, ...data]);
          setCurrentPage((prevPage) => prevPage + 1);
          setHasMoreData(data.length >= itemsPerPage);
        } else {
          setHasMoreData(false);
          setObserveSentinel(false);
        }
      } catch (error) {
        console.error('Error loading more data:', error);
      } finally {
        setLoadingMore(false);
      }
    }
  };

  const handleIntersection = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !loading && observeSentinel) {
        loadMoreData();
      }
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '0px',
      threshold: 1.0,
    });

    if (hasMoreData && observeSentinel) {
      observer.observe(sentinelRef.current);

      return () => {
        observer.disconnect();
      };
    }
  }, [hasMoreData, sentinelRef, handleIntersection, observeSentinel]);

  useEffect(() => {
    setHasMoreData(true);
    setObserveSentinel(true);
    setCurrentPage(1);
    setBoard([]);
  }, [bookmark]);

  return (
    <>
      <div className="card-section">
        <div>
          <button
            className={`mypost-button ${!bookmark ? 'active' : ''}`}
            onClick={() => {
              setBookmark(false);
            }}
          >
            내가 쓴 글
          </button>
          <button
            className={`bookmark-button ${bookmark ? 'active' : ''}`}
            onClick={() => {
              setBookmark(true);
            }}
          >
            북마크한 글
          </button>
        </div>
        <Masonry
          breakpointCols={{
            default: itemsPerRow,
            1100: 3,
            700: 2,
            500: 1,
          }}
          className="masonry-grid"
          columnClassName="masonry-grid_column"
          ref={containerRef}
        >
          {board.map((post) => (
            <div
              key={post.id}
              className="post"
              id="my-page-post"
              onClick={() => handlePostClick(post.postId)}
            >
              {post.img && <img src={post.img} alt="Post Image" />}
              <div className="postbox">
                <div>
                  <p>{post.category}</p>
                  <div>
                    <p>
                      <View /> {post.viewCount}
                    </p>
                    <p>
                      <Heart /> {post.bookmarks ? post.bookmarks : 0}
                    </p>
                  </div>
                </div>
                <p id="post-title">
                  {post.title.length > 10 ? post.title.slice(0, 10) + '...' : post.title}
                </p>
                <div>
                  <p>{post.nickname}</p>

                  <p>
                    {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                      timeZone: 'Asia/Seoul',
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {hasMoreData && <div ref={sentinelRef}></div>}
          {loading && <p>Loading...</p>}
        </Masonry>
      </div>
    </>
  );
};

export default CardSection;
