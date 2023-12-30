// import React, { useState, useEffect } from 'react';

// const PostCount = () => {
//   const [totalPosts, setTotalPosts] = useState(0);

//   useEffect(() => {
//     const fetchPostCount = async () => {
//       try {
//         const response = await fetch(`./api/posts/list`, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });

//         const data = await response.json();

//         if (data.responseData.code) {
//           alert(code[data.responseData.code]);
//         }

//         let postsCount = data.responseData.bodies;

//         if (postsCount > 100) {
//           postsCount = 100;
//         }

//         setTotalPosts(postsCount);
//       } catch (error) {
//         console.error('Error fetching post count:', error);
//       }
//     };

//     fetchPostCount();
//   }, []);

//   return (
//     <div>
//       <p>Total Posts: {totalPosts}</p>
//     </div>
//   );
// };

// export default PostCount;

import React, { useState, useEffect } from 'react';

const PostList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPostList = async () => {
      try {
        const response = await fetch(`./api/posts/list`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (data.responseData.code) {
          alert(code[data.responseData.code]);
        }

        setPosts(data.responseData.bodies);
      } catch (error) {
        console.error('Error fetching post list:', error);
      }
    };

    fetchPostList();
  }, []);

  return (
    <div>
      {posts.map((post, index) => (
        <div key={index} style={{ height: `${post.high}px` }}>
          {/* Add other content for each post here */}
          <p>{post.title}</p>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
};


export default PostList;
