import React, { useEffect, useState } from 'react';

import useAPi from '../../hooks/useApi';
import useConfirm from '../../hooks/useConfirm';
import { BaseResponse } from '../../models/shared.models';
import { toast } from 'react-toastify';
import AdminEventModal from './AdminEventModal';
import {
  AdminGridProps,
  SkyDiveEvent,
  SkyDiveEventStatus,
} from '../../models/skyDiveEvents.models';
import SDSpinner from '../shared/Spinner';

const AdminGridActions: React.FC<AdminGridProps> = ({ fetchData, rowId }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { sendRequest, errors, isPending } = useAPi<
    null,
    BaseResponse<string>
  >();
  const { sendRequest: eventStatusSendRequest, data: eventStatusData } = useAPi<
    null,
    BaseResponse<SkyDiveEventStatus[]>
  >();
  const { sendRequest: editModalSendRequest, data: editModalData } = useAPi<
    null,
    BaseResponse<SkyDiveEvent>
  >();

  const [ConfirmModal, confirmation] = useConfirm(
    ' رویداد شما حذف خواهد شد. آیا مطمئن هستید؟ ',
    'حذف کردن رویداد'
  );
  useEffect(() => {
    const fetchEventStatuses = () => {
      try {
        eventStatusSendRequest({
          url: '/SkyDiveEventStatuses',
        });
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchEventStatuses();
  }, [eventStatusSendRequest]);

  const handleEditOnClick = (id?: string) => {
    setIsEditModalOpen(true);
    try {
      editModalSendRequest({
        url: `/SkyDiveEvents/${id}`,
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
  };
  const handleMoreOnClick = () => {
    console.log('More clicked');
  };
  const handleDeleteOnClick = (id: string) => {
    confirmation().then((confirmed) => {
      if (confirmed) {
        sendRequest(
          {
            url: `/SkyDiveEvents/${id}`,
            method: 'delete',
          },
          (response) => {
            console.log('Response:', response);
            toast.success(response.message);
            fetchData();
          },
          (error) => {
            console.log('Error:', error);
            toast.error(error?.message);
          }
        );
      }
    });
  };
  return (
    <>
      {editModalData && (
        <AdminEventModal
          showModal={isEditModalOpen}
          onOpenModal={handleEditOnClick}
          onCloseModal={handleEditModalClose}
          fetchData={fetchData}
          lastCode={editModalData?.content.code}
          eventData={editModalData}
          eventStatusData={eventStatusData}
        />
      )}

      <ConfirmModal />
      <div className="flex items-center">
        <button onClick={() => handleEditOnClick(rowId)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 text-cyan-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>
        </button>
        <button onClick={handleMoreOnClick} className="mr-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5  text-cyan-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            />
          </svg>
        </button>
        <button onClick={() => handleDeleteOnClick(rowId)} className="mr-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 text-red-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
        </button>
      </div>
    </>
  );
};

export default AdminGridActions;
