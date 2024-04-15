import { useCallback, useRef, useState } from 'react';
import Grid from '../../../../components/shared/Grid/Grid';
import { ColDef, GridGetData, GridRef } from '../../../../components/shared/Grid/grid.types';
import PdfPrintButtonWithSDButton from '../../../../components/shared/PdfPrintButtonWithSDButton';
import useAPi from '../../../../hooks/useApi';
import { TicketsReport } from '../../../../models/reports.models';
import { BaseResponse } from '../../../../models/shared.models';

interface TicketsReportGridProps {
    selectedId: string
    searchTerm: string
}


const TicketsReportGrid: React.FC<TicketsReportGridProps> = ({ selectedId, searchTerm }) => {
    const gridRef = useRef<GridRef>(null);
    const { sendRequest } = useAPi<null, BaseResponse<TicketsReport[]>>();
    const [printId, setPrintId] = useState('');
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                    setRows(result, response.total);
                    setPrintId(response.message)
                },
            );
        }, [sendRequest, selectedId, searchTerm]
    );



    return (
        <>
            <div className='flex justify-end mt-8'>
                <PdfPrintButtonWithSDButton
                    pdfUrl={`${import.meta.env.VITE_BASE_API_URL}/Reports/PrintTicketsReport/${printId}`}
                    fileName={'گزارش بلیت ها'}
                    method='put' />
            </div>


            <div className='mt-2'>
                <Grid<TicketsReport> getData={fetchData} rowActions={null} colDefs={colDefs} ref={gridRef} sorts={[{ field: 'eventDate', sort: 'desc' }]} />
            </div>
        </>

    );
};

export default TicketsReportGrid;

