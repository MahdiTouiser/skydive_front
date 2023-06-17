import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHooks";
import { DocumnetStatus } from "../../../models/account.models";
import { UserDocumentsFieldType, accoutnActions } from "../../../store/account";
import SDDatepicker from "../../shared/DatePciker";
import SDLabel from "../../shared/Label";
import LabeledFileInput from "../../shared/LabeledFileInput";

interface DocumentItemProps {
  field:UserDocumentsFieldType;
  title: string;
  withDate?: boolean;
  validation?: boolean;
}

const DocumentItemComponent: React.FC<DocumentItemProps> = ({
  title,
  withDate = false,
  validation,
  field
}) => {
  const documentData = useAppSelector(state=>state.account[field]);
  const dispatch = useAppDispatch();
  function onFileUpload(id: string) {
    dispatch(accoutnActions.setDocumnetFile({field:field,fileId: id}))

  }

  function onFileRemove(){
    dispatch(accoutnActions.setDocumnetFile({field:field,fileId: ''}))
  }

  function onDateChange(value: string) {
    dispatch(accoutnActions.setDocumnetExpireDate({field:field,date: value}))
  }

  const statusColorMap = new Map([
    [DocumnetStatus.NOT_LOADED, "text-blue-700"],
    ['', "text-blue-700"],
    [DocumnetStatus.PENDING, "text-orange-500"],
    [DocumnetStatus.CONFIRMED, "text-green-500"],
    [DocumnetStatus.EXPIRED, "text-red-600"]
  ]);
  return (
    <div className="flex justify-between mb-10 items-center flex-wrap">
      <div className=" basis-1/3  xs:basis-1/2 md:basis-1/3">
        <p className="text-slate-500 ">{title}</p>
        {withDate && (
          <div className="relative pt-5">
            <SDLabel className="absolute bg-white text-sm top-2 px-1 right-2">
              تاریخ انقضا
            </SDLabel>
            <SDDatepicker
              inputClass=" !xs:w-40 text-center !bg-white border-slate-500"
              name="expireDate"
              onChange={onDateChange}
              required={true}
              manualInvalid={validation && !!documentData?.fileId && !documentData?.expirationDate}
              value={documentData?.expirationDate || ''}
            ></SDDatepicker>
            {validation && !!documentData?.fileId && !documentData?.expirationDate && (
              <p className="text-red-600 text-sm pr-2 mt-2">
                تاریخ انقضا برای این مدرک الزامی است.
              </p>
            )}
          </div>
        )}
      </div>
      <div>
        <LabeledFileInput
          accepFiles="application/pdf,image/*"
          title={title}
          onUpload={onFileUpload}
          onRemove={onFileRemove}
        />
      </div>
      <p className={`${statusColorMap.get(documentData?.status || '')} font-semibold`}>{ documentData?.statusDisplay || 'بارگذاری نشده' }</p>
    </div>
  );
};

export default DocumentItemComponent;
