import { useCallback, useState } from 'react'
import DateRangeFilter from '../../../../components/shared/DateRangeFilter'
import SearchInput from '../../../../components/shared/SearchInput'
import SDButton from '../../../../components/shared/Button'
import SDTextInput from '../../../../components/shared/TextInput'

const TicketsReportGrid: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [minDate, setMinDate] = useState<string>('')
  const [maxDate, setMaxDate] = useState<string>('')

  const onSearchTermChange = useCallback((term: string) => {
    setSearchTerm(term)
  }, [])

  const getReport = () => {
    console.log('mahdi')
  }

  return (
    <>
      <div className="flex flex-wrap justify-between gap-4 xl:basis-11/12">
        <div className="flex flex-wrap">
          <div className="ml-8 flex items-center justify-center pb-2">
            <SDButton color="success" onClick={getReport}>
              تهیه گزارش
            </SDButton>
          </div>

          <div className="mr-4 flex items-center justify-center pb-2">
            <label className="pl-1 text-sm"> عنوان رویداد :</label>
            <div className="mr-1">
              <SDTextInput type="text" id="title" />
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
        <DateRangeFilter label="تاریخ" fromDate={minDate} toDate={maxDate} onChangeFromDate={setMinDate} onChangeToDate={setMaxDate} />
      </div>
    </>
  )
}

export default TicketsReportGrid
