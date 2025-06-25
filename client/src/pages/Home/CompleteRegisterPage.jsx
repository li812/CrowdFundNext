import React, { useState, useEffect } from 'react';
import RegisterPage from './RegisterPage'; // Or copy the form logic here
import { useNavigate } from 'react-router-dom';

const CompleteRegisterPage = () => {
  const [prefill, setPrefill] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Optionally prefill from Google user info
    const token = localStorage.getItem('jwt');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setPrefill({
        email: payload.email,
        firstName: payload.name?.split(' ')[0] || '',
        lastName: payload.name?.split(' ')[1] || '',
      });
    }
  }, []);

  // Render the same multi-step form as RegisterPage,
  // but ensure password fields are present and required.
  // On submit, POST to /api/users/register with JWT.

  // You can reuse RegisterPage logic, or copy and adapt it here.
  // Make sure to pass prefill values to the form.

  return (
    <RegisterPage prefill={prefill} isCompleteRegistration />
  );
};

export default CompleteRegisterPage;