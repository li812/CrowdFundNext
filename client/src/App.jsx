import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import HomePage from './pages/Home/HomePage';
import LoginPage from './pages/Home/LoginPage';
import RegisterPage from './pages/Home/RegisterPage';
import AboutPage from './pages/Home/AboutPage';
import ContactPage from './pages/Home/ContactPage';
import ExplorePage from './pages/Home/ExplorePage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#ff6b6b',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/explore" element={<ExplorePage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
