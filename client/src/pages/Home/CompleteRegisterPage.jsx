import React, { useEffect, useState } from 'react';
import RegisterPage from './RegisterPage';

function CompleteRegisterPage() {
  const [prefill, setPrefill] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setPrefill({
        email: payload.email || '',
        firstName: payload.name?.split(' ')[0] || '',
        lastName: payload.name?.split(' ').slice(1).join(' ') || '',
        dateOfBirth: payload.dob || '', // If available in Google profile
        // You can add more fields if present in the token
      });
    }
  }, []);

  return (
    <RegisterPage prefill={prefill} isCompleteRegistration={true} />
  );
}

export default CompleteRegisterPage;
