import { useState } from 'react';
import TicketsReportGrid from './TicketsReportGrid';
import TicketsReportHeader from './TicketsReportHeader';

const TicketsReport = () => {
  const [showReportGrid, setShowReportGrid] = useState(false);
  const [selectedId, setSelectedId] = useState<string>('');

  const getReport = (id: string) => {
    setSelectedId(id);
    setShowReportGrid(true);
  };

  return (
    <>
      <TicketsReportHeader onGetReport={getReport} />
      {showReportGrid && <TicketsReportGrid selectedId={selectedId} />}
    </>
  );
};

export default TicketsReport;
