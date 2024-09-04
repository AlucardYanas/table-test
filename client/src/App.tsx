import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AuthPage from './components/pages/AuthPage';
import HomePage from './components/pages/HomePage';
// import NotFoundPage from '../pages/NotFoundPage';
import useAuth from './components/hooks/useAuth';

function App(): JSX.Element {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <HomePage /> : <AuthPage />} />
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
};
export default App

