import ReportsCard from './ReportsCard'
import { useState } from 'react'
import ReportsGrid from './TicketsReportGrid'
import { useLocation } from 'react-router-dom'

const Reports = () => {
  const [showGrid, setShowGrid] = useState(false)
  const location = useLocation()

  const handleCardClick = () => {
    setShowGrid(true)
  }

  return (
    <>
      {location.pathname === '/admin/reports' && !showGrid && (
        <div className="my-3 w-full px-2 sm:w-1/2 md:w-1/3 lg:w-1/4">
          <ReportsCard onClick={handleCardClick} />
        </div>
      )}
      {showGrid && <ReportsGrid />}
    </>
  )
}

export default Reports
