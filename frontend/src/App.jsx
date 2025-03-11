import React, { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { Routes, Route, Navigate } from 'react-router-dom'

import { AuthStore } from './store/auth.store';
import { ProfileStore } from './store/profile.store';

import AuthPage from './pages/authPage';
import Home from './pages/home';
import CoursePage from './pages/videoPage';
import ProfileDashboard from './pages/ProfilePage';
import CoursesPage from './pages/CoursesPage';
import Navbar from './components/Navbar';

import UploadVideoComponent from './pages/videoUpload';

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = AuthStore();
  const { ProfileData, myProfile } = ProfileStore();

  useEffect(()=>{
    checkAuth()
  },[checkAuth])

  useEffect(() => {
      if (!myProfile && checkAuth) {
        ProfileData();
      }
  }, []);
  
  if (isCheckingAuth && !authUser){
    return (
      <div className="flex items-center justify-center h-screen"> 
        loading.....................
      </div>
    );
  }

  if(!myProfile && checkAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        loading...............
      </div>
    )
  }
  
  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />
      <Navbar />
      <Routes>
        <Route path='/' element={ authUser ? <Home /> : <Navigate to="/auth" /> } />
        <Route path='/auth' element={!authUser ? <AuthPage /> : <Navigate to="/" /> } />
        <Route path='/profile' element={ authUser ? <ProfileDashboard />: <Navigate to="/auth" /> } />
        <Route path='/coursepage/:videoUrl' element={<CoursePage />} />
        <Route path='/coursespage' element={<CoursesPage />} />
        <Route path='/video' element={<UploadVideoComponent/>} />
      </Routes>
    </div>
  )
}

export default App;