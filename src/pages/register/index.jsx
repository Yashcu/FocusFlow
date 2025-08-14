import React from 'react';
import AuthenticationLayout from '../../components/ui/AuthenticationLayout';
import RegistrationForm from './components/RegistrationForm';

const Register = () => {
  return (
    <AuthenticationLayout
      title="Create Your Account"
      subtitle="Start tracking your productivity and build better development habits"
    >
      <RegistrationForm />
    </AuthenticationLayout>
  );
};

export default Register;