import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import HomeTopNavBar from './components/NavBar/HomeTopNavBar/HomeTopNavBar';
import HomePage from './pages/Home/HomePage';
import LoginPage from './pages/Home/LoginPage';
import RegisterPage from './pages/Home/RegisterPage';
import AboutPage from './pages/Home/AboutPage';
import ContactPage from './pages/Home/ContactPage';
import ExplorePage from './pages/Home/ExplorePage';
import AdminBase from './pages/Admin/AdminBase';
import UserBase from './pages/Users/UserBase';
import HomeBase from './pages/Home/HomeBase';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#ff6b6b' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

// Dummy JWT decode function (replace with real one)
function getUserTypeFromJWT() {
  const token = localStorage.getItem('jwt');
  if (!token) return null;
  try {
    // Example: decode base64 payload (replace with real JWT decode)
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userType; // 'admin', 'user', or undefined
  } catch {
    return null;
  }
}

// Layout for public homepage with nav bar and nested content
function HomeLayout() {
  return (
    <>
      <HomeTopNavBar />
      <div style={{ minHeight: '80vh', padding: '32px 0' }}>
        <Outlet />
      </div>
    </>
  );
}

function App() {
  const userType = getUserTypeFromJWT();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Admin route */}
          {userType === 'admin' && (
            <Route path="*" element={<AdminBase />} />
          )}

          {/* User route */}
          {userType === 'user' && (
            <Route path="*" element={<UserBase />} />
          )}

          {/* Public routes */}
          {(!userType || userType === 'guest') && (
            <Route element={<HomeBase />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              {/* Redirect unknown routes to home */}
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          )}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
