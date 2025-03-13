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
  },[authUser])

  useEffect(() => {
      if (authUser && !myProfile) {
        ProfileData();
      }
  }, [authUser]);
  
  if (isCheckingAuth && !authUser){
    return (
      <div className="flex items-center justify-center h-screen"> 
        loading Auth.....................
      </div>
    );
  }

  if(authUser && !myProfile ) {
    return (
      <div className="flex items-center justify-center h-screen">
        loading profile...............
      </div>
    )
  }  

  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />
      <Navbar />
      <Routes>
        <Route path='/' element={<Home /> } />
        <Route path='/auth' element={!authUser ? <AuthPage /> : <Navigate to="/" /> } />
        <Route path='/profile' element={ authUser ? <ProfileDashboard />: <Navigate to="/auth" /> } />
        <Route path='/coursepage/:videoUrl' element={ authUser ? <CoursePage />: <Navigate to="/auth" /> }/>
        <Route path='/coursespage' element={<CoursesPage />} />
        <Route path='/uploadVideo' element={ myProfile?.role === "Student" ? <UploadVideoComponent />: <Navigate to="/" /> }/>
      </Routes>
    </div>
  )
}

export default App;