import useApi from "../../hooks/useApi";
import { printResponse } from "../../utils/shared";
import SDButton from "./Button";
import SDSpinner from "./Spinner";

interface PdfPrintButtonProps {
    pdfUrl: string;
    fileName: string;
    method?: string;
    body?: string[];
    color?: string;
}

const PdfPrintButtonWithSDButton: React.FC<PdfPrintButtonProps> = ({
    pdfUrl,
    fileName,
    method = "get",
    body,
}) => {
    const { sendRequest, isPending } = useApi<string[], Blob>();
    const handlePrint = () => {
        sendRequest(
            {
                url: pdfUrl,
                responseType: "blob",
                method: method,
                data: body,
            },
            (response) => {
                printResponse(fileName, response);
            }
        );
    };

    return (
        <>
            {isPending && <SDSpinner color="blue"></SDSpinner>}
            {!isPending && (
                <SDButton onClick={handlePrint} className='text-white' color='primary2'>
                    چاپ
                </SDButton>
            )}
        </>
    );
};

export default PdfPrintButtonWithSDButton;
