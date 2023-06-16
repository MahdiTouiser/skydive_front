import { useForm } from "react-hook-form";
import SDButton from "../../../../components/shared/Button";
import { Link, useNavigate } from "react-router-dom";
import { ChangeEvent, useState } from "react";
import useAPi from "../../../../hooks/useApi";
import { useAppDispatch } from "../../../../hooks/reduxHooks";
import { authActions } from "../../../../store/auth";
import { BaseResponse } from "../../../../models/shared";
import SDSpinner from "../../../../components/shared/Spinner";
import { OTPRequest, OTPResponse } from "../../../../models/auth";

const SignUpMobilePage: React.FC = () => {
  const {
    register,
    formState: { errors, isSubmitted },
    handleSubmit,
  } = useForm<{ phone: string }>({
    mode: "onTouched",
  });

  const {
    sendRequest,
    errors: apiErrors,
  } = useAPi<{ phone: string }, BaseResponse<string>>();

  const { sendRequest: sendOtpRequest, errors: otpErrors } = useAPi<
    OTPRequest,
    OTPResponse
  >();

  const [finalPending, setFinalPending] = useState<boolean>(false)

  const dispatch = useAppDispatch();

  const [acceptRules, setAcceptRules] = useState<boolean>(false);

  const navigate = useNavigate();

  function onChangeAcceptance(evenet: ChangeEvent<HTMLInputElement>) {
    setAcceptRules(!!evenet.target.value);
  }

  function navigateToNextPage() {
    navigate("otp");
  }

  function requestOtp(phone: string) {
    sendOtpRequest(
      {
        url: "/Users/OtpRequest",
        method: "post",
        data: { username: phone },
      },
      () => {
        setFinalPending(false);
        navigateToNextPage()
      }
    );
  }

  function onSubmit(data: { phone: string }) {
    if (!acceptRules) {
      return;
    }
    console.log(data, acceptRules);
    setFinalPending(true)
    sendRequest(
      {
        url: "/users/register",
        method: "post",
        data: data,
      },
      (reponse) => {
        dispatch(
          authActions.signUpPhone({ phone: data.phone, id: reponse.content })
        );
        requestOtp(data.phone);
      }
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-8 w-full">
      <h1 className="mb-6 text-lg font-semibold">ایجاد حساب کاربری</h1>
      <div className="flex w-full gap-1">
        <div className="relative w-full mb-0">
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
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
                d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
              />
            </svg>
          </div>
          <input
            {...register("phone", {
              required: "لطفا شماره موبایل خود را وارد کنید.",
              pattern: {
                value: /(\+98|0|0098)9\d{9}$/,
                message: "شماره موبایل صحیح نیست.",
              },
            })}
            type="text"
            id="input-group-1"
            className={`${
              errors.phone
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 focus:border-blue-500"
            } ltr placeholder:text-right w-full h-10 bg-gray-50 border  text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block pr-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
            placeholder="شماره موبایل خود را وارد کنید"
          />
        </div>
        <div className="">
          <SDButton className="w-full" type="submit" color="success" disabled={finalPending}>
            {(finalPending) && <SDSpinner />}
            ادامه
          </SDButton>
        </div>
      </div>
      <div className="flex items-center mr-4 mt-2">
        <input
          id="red-radio"
          type="radio"
          value="accept"
          checked={acceptRules}
          onChange={onChangeAcceptance}
          name="colored-radio"
          className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <label
          htmlFor="red-radio"
          className="mr-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          <a href="" className="inline-block ml-1 text-blue-600">
            قوانین
          </a>
          را مطالعه کرده‌ام و می‌پذیرم.
        </label>
      </div>
      {errors.phone?.message && (
        <p className="text-red-600 text-sm pr-2 mt-2">{errors.phone.message}</p>
      )}
      {isSubmitted && !acceptRules && (
        <p className="text-red-600 text-sm pr-2 mt-2">
          برای ایجاد حساب کاربری باید قوانین را بپذیرید.
        </p>
      )}

      {apiErrors && (
        <p className="text-red-600 text-sm pr-2 mt-2">{apiErrors.message}</p>
      )}

      {otpErrors && (
        <p className="text-red-600 text-sm pr-2 mt-2">{otpErrors.message}</p>
      )}

      <div className="flex items-center gap-2 mt-6 justify-center ">
        <p>حساب کاربری دارید؟</p>
        <Link to="../">
          <SDButton color="success" className="w-full">
            ورود
          </SDButton>
        </Link>
      </div>
    </form>
  );
};

export default SignUpMobilePage;
