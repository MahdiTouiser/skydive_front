import { useState } from 'react';

import TicketsReportGrid from './TicketsReportGrid';
import TicketsReportHeader from './TicketsReportHeader';

const TicketsReport = () => {
  const [showReportGrid, setShowReportGrid] = useState(false);

  const getReport = () => {
    setShowReportGrid(true);
  };

  return (
    <>
      <TicketsReportHeader onGetReport={getReport} />
      {showReportGrid && <TicketsReportGrid />}
    </>
  );
};

export default TicketsReport;
