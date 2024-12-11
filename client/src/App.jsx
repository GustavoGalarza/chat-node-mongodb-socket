import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { BrowserRouter, Navigate, Route, Router, Routes } from 'react-router-dom'
import Auth from './pages/auth'
import Chat from './pages/chat'
import Profile from './pages/profile'
import { useAppStore } from './store'
import apiClient from './lib/api-client'
import { GET_USER_INFO } from './utils/constants'
import PremiumPage from './pages/premium/premiumPages'


const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />
}

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
}

const App = () => {

  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await apiClient.get(GET_USER_INFO, { withCredentials: true });
        if (response.status === 200 && response.data.id) {
          setUserInfo(response.data);
        } else {
          setUserInfo(undefined)
        }

        console.log({ response });

      } catch (error) {
        setUserInfo(undefined)
      } finally {
        setLoading(false);
      }
    };
    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, [userInfo, setUserInfo]);
  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-lg font-bold text-white">Cargando...</p>
      </div>
    </div>
  }


  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/auth' element={<AuthRoute>
            <Auth />
          </AuthRoute>} />
          <Route path='/chat' element={<PrivateRoute>
            <Chat />
          </PrivateRoute>} />
          <Route path='/profile' element={<PrivateRoute>
            <Profile />
          </PrivateRoute>} />
          <Route path='/premium' element={<PrivateRoute>
            <PremiumPage/>
          </PrivateRoute>} />

          <Route path='*' element={<Navigate to="/auth" />} />

        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App