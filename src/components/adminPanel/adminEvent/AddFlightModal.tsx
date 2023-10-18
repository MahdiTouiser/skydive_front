import { useFieldArray, useForm } from "react-hook-form";
import SDModal from "../../shared/Modal/Modal";
import {
  AddFlightRequest,
  SkyDiveEventTicketType,
} from "../../../models/skyDiveEvents.models";
import SDLabel from "../../shared/Label";
import SDTextInput from "../../shared/TextInput";
import { useEffect, useState } from "react";
import SDSelect from "../../shared/Select";
import SDButton from "../../shared/Button";
import useAPi from "../../../hooks/useApi";
import { BaseResponse } from "../../../models/shared.models";
import SDSpinner from "../../shared/Spinner";
import { toast } from "react-toastify";

interface AddFlightModalProps {
  dayId: string;
  date: string;
  showModal: boolean;
  onCloseModal: (submitted: boolean) => void;
}

const AddFlightModal: React.FC<AddFlightModalProps> = ({
  dayId,
  date,
  showModal,
  onCloseModal,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    control,
    reset,
    watch,
  } = useForm<AddFlightRequest>({
    mode: "onTouched",
    defaultValues: {
      voidableQty: 0,
      ticketTypes: [
        {
          qty: 0,
          typeId: "",
        },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "ticketTypes",
  });

  const {
    sendRequest: getTicketTypesRequest,
    isPending: typesPending,
    data: tickeTypeResponse,
  } = useAPi<null, BaseResponse<SkyDiveEventTicketType[]>>();

  const { sendRequest: saveRequest, isPending: savePending } = useAPi<
    AddFlightRequest,
    BaseResponse<null>
  >();

  const [totalCapacity, setTotalCapacity] = useState<number>();

  function resetModal(submitted: boolean) {
    reset();
    onCloseModal(submitted);
  }

  function onSubmit(data: AddFlightRequest) {
    saveRequest(
      {
        url: `/SkyDiveEvents/AddFlight/${dayId}`,
        data: data,
        method: "post",
      },
      (response) => {
        toast.success(response.message);
        resetModal(true);
      },
      (error) => {
        toast.error(error?.message);
      }
    );
  }

  function addTicket() {
    append({
      qty: 0,
      typeId: "",
    });
  }

  function removeTicket(index: number) {
    remove(index);
  }

  useEffect(() => {
    const fetchEventTicketType = () => {
      getTicketTypesRequest({
        url: "/SkyDiveEventTicketType",
        params: {
          pageIndex: 1,
          pageSize: 1000000000,
        },
      });
    };

    fetchEventTicketType();
  }, [getTicketTypesRequest]);

  useEffect(() => {
    function getCapacityById(
      types: SkyDiveEventTicketType[],
      id: string
    ): number {
      const ticketType = types.find((item) => item.id === id);
      if (!ticketType) {
        return 0;
      }
      return ticketType.capacity;
    }

    const subscription = watch((value) => {
      let total = 0;
      if (tickeTypeResponse?.content && value.ticketTypes) {
        total = value.ticketTypes.reduce((prev, currentItem) => {
          if (currentItem?.typeId && currentItem?.qty !== undefined) {
            return (
              prev +
              currentItem.qty *
                getCapacityById(tickeTypeResponse.content, currentItem.typeId)
            );
          }
          return prev;
        }, total);
        setTotalCapacity(total - Number(value.voidableQty));
      }
    });
    return () => subscription.unsubscribe();
  }, [tickeTypeResponse, watch]);

  return (
    <SDModal show={showModal} onClose={() => resetModal(false)}>
      <SDModal.Header color="primary2">ایجاد پرواز</SDModal.Header>
      <SDModal.Body>
        <div className="px-3 py-5">
          <div className="flex flex-col gap-3 items-center text-slate-700 text-center w-full">
            <div className="flex gap-6">
              <p className="font-semibold">تاریخ</p>
              <p>{date}</p>
            </div>
            <div className="flex gap-6">
              <p className="font-semibold">ظرفیت هر پرواز</p>
              {totalCapacity === undefined || isNaN(Number(totalCapacity)) ? (
                <p>-</p>
              ) : (
                <p
                  className={`${
                    Number(totalCapacity) > 0
                      ? 'text-green-500'
                      : 'text-red-600'
                  }  ltr`}
                >
                  {totalCapacity}
                </p>
              )}
            </div>
          </div>
          {typesPending && (
            <div className="flex justify-center my-12">
              <SDSpinner size={20} color="blue"></SDSpinner>
            </div>
          )}
          {tickeTypeResponse?.content && !typesPending && (
            <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="w-full flex flex-wrap">
                <div className="w-full md:w-1/2 px-5 py-3">
                  <SDLabel htmlFor="flightQty" className="mb-2">
                    تعداد پرواز
                  </SDLabel>
                  <SDTextInput
                    numeric={true}
                    id="flightQty"
                    invalid={!!formErrors.flightQty}
                    {...register('flightQty', {
                      required: 'فیلد اجباری است.',
                      valueAsNumber: true,
                      validate: (value) => {
                        return value > 0 || 'مقدار باید بزرگ‌تر از 0 باشد.';
                      },
                    })}
                  />
                  {formErrors.flightQty?.message && (
                    <p className="text-red-600 text-xs pr-2 mt-2">
                      {formErrors.flightQty.message}
                    </p>
                  )}
                </div>
                <div className="w-full md:w-1/2 px-5 py-3">
                  <SDLabel htmlFor="voidableQty" className="mb-2">
                    غیر قابل رزرو
                  </SDLabel>
                  <SDTextInput
                    readOnly
                    numeric={true}
                    id="voidableQty"
                    invalid={!!formErrors.voidableQty}
                    {...register('voidableQty', {
                      required: 'فیلد اجباری است.',
                      valueAsNumber: true,
                      validate: (value) => {
                        return value >= 0 || 'مقدار نمی‌تواند منفی باشد.';
                      },
                    })}
                  />
                  {formErrors.voidableQty?.message && (
                    <p className="text-red-600 text-xs pr-2 mt-2">
                      {formErrors.voidableQty.message}
                    </p>
                  )}
                </div>
              </div>
              <section className=" mt-8">
                <div className="w-full flex">
                  <div className="w-5/12 px-5 pl-1">
                    <SDLabel className="mb-2">نوع</SDLabel>
                  </div>
                  <div className="w-4/12 px-5 pl-1">
                    <SDLabel className="mb-2">تعداد</SDLabel>
                  </div>
                </div>
                {fields.map((field, index) => {
                  return (
                    <div key={field.id} className="w-full flex  mb-3">
                      <div className="w-5/12 px-5 pl-1">
                        <SDSelect
                          id={`ticketType-${index}`}
                          {...register(`ticketTypes.${index}.typeId` as const, {
                            required: 'فیلد اجباری است.',
                          })}
                          invalid={
                            !!formErrors?.ticketTypes?.[index]?.typeId?.message
                          }
                        >
                          <option></option>
                          {tickeTypeResponse.content.map((item, index) => {
                            return (
                              <option key={index} value={item.id}>
                                {item.title}
                              </option>
                            );
                          })}
                        </SDSelect>
                        {formErrors?.ticketTypes?.[index]?.typeId && (
                          <p className="text-red-600 text-xs pr-2 mt-2">
                            {formErrors?.ticketTypes?.[index]?.typeId?.message}
                          </p>
                        )}
                      </div>
                      <div className="w-4/12 px-5 pl-1">
                        <SDTextInput
                          numeric={true}
                          id={`qty-${index}`}
                          {...register(`ticketTypes.${index}.qty` as const, {
                            required: 'فیلد اجباری است.',
                            valueAsNumber: true,
                            validate: (value) => {
                              return (
                                value > 0 || 'مقدار باید بزرگ‌تر از 0 باشد.'
                              );
                            },
                          })}
                          invalid={
                            !!formErrors?.ticketTypes?.[index]?.qty?.message
                          }
                        />
                        {formErrors?.ticketTypes?.[index]?.qty && (
                          <p className="text-red-600 text-xs pr-2 mt-2">
                            {formErrors?.ticketTypes?.[index]?.typeId?.message}
                          </p>
                        )}
                      </div>
                      <div className="w-4/12 xs:w-3/12 flex  pl-5 pr-2 justify-between">
                        {fields.length !== 1 && (
                          <SDButton
                            color="primary"
                            className="font-extrabold !h-10 w-10"
                            onClick={() => removeTicket(index)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                              />
                            </svg>
                          </SDButton>
                        )}
                        {fields.length - 1 === index && (
                          <SDButton
                            className=" mr-1 !h-10 w-10"
                            onClick={addTicket}
                            disabled={
                              index === tickeTypeResponse.content.length - 1
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 4.5v15m7.5-7.5h-15"
                              />
                            </svg>
                          </SDButton>
                        )}
                      </div>
                    </div>
                  );
                })}
              </section>
              <div className="w-full px-5 pt-5 flex justify-start items-center">
                <SDButton
                  color="primary2"
                  type="submit"
                  className="w-full"
                  disabled={savePending}
                >
                  {savePending && <SDSpinner color="blue" />}
                  افزودن
                </SDButton>
              </div>
            </form>
          )}
        </div>
      </SDModal.Body>
    </SDModal>
  );
};

export default AddFlightModal;
