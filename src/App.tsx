import './App.css'
import { Routes, Route, BrowserRouter as Router, Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import AuthContainer from './pages/Auth/AuthContainer'
import ForgetPasswordFirstPage from './pages/Auth/forgetPassword/ForgetPasswordFirstPage'
import ForgetPasswordOtpPage from './pages/Auth/forgetPassword/ForgetPasswordOtpPage'
import ChangePasswordPage from './pages/Auth/forgetPassword/ChangePasswordPage'
import UserPanelContainer from './pages/userPanel/UserPanelContainer'
import Account from './pages/userPanel/Account'
import AdminPanelContainer from './pages/adminPanel/AdminPanelContainer'
import Cartable from './pages/adminPanel/pages/Cartable'
import { ToastContainer } from 'react-toastify'
import AuthenticatedRoute from './AuthenticatedRoute'
import UsernameLoginPage from './pages/Auth/UsernameLoginPage'
import PasswordLoginPage from './pages/Auth/PasswordLoginPage'

import OTPLoginPage from './pages/Auth/OTPLoginPage'
import Home from './pages/userPanel/Home'
import SkyDiveEventsPage from './pages/userPanel/skyDiveEvents/SkyDiveEventPage'

import AdminEvents from './pages/adminPanel/pages/adminEvents/AdminEvents'
import Settings from './pages/adminPanel/pages/Settings'
import SendMessage from './pages/adminPanel/pages/SendMessage'
import Reports from './pages/adminPanel/pages/reports/Reports'
import SkyDiveEventDaysPage from './pages/userPanel/skyDiveEvents/SkyDiveEventDaysPage'
import SkyDiveEventFlightsPage from './pages/userPanel/skyDiveEvents/SkyDiveEventFlightsPage'
import PaymentPage from './pages/Payment/PaymentPage'
import AdminFlightsPage from './pages/adminPanel/pages/adminEvents/AdminFlightsPage'
import SkyDiveEventTermsPage from './pages/userPanel/skyDiveEvents/SkyDiveEventTermsPage'
import MyTicketsPage from './pages/userPanel/MyTicketsPage'
import JumpRecordsPage from './pages/userPanel/JumpRecordsPage'
import Messages from './pages/userPanel/Messages'
import MyTransactionsPage from './pages/userPanel/MyTransactionsPage'
import Wallet from './pages/userPanel/Wallet'
import { useAppDispatch } from './hooks/reduxHooks'
import { fetchGeneralSettings } from './store/generalSettings'
import SignUpMobilePage from './pages/Auth/signUp/SingUpMobilePage'
import SignUpPasswordOtpPage from './pages/Auth/signUp/SignUpOtpPage'
import SignUpPersonaPage from './pages/Auth/signUp/SingnUpPersonalPage'
import SignUpUserInfoPage from './pages/Auth/signUp/SignUpUserInfoPage'
import UserManagement from './pages/adminPanel/pages/userManagement/UserManagement'
import CreateUserPage from './pages/adminPanel/pages/userManagement/CreateUserPage'
import UserDetailPage from './pages/adminPanel/pages/userManagement/userDetail/UserDetailPage'
import UserTickets from './pages/adminPanel/pages/userManagement/userDetail/UserTickets'
import UserTransactions from './pages/adminPanel/pages/userManagement/userDetail/UserTransactions'
import AdminUserDocument from './pages/adminPanel/pages/userManagement/userDetail/AdminUserDocument'
import AdminJumpRecords from './pages/adminPanel/pages/userManagement/userDetail/AdminJumpRecords'
import AdminUserWallet from './pages/adminPanel/pages/userManagement/userDetail/AdminUserWallet'
import EditUserPage from './pages/adminPanel/pages/userManagement/EditUserPage'
import ReportsGrid from './pages/adminPanel/pages/reports/TicketsReportGrid'
import PaymentStatus from './pages/Payment/PaymentStatus'

function App() {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchGeneralSettings())
  }, [dispatch])
  return (
    <>
      <ToastContainer rtl theme="colored" position="top-left" icon={false} closeButton={false} autoClose={2000} />

      <Router>
        <Routes>
          <Route element={<AuthenticatedRoute component={UserPanelContainer} />} path="">
            <Route Component={Home} path=""></Route>
            <Route Component={Account} path="account"></Route>
            <Route Component={Messages} path="messages"></Route>
            <Route Component={Outlet} path="events">
              <Route Component={SkyDiveEventsPage} path=":statusId?"></Route>
              <Route Component={SkyDiveEventDaysPage} path=":eventId/days"></Route>
              <Route Component={SkyDiveEventFlightsPage} path=":eventId/flights"></Route>
              <Route Component={SkyDiveEventTermsPage} path=":eventId/terms"></Route>
            </Route>
            <Route Component={MyTicketsPage} path="tickets"></Route>
            <Route Component={MyTransactionsPage} path="transactions"></Route>
            <Route Component={Wallet} path="wallet"></Route>
            <Route Component={JumpRecordsPage} path="jumps"></Route>
            <Route Component={PaymentPage} path="payment"></Route>
          </Route>
          <Route Component={PaymentStatus} path="payment-status"></Route>
          <Route Component={AuthContainer} path="auth">
            <Route Component={UsernameLoginPage} path=""></Route>
            <Route Component={PasswordLoginPage} path="password"></Route>
            <Route Component={OTPLoginPage} path="otp"></Route>
            <Route Component={() => <Outlet></Outlet>} path="forget-password">
              <Route Component={ForgetPasswordFirstPage} path=""></Route>
              <Route Component={ForgetPasswordOtpPage} path="otp"></Route>
              <Route Component={ChangePasswordPage} path="change"></Route>
            </Route>
            <Route Component={() => <Outlet></Outlet>} path="signup">
              <Route Component={SignUpMobilePage} path=""></Route>
              <Route Component={SignUpPasswordOtpPage} path="otp"></Route>
              <Route Component={SignUpPersonaPage} path="personal"></Route>
              <Route Component={SignUpUserInfoPage} path="user-info"></Route>
            </Route>
          </Route>
          <Route element={<AuthenticatedRoute component={AdminPanelContainer} />} path="admin">
            <Route Component={Cartable} path="cartable"></Route>
            <Route Component={UserManagement} path="users"></Route>
            <Route Component={CreateUserPage} path="users/create"></Route>
            <Route Component={UserDetailPage} path="users/:userId">
              <Route Component={UserTickets} path=""></Route>
              <Route Component={UserTransactions} path="transactions"></Route>
              <Route Component={AdminUserDocument} path="documents"></Route>
              <Route Component={AdminJumpRecords} path="jumps"></Route>
              <Route Component={AdminUserWallet} path="wallet"></Route>
            </Route>
            <Route Component={EditUserPage} path="users/:userId/edit"></Route>
            <Route Component={Outlet} path="events">
              <Route Component={AdminEvents} path=""></Route>
              <Route Component={AdminFlightsPage} path=":eventId/flights"></Route>
            </Route>
            <Route Component={Settings} path="settings"></Route>
            <Route Component={SendMessage} path="sendMessage"></Route>
            <Route Component={Reports} path="reports">
              <Route Component={ReportsGrid} path="tickets"></Route>
            </Route>
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
