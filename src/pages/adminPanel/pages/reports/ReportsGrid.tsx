import { useCallback, useState } from 'react'
import DateRangeFilter from '../../../../components/shared/DateRangeFilter'
import SearchInput from '../../../../components/shared/SearchInput'
import SDButton from '../../../../components/shared/Button'
import SDLabel from '../../../../components/shared/Label'
import SDTextInput from '../../../../components/shared/TextInput'

const ReportsGrid: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [minDate, setMinDate] = useState<string>('')
  const [maxDate, setMaxDate] = useState<string>('')

  const onSearchTermChange = useCallback((term: string) => {
    setSearchTerm(term)
  }, [])
  return (
    <div>
      <div className="flex flex-wrap justify-between gap-4 xl:basis-11/12">
        <div className="flex flex-wrap">
          <div className="ml-8 flex items-center justify-center pb-2">
            <SDButton color="success">تهیه گزارش</SDButton>
          </div>

          <DateRangeFilter label="تاریخ" fromDate={minDate} toDate={maxDate} onChangeFromDate={setMinDate} onChangeToDate={setMaxDate} />
          <div className="align-center mr-4 flex justify-center">
            <SDLabel className="mb-2">عنوان رویداد </SDLabel>
            <SDTextInput type="text" id="title" />
          </div>
          <div className="flex items-center justify-center pb-2">
            <label htmlFor="search" className="pl-1 text-sm">
              جستجو:
            </label>
            <div className="mr-1">
              <SearchInput id="search" onSubmit={onSearchTermChange} searchTerm={searchTerm} placeholder="نام، نام خانوادگی، کد ملی" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportsGrid
