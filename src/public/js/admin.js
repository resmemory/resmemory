const adminId = localStorage.getItem('Authorization');
const getAllreport = fetch(`/api/reports`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    Authorization: adminId,
  },
  body: JSON.stringify(),
})
  .then((res) => res.json())
  .then((data) => {
    return data;
  });

const getReportList = () => {
  getAllreport.then(async (datas) => {
   await $('#reportBox').empty();
    if (datas.responseData.code == 100) {
      return alert('로그인이 되어있지 않습니다.');
    }
    if (datas.responseData.code == 622) {
      return alert('신고 조회의 권한이 없습니다.');
    }
   await datas.responseData.result.forEach((reportList) => {
      const reportId = reportList.reportId;
      const content = reportList.content;
      const userId = reportList.userId;
      const reportType = reportList.reportType;
      const contentId = reportList.contentId;

      const temp_html = `<div class="additionalBox id=${reportId}">
          <p class="additionalBoxText" id="reportContent">신고내용 : ${content}</p>
          <p class="additionalBoxText" id="userId">userId: ${userId}</p>
          <p class="additionalBoxText" id="reportType">reportType: ${reportType}</p>
          <p class="additionalBoxText" id="contentId">contentId: ${contentId}</p>
          <button class="deleteButton" id="deleteButton" onclick="deleteContent('${contentId}', '${reportType}')">삭제</button>
        </div>`;

      $('#reportBox').append(temp_html);
    });
  });
};
const deleteContent = (contentId, reportType) => {
  const req = {
    contentId: contentId,
  };
  fetch(`/api/admin/${reportType}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: adminId,
    },
    body: JSON.stringify(req),
  }).then((res) => res.json());
  console.log(res)
  if (res.responseData.code == 511) {
    alert('게시글이 정상적으로 삭제되었습니다.');
  } else if (res.responseData.code == 512) {
    return alert('게시글이 삭제되지 않았습니다.');
  } else if (res.responseData.code == 510) {
    return alert('알 수 없는 오류가 발생하였습니다..');
  }
  if (res.responseData.code == 521) {
    alert('댓글이 정상적으로 삭제되었습니다.');
  } else if (res.responseData.code == 522) {
    return alert('댓글이 삭제되지 않았습니다.');
  } else if (res.responseData.code == 520) {
    return alert('알 수 없는 오류가 발생하였습니다..');
  }
  if (res.responseData.code == 531) {
    alert('스레드가 정상적으로 삭제되었습니다.');
  } else if (res.responseData.code == 532) {
    return alert('스레드가 삭제되지 않았습니다.');
  } else if (res.responseData.code == 530) {
    return alert('알 수 없는 오류가 발생하였습니다..');
  }
};
getReportList();
