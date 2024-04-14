import { useCallback, useRef, useState } from 'react';
import Grid from '../../../../components/shared/Grid/Grid';
import { ColDef, GridGetData, GridRef } from '../../../../components/shared/Grid/grid.types';
import useAPi from '../../../../hooks/useApi';
import { TicketsReport } from '../../../../models/reports.models';
import { BaseResponse } from '../../../../models/shared.models';

interface TicketsReportGridProps {
    selectedId: string;
    searchTerm: string
}


const TicketsReportGrid: React.FC<TicketsReportGridProps> = ({ selectedId, searchTerm }) => {
    const gridRef = useRef<GridRef>(null);
    console.log(searchTerm);
    const { sendRequest } = useAPi<null, BaseResponse<TicketsReport[]>>();
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

    const fetchData = useCallback<GridGetData<TicketsReport>>(
        (gridParams, setRows) => {
            const requestData: any = {
                pageSize: gridParams.pageSize,
                pageIndex: gridParams.pageIndex,
                orderby: gridParams.sorts
                    .map((item) => `${item.field} ${item.sort}`)
                    .join(","),
            };


            if (selectedId !== "") {
                requestData.eventsId = [selectedId];
            }

            if (searchTerm.trim() !== "") {
                requestData.search = searchTerm.trim();
            }

            sendRequest(
                {
                    url: '/Reports/TicketsReport',
                    method: 'post',
                    data: requestData,
                },
                (response) => {
                    const result = response.content;
                    console.log(result);
                    setRows(result, response.total);
                },
            );
        }, [sendRequest, selectedId, searchTerm]
    );



    return (
        <div className='mt-8'>
            <Grid<TicketsReport> getData={fetchData} rowActions={null}
                colDefs={colDefs} ref={gridRef} sorts={[{ field: 'eventDate', sort: 'desc' }]} />
        </div>
    );
};

export default TicketsReportGrid;

