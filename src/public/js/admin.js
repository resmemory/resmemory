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
  getAllreport.then((datas) => {
    $('#reportBox').empty();
    datas.responseData.result.forEach((reportList) => {
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
const deleteContent = () => {};
getReportList();
