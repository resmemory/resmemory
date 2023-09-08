document.addEventListener('DOMContentLoaded', () => {
  getReportList();
});

const adminId = sessionStorage.getItem('Authorization');
async function getReportList() {
  const response = await fetch(`/api/reports`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: adminId,
    },
    body: JSON.stringify(),
  });
  const result = await response.json();
  const data = result.responseData.result;
  const reportBox = document.querySelector('#reportBox');
  reportBox.innerHTML = '';
  const tempHtml = data.map((report) => {
    const reportId = report.reportId;
    const content = report.content;
    const userId = report.userId;
    const reportType = report.reportType;
    const contentId = report.contentId;
    const isReport = report.isReport;
    let buttonColor;
    if (isReport === 'true') {
      buttonColor = 'blue';
    } else if (isReport === '2') {
      buttonColor = 'gray';
    } else if (isReport === 'false') {
      buttonColor = 'black';
    }
    return `<div class="additionalBox id=${reportId}">
  <p class="additionalBoxText" id="reportContent">신고내용 : ${content}</p>
  <p class="additionalBoxText" id="userId">userId: ${userId}</p>
  <p class="additionalBoxText" id="reportType">reportType: ${reportType}</p>
  <p class="additionalBoxText" id="contentId">contentId: ${contentId}</p>
  <button class="deleteButton" id="deleteButton" onclick="deleteContent('${reportId}','${contentId}', '${reportType}')" 
  style="background-color: ${buttonColor};">삭제</button>
</div>`;
  });
  reportBox.innerHTML = tempHtml;
}
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

  return window.location.reload();
}
