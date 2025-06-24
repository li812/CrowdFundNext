import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
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
import AdminHome from './pages/Admin/AdminHome';
import AdminSettings from './pages/Admin/AdminSettings';
import UserHome from './pages/Users/UserHome';
import UserSettings from './pages/Users/UserSettings';
import { useThemeMode } from './context/ThemeContext';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#ff6b6b' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

// Helper to decode JWT and get userType
function getUserTypeFromJWT() {
  const token = localStorage.getItem('jwt');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userType; // 'admin', 'user', or undefined
  } catch {
    return null;
  }
}

// Role-based redirect logic
function RoleRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token) return;

    // Prefer userType from localStorage, fallback to JWT
    let userType = localStorage.getItem('userType');
    if (!userType) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userType = payload.userType;
      } catch {
        userType = null;
      }
    }

    if (userType === 'admin' && !location.pathname.startsWith('/admin')) {
      navigate('/admin', { replace: true });
    } else if (userType === 'user' && !location.pathname.startsWith('/user')) {
      navigate('/user', { replace: true });
    }
  }, [navigate, location]);

  return null;
}

function App() {
  const { theme } = useThemeMode();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <RoleRedirect />
        <Routes>
          {/* Public/Home routes */}
          <Route element={<HomeBase />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
          {/* Admin routes */}
          <Route path="/admin/*" element={<AdminBase />}>
            <Route index element={<AdminHome />} />
            <Route path="home" element={<AdminHome />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          {/* User routes */}
          <Route path="/user/*" element={<UserBase />}>
            <Route index element={<UserHome />} />
            <Route path="settings" element={<UserSettings />} />
          </Route>
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
