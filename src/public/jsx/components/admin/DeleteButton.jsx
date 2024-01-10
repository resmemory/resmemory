import React from 'react';

const style = {
  div: {
    alignItems: 'right',
  },
  button: {
    color: 'white',
    borderRadius: '5px',
    backgroundColor: 'blue',
    border: 'none',
    padding: '10px 20px',
    cursor: 'pointer',
  },
};
function DeleteButton(props) {
  const { title, onClick } = props;

  const handleDelete = () => {
    // 삭제 버튼이 클릭되었을 때 수행할 작업
    console.log('Delete button clicked!');
  };

  return (
    <div style={style.div}>
      <button style={style.button} onClick={handleDelete}>
        {'삭제'}
      </button>
    </div>
  );
}

export default DeleteButton;
