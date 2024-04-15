import useApi from "../../hooks/useApi";
import { printResponse } from "../../utils/shared";
import SDSpinner from "./Spinner";

interface PdfPrintButtonProps {
  pdfUrl: string;
  fileName: string;
  method?: string;
  body?: string[];
  color?: string;
}

const PdfPrintButton: React.FC<PdfPrintButtonProps> = ({
  pdfUrl,
  fileName,
  method = "get",
  body,
  color,
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
        <button onClick={handlePrint} className={color ? color : "text-cyan-600"}>
          چاپ
        </button>
      )}
    </>
  );
};

export default PdfPrintButton;
