import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ResumeUpload from './pages/ResumeUpload';
import InterviewSetup from './pages/InterviewSetup';
import MockInterview from './pages/MockInterview';
import CodingPlatform from './pages/CodingPlatform';
import Analytics from './pages/Analytics';
import { useContext } from 'react';
import AuthContext from './context/AuthContext';

function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <PrivateRoute><Dashboard /></PrivateRoute>
        } />
        <Route path="/resume" element={
          <PrivateRoute><ResumeUpload /></PrivateRoute>
        } />
        <Route path="/setup" element={
          <PrivateRoute><InterviewSetup /></PrivateRoute>
        } />
        <Route path="/interview/:id" element={
          <PrivateRoute><MockInterview /></PrivateRoute>
        } />
        <Route path="/coding" element={
          <PrivateRoute><CodingPlatform /></PrivateRoute>
        } />
        <Route path="/analytics" element={
          <PrivateRoute><Analytics /></PrivateRoute>
        } />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;
