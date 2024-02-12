import React, { useEffect, useState } from 'react';

import './DeleteButton.css';

const adminId = sessionStorage.getItem('Authorization');

function DeleteButton(props) {
  const isReport = props.data.isReport;
  const [buttonColor, setButtonColor] = useState('');
  const [button, setButton] = useState('');

  useEffect(() => {
    if (isReport === 'true') {
      setButtonColor('#323232');
      setButton('삭제 완료');
    } else if (isReport === '2') {
      setButtonColor('darkgray');
      setButton('삭제 완료');
    } else if (isReport === 'false') {
      setButtonColor('#FF6E4E');
      setButton('삭제 하기');
    }
  }, [isReport]);

  const handleDelete = async () => {
    if (isReport === 'false') {
      try {
        setButtonColor('#323232');
        setButton('삭제 완료');
        await deleteContent(props.data.reportId, props.data.contentId, props.data.reportType);
      } catch (error) {}
    }

    if (isReport === 'true' || isReport === '2') {
      setButtonColor('darkgray');
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
    <div id="delete-buttons">
      <button onClick={handleDelete} style={{ background: buttonColor }}>
        {button}
      </button>
    </div>
  );
}

export default DeleteButton;
