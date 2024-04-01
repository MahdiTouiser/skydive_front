import { useCallback, useEffect, useState } from 'react'
import DateRangeFilter from '../../../../components/shared/DateRangeFilter'
import SearchInput from '../../../../components/shared/SearchInput'
import SDButton from '../../../../components/shared/Button'
import SDSelect from '../../../../components/shared/Select'
import useAPi from '../../../../hooks/useApi'
import { BaseResponse } from '../../../../models/shared.models'
import { SkyDiveEvent } from '../../../../models/skyDiveEvents.models'
import SDTooltip from '../../../../components/shared/Tooltip'
import SDSpinner from '../../../../components/shared/Spinner'

const TicketsReportHeader: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [minDate, setMinDate] = useState<string>('')
  const [maxDate, setMaxDate] = useState<string>('')
  const [titles, setTitles] = useState<string[]>([])
  const isDateSelected = minDate !== '' && maxDate !== ''

  const onSearchTermChange = useCallback((term: string) => {
    setSearchTerm(term)
  }, [])

  const getReport = () => {
    console.log('mahdi')
  }

  const { sendRequest, isPending } = useAPi<null, BaseResponse<SkyDiveEvent[]>>()

  useEffect(() => {
    const fetchEvents = () => {
      if (isDateSelected) {
        sendRequest(
          {
            url: '/SkyDiveEvents',
            params: {
              start: minDate,
              end: maxDate,
            },
          },
          response => {
            const eventTitles = response.content.map(event => event.title)
            setTitles(eventTitles)
          }
        )
      }
    }
    fetchEvents()
  }, [minDate, maxDate, sendRequest])

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
              {isPending ? (
                <div className="flex justify-center">
                  <SDSpinner size={5} color="blue"></SDSpinner>
                </div>
              ) : (
                <SDSelect disabled={!isDateSelected}>
                  <option value="all">همه</option>
                  {titles.map((title, index) => (
                    <option key={index} value={title}>
                      {title}
                    </option>
                  ))}
                </SDSelect>
              )}
            </div>
          </div>
          <div className="mr-4 flex items-center justify-center pb-2">
            <label htmlFor="search" className="pl-1 text-sm">
              جستجو:
            </label>
            <SDTooltip content="نام رویداد ، تاریخ پرواز ، شماره بلیت ، نوع بلیت ، نام و نام خانوادگی ، کد ملی ، کد کاربر" trigger="hover" placement="bottom" className="flex self-end">
              <div className="mr-1 w-60">
                <SearchInput
                  id="search"
                  onSubmit={onSearchTermChange}
                  searchTerm={searchTerm}
                  placeholder="نام رویداد ، تاریخ پرواز ، شماره بلیت ، نوع بلیت ، نام و نام خانوادگی ، کد ملی ، کد کاربر "
                />
              </div>
            </SDTooltip>
          </div>
        </div>
      </div>
    </>
  )
}

export default TicketsReportHeader
