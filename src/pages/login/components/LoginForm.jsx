import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';
import { useForm } from '../../../hooks/useForm';


const validate = (formData) => {
    const errors = {};
    if (!formData.email) {
      errors.email = 'Email is required';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    return errors;
  };

const LoginForm = () => {
    const navigate = useNavigate();
    const { signIn, authError, clearAuthError, loading } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        formData,
        setFormData,
        errors,
        handleInputChange,
        handleSubmit,
    } = useForm({ email: '', password: '', rememberMe: false }, validate);


  useEffect(() => {
    const rememberedEmail = localStorage.getItem('userEmail');
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    if (rememberMe && rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail, rememberMe: true }));
    }
  }, [setFormData]);

  const handleLogin = async (data) => {
    setIsSubmitting(true);
    clearAuthError();
    try {
      const { data: userData, error } = await signIn(data.email, data.password);
      if (!error && userData) {
        if (data.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('userEmail', data.email);
        } else {
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('userEmail');
        }
        navigate('/dashboard');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
      <Input
        label="Email Address"
        type="email"
        name="email"
        placeholder="Enter your email address"
        value={formData.email}
        onChange={handleInputChange}
        error={errors.email}
        required
        disabled={loading || isSubmitting}
      />
      <Input
        label="Password"
        type="password"
        name="password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={handleInputChange}
        error={errors.password}
        required
        disabled={loading || isSubmitting}
      />
      <div className="flex items-center justify-between">
        <Checkbox
          label="Remember me"
          name="rememberMe"
          checked={formData.rememberMe}
          onChange={handleInputChange}
          disabled={loading || isSubmitting}
        />
        <Link
          to="/forgot-password"
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Forgot Password?
        </Link>
      </div>
      <Button
        type="submit"
        variant="default"
        fullWidth
        loading={loading || isSubmitting}
        disabled={loading || isSubmitting}
      >
        {loading || isSubmitting ? 'Signing In...' : 'Sign In'}
      </Button>
      {authError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{authError}</p>
        </div>
      )}
      <div className="text-center pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </form>
  );
}

export default LoginForm;
