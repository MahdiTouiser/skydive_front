import { useCallback, useEffect, useState } from 'react'
import DateRangeFilter from '../../../../components/shared/DateRangeFilter'
import SearchInput from '../../../../components/shared/SearchInput'
import SDButton from '../../../../components/shared/Button'
import SDSelect from '../../../../components/shared/Select'
import useAPi from '../../../../hooks/useApi'
import { BaseResponse } from '../../../../models/shared.models'
import { SkyDiveEvent } from '../../../../models/skyDiveEvents.models'

const TicketsReportHeader: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [minDate, setMinDate] = useState<string>('')
  const [maxDate, setMaxDate] = useState<string>('')
  const [titles, setTitles] = useState<string[]>([])

  const onSearchTermChange = useCallback((term: string) => {
    setSearchTerm(term)
  }, [])

  const getReport = () => {
    console.log('mahdi')
  }

  const { sendRequest } = useAPi<null, BaseResponse<SkyDiveEvent[]>>()

  useEffect(() => {
    const fetchEvents = () => {
      sendRequest(
        {
          url: '/SkyDiveEvents',
        },
        response => {
          // Extract titles from the API response
          const eventTitles = response.content.map(event => event.title)
          setTitles(eventTitles)
        }
      )
    }
    fetchEvents()
  }, [sendRequest])

  const isDateSelected = minDate !== '' && maxDate !== ''

  return (
    <>
      <div className="flex justify-between gap-4 xl:basis-11/12">
        <div className="flex flex-wrap">
          <div className="ml-8 flex items-center justify-center pb-2">
            <SDButton color="success" onClick={getReport} disabled={!isDateSelected}>
              تهیه گزارش
            </SDButton>
          </div>
          <DateRangeFilter label="تاریخ" fromDate={minDate} toDate={maxDate} onChangeFromDate={setMinDate} onChangeToDate={setMaxDate} />
        </div>
        <div className="flex">
          <div className="mr-4 flex items-center pb-2">
            <label className="pl-1 text-sm"> عنوان رویداد :</label>
            <div className="mr-1">
              <SDSelect>
                <option value="all">همه</option>
                {titles.map((title, index) => (
                  <option key={index} value={title}>
                    {title}
                  </option>
                ))}
              </SDSelect>
            </div>
          </div>
          <div className="mr-4 flex items-center justify-center pb-2">
            <label htmlFor="search" className="pl-1 text-sm">
              جستجو:
            </label>
            <div className="mr-1">
              <SearchInput id="search" onSubmit={onSearchTermChange} searchTerm={searchTerm} placeholder="نام، نام خانوادگی، کد ملی" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TicketsReportHeader
