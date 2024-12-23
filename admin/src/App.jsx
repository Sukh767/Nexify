import { Route, Routes } from "react-router-dom";

import Sidebar from "./components/common/Sidebar";
import ProductPage from "./pages/ProductPage";
import DashboardPage from "./pages/DashboardPage";
import UsersPage from "./pages/UsersPage";
import SalesPage from "./pages/SalesPage";
import OrdersPage from "./pages/OrdersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/Settingspage";
import Login from "./components/Authentication/Login";
import SignUp from "./components/Authentication/SignUp";
import ResetPassword from "./components/Authentication/ResetPassword";
import ForgotPassword from "./components/Authentication/ForgotPassword";

function App() {
	return (
		<div className='flex h-screen bg-gray-900 text-gray-100 overflow-hidden'>
			{/* BG */}
			<div className='fixed inset-0 z-0'>
				<div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80' />
				<div className='absolute inset-0 backdrop-blur-sm' />
			</div>

			<Sidebar />
			<Routes>
				<Route path='/' element={<DashboardPage />} />
				<Route path='/products' element={<ProductPage />} />
				<Route path='/users' element={<UsersPage/>} />
				<Route path='/sales' element={<SalesPage/>} />
				<Route path='/orders' element={<OrdersPage />} />
				<Route path='/analytics' element={<AnalyticsPage />} />
				<Route path='/settings' element={<SettingsPage />} />
				<Route path='/auth/login' element={<Login/>}/>
				<Route path='/auth/signup' element={<SignUp/>}/>
				<Route path='/auth/reset-password' element={<ResetPassword/>}/>
				<Route path='/auth/forgot-password' element={<ForgotPassword/>}/>
			</Routes>
		</div>
	);
}

export default App;