import React, { useState, useEffect } from 'react';
import useApi from '../../../hooks/useApi';
import { userType } from '../../../models/usermanagement.models';
import { BaseResponse } from '../../../models/shared.models';
import SDSpinner from '../../../components/shared/Spinner';
import SDCard from '../../../components/shared/Card';
import { toast } from 'react-toastify';

type UserType = userType['title'];
type UserTicket = 'آزاد' | 'چارتر' | 'همراه با مربی' | 'ویژه';

interface AssignTicketTypes {
  userTypeId: string;
  ticketTypes: string[];
}

const Settings: React.FC = () => {
  const { sendRequest, isPending } = useApi<null, BaseResponse<userType[]>>();

  const [selectedUserTypes, setSelectedUserTypes] = useState<UserType[]>([]);
  const [selectedTickets, setSelectedTickets] = useState<{
    [key in UserType]: UserTicket[];
  }>({
    'همراه با مربی': [],
    آزاد: [],
    ویژه: [],
  });
  const [userTypes, setUserTypes] = useState<UserType[]>([]);

  useEffect(() => {
    sendRequest(
      {
        url: '/UserTypes',
      },
      (response) => {
        if (response?.content.length > 0) {
          const userTypeTitles = response?.content.map(
            (item: userType) => item.title
          ) as UserType[];
          setUserTypes(userTypeTitles);

          const initialSelectedTickets: {
            [key in UserType]: UserTicket[];
          } = {
            'همراه با مربی': [],
            آزاد: [],
            ویژه: [],
          };

          response?.content.forEach((userType) => {
            initialSelectedTickets[userType.title] =
              userType.allowedTicketTypes.map(
                (ticketType) => ticketType.title
              ) || [];
          });

          setSelectedTickets(initialSelectedTickets);
        }
      }
    );
  }, [sendRequest]);

  const handleUserTypeClick = (userType: UserType) => {
    if (selectedUserTypes.includes(userType)) {
      setSelectedUserTypes(
        selectedUserTypes.filter((type) => type !== userType)
      );
    } else {
      setSelectedUserTypes([...selectedUserTypes, userType]);
    }
  };

  const handleAddTicket = (userType: UserType, ticket: UserTicket) => {
    setSelectedTickets((prevState) => {
      const updatedTickets = { ...prevState };
      updatedTickets[userType] = [...prevState[userType], ticket];
      return updatedTickets;
    });
  };

  const handleRemoveTicket = (userType: UserType, ticket: UserTicket) => {
    setSelectedTickets((prevState) => {
      const updatedTickets = { ...prevState };
      updatedTickets[userType] = prevState[userType].filter(
        (t) => t !== ticket
      );
      return updatedTickets;
    });
  };

  const allowedTicketTypes: { [key in UserType]: UserTicket[] } = {
    'همراه با مربی': ['همراه با مربی', 'آزاد', 'چارتر', 'ویژه'],
    آزاد: ['همراه با مربی', 'آزاد', 'چارتر', 'ویژه'],
    ویژه: ['همراه با مربی', 'آزاد', 'چارتر', 'ویژه'],
  } as { [key in UserType]: UserTicket[] };

  if (isPending) {
    return (
      <div className="flex justify-center pt-6 w-full">
        <SDSpinner size={20} />
      </div>
    );
  }

  return (
    <>
      <SDCard>
        <div className="container mx-auto p-4">
          <div className="bg-gray-100 p-4 rounded">
            <h2 className="text-2xl font-bold mb-4">نوع کاربر</h2>
            <ul className="space-y-4">
              {userTypes.map((userType) => (
                <li
                  key={userType}
                  className={`flex flex-col ${
                    selectedUserTypes.includes(userType)
                      ? 'bg-black-200 text-blue-600'
                      : 'bg-white'
                  }`}
                  style={{
                    border: '1px solid gray',
                    borderRadius: '0.5rem',
                    transition: 'background-color 0.3s',
                  }}
                >
                  <button
                    className={`p-4 text-lg font-bold w-full text-right ${
                      selectedUserTypes.includes(userType)
                        ? 'text-blue-600'
                        : ''
                    }`}
                    onClick={() => handleUserTypeClick(userType)}
                    style={{
                      transition: 'color 0.3s',
                    }}
                  >
                    {userType}
                  </button>
                  {selectedUserTypes.includes(userType) && (
                    <ul className="space-y-2 p-4">
                      {allowedTicketTypes[userType] &&
                        allowedTicketTypes[userType].map((ticketType) => (
                          <li
                            key={ticketType}
                            className={`flex items-center ${
                              selectedTickets[userType] &&
                              selectedTickets[userType].includes(ticketType)
                                ? 'text-black'
                                : 'text-black'
                            }`}
                          >
                            <span
                              className={`px-2 ml-4 py-1 rounded-md ${
                                selectedTickets[userType] &&
                                selectedTickets[userType].includes(ticketType)
                                  ? 'bg-green-200'
                                  : 'bg-white'
                              }`}
                            >
                              {ticketType}
                            </span>
                            {!selectedTickets[userType]?.includes(
                              ticketType
                            ) && (
                              <button
                                className="px-2 py-1 rounded-md bg-green-200 ml-2 flex items-center"
                                onClick={() =>
                                  handleAddTicket(userType, ticketType)
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
                                <span className="ml-2">افزودن</span>
                              </button>
                            )}
                            {selectedTickets[userType]?.includes(
                              ticketType
                            ) && (
                              <button
                                className={`px-2 py-1 rounded-md bg-red-200 ml-2 flex items-center ${
                                  selectedTickets[userType]?.includes(
                                    ticketType
                                  )
                                    ? 'text-black'
                                    : ''
                                }`}
                                onClick={() =>
                                  handleRemoveTicket(userType, ticketType)
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
                                    d="M19.5 12h-15"
                                  />
                                </svg>
                                <span className="ml-2">حذف</span>
                              </button>
                            )}
                          </li>
                        ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SDCard>
    </>
  );
};

export default Settings;
