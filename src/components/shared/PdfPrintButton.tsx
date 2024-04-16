import React from "react";
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
  useSDButton: boolean;
  inputText?: string;
}

const PdfPrintButton: React.FC<PdfPrintButtonProps> = ({
  pdfUrl,
  fileName,
  method = "get",
  body,
  color,
  useSDButton = false,
  inputText = "چاپ",
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
      {isPending && <SDSpinner color="blue" />}
      {!isPending && (
        <>
          {useSDButton ? (
            <SDButton
              onClick={handlePrint}
              className="text-white"
              color={color ? "success" : "primary2"}
            >
              {inputText}
            </SDButton>
          ) : (
            <button
              onClick={handlePrint}
              className={color ? color : "text-cyan-600"}
            >
              {inputText}
            </button>
          )}
        </>
      )}
    </>
  );
};

export default PdfPrintButton;
