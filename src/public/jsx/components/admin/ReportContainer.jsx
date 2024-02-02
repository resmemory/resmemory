import React from 'react';
import GetReport from './GetReport.jsx';

const style = {
  div: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  foo: {
    height: '50px',
  },
};
function ReportContainer() {
  return (
    <div style={style.div}>
      <h1>신고 내역</h1>
      <GetReport />
      <foo style={style.foo} />
    </div>
  );
}

export default ReportContainer;
