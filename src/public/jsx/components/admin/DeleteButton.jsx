import React, { useEffect, useState } from 'react';
const adminId = sessionStorage.getItem('Authorization');

const style = {
  div: {
    alignItems: 'right',
  },
  button: {
    width: '100px',
    color: 'white',
    borderRadius: '5px',
    border: 'none',
    padding: '10px 20px',
    cursor: 'pointer',
  },
};
function DeleteButton(props) {
  const isReport = props.data.isReport;
  const [buttonColor, setButtonColor] = useState('');
  const [button, setButton] = useState('');

  useEffect(() => {
    if (isReport === 'true') {
      setButtonColor('blue');
      setButton('삭제 완료');
    } else if (isReport === '2') {
      setButtonColor('gray');
      setButton('삭제 완료');
    } else if (isReport === 'false') {
      setButtonColor('black');
      setButton('삭제 하기');
    }
  }, [isReport]);

  const handleDelete = async () => {
    if (isReport === 'false') {
      try {
        await deleteContent(props.data.reportId, props.data.contentId, props.data.reportType);
        setButtonColor('blue');
      } catch (error) {
        console.log(error);
      }
    }
    if (isReport === 'true' || isReport === '2') {
      await deleteContent(props.data.reportId, props.data.contentId, props.data.reportType);
    }
  };

  async function deleteContent(reportId, contentId, reportType) {
    const response = await fetch(`/api/admin/${reportType}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: adminId,
      },
      body: JSON.stringify({ reportId, contentId }),
    });
    const result = await response.json();
    alert(code[result.responseData.code]);
  }

  return (
    <div style={style.div}>
      <button style={{ ...style.button, backgroundColor: buttonColor }} onClick={handleDelete}>
        {button}
      </button>
    </div>
  );
}

export default DeleteButton;
