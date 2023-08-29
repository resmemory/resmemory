import Reports from './db/reports.db';

async function reports(method, params, responseData) {
  if (method == 'POST') {
    try {
      if (!params.userId) {
        responseData = { code: 612 };
        return responseData;
      }
      const userId = params.userId;
      const { reportType, content, contentId } = params.bodies;
      const isExistreport = await Reports.findOne({ where: { userId, contentId } });
      if (!reportType && !contentId) {
        responseData = { code: 612 };
      } else if (isExistreport) {
        responseData = { code: 614 };
      } else if (!content) {
        responseData = { code: 613 };
      } else {
        const result = await Reports.create({
          userId,
          reportType,
          content,
          contentId,
        });
        responseData = { code: 611 };
      }
    } catch (error) {
      responseData = { code: 610, error };
    }
  }
  if (method == 'GET') {
    try {
      const userId = params.userId;
      if (userId !== 1) {
        responseData = { code: 622 };
      } else {
        const result = await Reports.findAll();
        responseData = { code: 621, result };
      }
    } catch (error) {
      responseData = { code: 620 };
    }
  }
  if (method == 'PATCH') {
    try {
      if (!params.userId) {
        responseData = { code: 632 };
        return responseData;
      }
      const userId = params.userId;
      const { reportId } = params.bodies;
      if (userId !== 1) {
        responseData = { code: 632 };
      } else {
        await Reports.update({ isReport: true }, { where: { reportId } });
        responseData = { code: 631 };
      }
    } catch (error) {
      console.log(error);
      responseData = { code: 630 };
    }
  }
  return responseData;
}
export default reports;
