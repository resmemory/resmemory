const code = {
  510: '일시적인 오류가 발생하였습니다.',
  511: '게시글이 정상적으로 삭제되었습니다.',
  512: '정상적인 신고 요청이 아닙니다..',
  513: '이미 신고 처리가 완료되었습니다.',
  514: '존재하지 않는 게시글입니다.',
  515: '게시글이 삭제되지 않았습니다.',
  520: '일시적인 오류가 발생하였습니다.',
  521: '댓글이 정상적으로 삭제되었습니다.',
  522: '정상적인 신고 요청이 아닙니다..',
  523: '이미 신고 처리가 완료되었습니다.',
  524: '존재하지 않는 댓글입니다.',
  525: '댓글이 삭제되지 않았습니다.',
  530: '일시적인 오류가 발생하였습니다.',
  531: '스레드가 정상적으로 삭제되었습니다.',
  532: '정상적인 신고 요청이 아닙니다..',
  533: '이미 신고 처리가 완료되었습니다.',
  534: '존재하지 않는 스레드입니다.',
  535: '스레드가 삭제되지 않았습니다.',
  620: '일시적인 오류가 발생하였습니다.',
  622: '신고 조회의 권한이 없습니다.',
  630: '일시적인 오류가 발생하였습니다.',
  631: '신고가 정상 처리 되었습니다.',
  632: '로그인이 필요한 기능입니다.',
  633: '신고 처리의 권한이 없습니다.',
};
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
    await datas.responseData.result.forEach((reportList) => {
      const reportId = reportList.reportId;
      const content = reportList.content;
      const userId = reportList.userId;
      const reportType = reportList.reportType;
      const contentId = reportList.contentId;
      const isReport=reportList.isReport;
      const buttonColor = isReport ? 'blue' : 'black';

      const temp_html = `<div class="additionalBox id=${reportId}">
          <p class="additionalBoxText" id="reportContent">신고내용 : ${content}</p>
          <p class="additionalBoxText" id="userId">userId: ${userId}</p>
          <p class="additionalBoxText" id="reportType">reportType: ${reportType}</p>
          <p class="additionalBoxText" id="contentId">contentId: ${contentId}</p>
          <button class="deleteButton" id="deleteButton" onclick="deleteContent('${reportId}','${contentId}', '${reportType}')" 
          style="background-color: ${buttonColor};">삭제</button>
        </div>`;
      $('#reportBox').append(temp_html);
    });
  });
};
const deleteContent = (reportId, contentId, reportType) => {
  const req = {
    reportId: reportId,
    contentId: contentId,
  };
  fetch(`/api/admin/${reportType}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: adminId,
    },
    body: JSON.stringify(req),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.responseData.code == 511) {
        alert(code[res.responseData.code]);
        return window.location.reload();
      }
      if (res.responseData.code == 521) {
        alert(code[res.responseData.code]);
        return window.location.reload();
      }
      if (res.responseData.code == 531) {
        alert(code[res.responseData.code]);
        return window.location.reload();
      }
      alert(code[res.responseData.code]);
    });
};

getReportList();
