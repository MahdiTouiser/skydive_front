import { useRef, useState } from 'react'
import Grid from '../../../../components/shared/Grid/Grid'
import { ColDef, GridRef } from '../../../../components/shared/Grid/grid.types'
import SDSpinner from '../../../../components/shared/Spinner'
import { UserTransaction } from '../../../../models/transactions.models'

const TicketsReportGrid = () => {
    const gridRef = useRef<GridRef>(null)

    const [colDefs] = useState<ColDef<UserTransaction>[]>([
        {
            field: 'eventCode',
            headerName: 'کد رویداد',
            sortable: true,
        },
        {
            field: 'eventTitle',
            headerName: 'نام رویداد',
            sortable: true,
        },
        {
            field: 'eventDate',
            headerName: 'تاریخ رویداد',
            sortable: true,
        },
        {
            field: 'flightName',
            headerName: 'نام پرواز',
            sortable: true,
        },
        {
            field: 'flightStatus',
            headerName: 'وضعیت پرواز',
            sortable: true,
        },
        {
            field: 'flightDate',
            headerName: 'تاریخ پرواز',
            sortable: true,
        },
        {
            field: 'flightNumber',
            headerName: 'شماره پرواز',
            sortable: true,
        },

        {
            field: 'ticketNumber',
            headerName: 'شماره بلیت',
            sortable: true,
        },
        {
            field: 'ticketType',
            headerName: 'نوع بلیت',
            sortable: true,
        },
        {
            field: 'fullName',
            headerName: 'نام و نام خانوادگی',
            sortable: true,
        },
        {
            field: 'nationalCode',
            headerName: 'کد ملی',
            sortable: true,
        },

        {
            field: 'phoneNumber',
            headerName: 'شماره موبایل',
            sortable: true,
        },
        {
            field: 'weight',
            headerName: 'وزن',
            sortable: true,
        },
        {
            field: 'height',
            headerName: 'قد',
            sortable: true,
        },
    ])
    return (
        <>
            <div className="my-12 flex justify-center">
                <SDSpinner size={20} color="blue"></SDSpinner>
            </div>
            <Grid<UserTransaction> colDefs={colDefs} ref={gridRef} sorts={[{ field: 'eventDate', sort: 'desc' }]} />
        </>
    )
}

export default TicketsReportGrid
