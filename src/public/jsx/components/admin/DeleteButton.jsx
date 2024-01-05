import React from 'react';

const style = {
  div: {
    marginRight: 5,
  },
};
function DeleteButton(props) {
  const { title, onClick } = props;

  return (
    <div style={style.div}>
      <button onClick={onClick}>{title || '삭제'}</button>;
    </div>
  );
}

export default DeleteButton;
