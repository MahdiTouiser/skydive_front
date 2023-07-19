import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import SDCard from '../../../../../components/shared/Card';
import SDTextInput from '../../../../../components/shared/TextInput';
import SDButton from '../../../../../components/shared/Button';
import { BaseResponse } from '../../../../../models/shared.models';
import useApi from '../../../../../hooks/useApi';
import { useParams } from 'react-router-dom';
import SDSpinner from '../../../../../components/shared/Spinner';
import { ChargeWalletData, WalletData } from '../../../../../models/wallet';





const AdminUserWallet: React.FC = () => {
  const params = useParams();

  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const {
    sendRequest,
    isPending,
    data: walletData,
  } = useApi<null, BaseResponse<WalletData>>();

  const { sendRequest: sendChargeRequest, isPending: isPendingChargeWallet } =
    useApi<ChargeWalletData, BaseResponse<null>>();

  const fetchWalletData = useCallback(() => {
    sendRequest({
      url: `/wallets/UserWallet/${params.userId}`,
    });
  }, [sendRequest, params.userId]);

  useEffect(() => {
    fetchWalletData();
  }, [fetchWalletData]);

  const handlePayment = useCallback(() => {
    if (paymentAmount > 0) {
      const data: ChargeWalletData = {
        userId: params.userId,
        amount: paymentAmount,
      };

      sendChargeRequest(
        {
          url: '/wallets',
          method: 'put',
          data: data,
        },
        (response) => {
          toast.success(response.message);
          fetchWalletData();
          setPaymentAmount(0);
        },
        (error) => {
          toast.error(error?.message);
        }
      );
    }
  }, [paymentAmount, params.userId, sendChargeRequest, fetchWalletData]);

  const handlePaymentAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value.replace(/,/g, '');
    const formattedValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    setPaymentAmount(parseInt(value, 10));
    event.target.value = formattedValue;
  };

  if (isPending) {
    return (
      <div className="flex justify-center pt-6 w-full">
        <SDSpinner size={20} color="blue" />
      </div>
    );
  }

  return (
    <SDCard className="flex items-center justify-center p-8 bg-red-500">
      <SDCard className="shadow rounded-lg w-full sm:max-w-md md:max-w-lg lg:max-w-xl flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4 text-center">
          شارژ کیف پول کاربر
        </h1>

        <div className="flex items-center mb-4">
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
              d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
            />
          </svg>

          <span className="text-xl m-4 text-gray-600">موجودی :</span>
          <span className="whitespace-nowrap">
            {walletData?.content
              ? walletData.content.balance.toLocaleString()
              : ''}
          </span>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center w-full space-y-4 md:space-y-0 md:space-x-4">
          <SDTextInput
            numeric={true}
            id="minutes"
            placeholder="مبلغ مورد نظر را وارد کنید"
            className="ltr text-center placeholder:!text-center"
            value={
              isNaN(paymentAmount)
                ? ''
                : paymentAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            onChange={handlePaymentAmountChange}
          />

          <SDButton
            type="submit"
            color="success"
            onClick={handlePayment}
            disabled={isPendingChargeWallet}
            className="w-full md:w-auto lg:w-1/3 "
          >
            {isPendingChargeWallet && <SDSpinner size={5} />}
            شارژ کیف پول
          </SDButton>
        </div>
      </SDCard>
    </SDCard>
  );
};

export default AdminUserWallet;