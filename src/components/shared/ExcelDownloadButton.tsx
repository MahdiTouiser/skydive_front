import React from 'react';
import useApi from '../../hooks/useApi';
import SDButton from './Button'; // Import SDButton component
import SDSpinner from './Spinner';

interface ExcelDownloadButtonProps {
    url: string;
    fileName: string;
    method?: string;
    body?: string[];
}

const ExcelDownloadButton: React.FC<ExcelDownloadButtonProps> = ({
    url,
    fileName,
    method = 'get',
    body
}) => {
    const { sendRequest, isPending } = useApi<string[], Blob>();

    const handleExportExcel = () => {
        sendRequest(
            {
                url: url,
                responseType: 'blob',
                method: method,
                data: body,
            },
            (response) => {
                const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
            }
        );
    };

    return (
        <>
            {isPending && <SDSpinner color="blue" />}
            {!isPending && (
                <SDButton onClick={handleExportExcel} color='success'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15M9 12l3 3m0 0 3-3m-3 3V2.25" />
                    </svg>
                    خروجی اکسل
                </SDButton>
            )}
        </>
    );
}

export default ExcelDownloadButton;
