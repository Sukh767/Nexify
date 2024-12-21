import { useState } from 'react'
import { Route, Routes} from 'react-router-dom'
import DashboardPage from './page/DashboardPage'
import ProductPage from './page/ProductPage'
import Sidebar from './components/Sidebar'


function App() {
  
  return (
    <div className='flex h-screen dark:bg-gray-900 text-gray-100 overflow-hidden'>
      {/* Baground */}
      <div className="inset-0 z-0">
        <div className='inset-0 absolute bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80'/>
        <div className='absolute inset-0 backdrop-blur-sm'/>
      </div>
      {/* Sidebar */}
      <Sidebar/>
      <Routes>
        <Route path='/' element={<DashboardPage />} />
        <Route path='/products' element={<ProductPage />} />
      </Routes>
    
    </div>
  )
}

export default App
