import { useCallback, useRef, useState } from 'react';
import Grid from '../../../../components/shared/Grid/Grid';
import { ColDef, GridGetData, GridRef } from '../../../../components/shared/Grid/grid.types';
import SDSpinner from '../../../../components/shared/Spinner';
import useAPi from '../../../../hooks/useApi';
import { TicketsReport } from '../../../../models/reports.models';
import { BaseResponse } from '../../../../models/shared.models';

interface TicketsReportGridProps {
    selectedId: string;
}


const TicketsReportGrid: React.FC<TicketsReportGridProps> = ({ selectedId }) => {
    const gridRef = useRef<GridRef>(null);

    const { sendRequest, isPending } = useAPi<null, BaseResponse<TicketsReport[]>>();

    const [colDefs] = useState<ColDef<TicketsReport>[]>([
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

    const fetchEvents = useCallback<GridGetData<TicketsReport>>(
        (gridParams, setRows) => {
            sendRequest(
                {
                    url: '/Reports/TicketsReport',
                    params: {
                        pageSize: gridParams.pageSize,
                        pageIndex: gridParams.pageIndex,
                        orderby: gridParams.sorts
                            .map((item) => `${item.field} ${item.sort}`)
                            .join(","),
                    },
                    method: 'post',
                    data: {
                        eventsId: [selectedId],
                    },
                },
                (response) => {
                    const result = response.content;
                    console.log(result);
                    setRows(result, response.total);
                },
            );
        }, [sendRequest, selectedId]
    );

    return (
        <>
            {isPending ? (
                <div className="my-12 flex justify-center">
                    <SDSpinner size={20} color="blue" />
                </div>
            ) : (
                <Grid<TicketsReport> getData={fetchEvents} rowActions={{ remove: true }}
                    colDefs={colDefs} ref={gridRef} sorts={[{ field: 'eventDate', sort: 'desc' }]} />
            )}
        </>
    );
};

export default TicketsReportGrid;

