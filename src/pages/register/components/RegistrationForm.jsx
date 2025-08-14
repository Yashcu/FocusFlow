import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

// Mock useAuth hook for demonstration - replace with actual import
const useAuth = () => ({
  signUp: async (email, password, metadata) => {
    // Mock implementation - replace with actual auth service
    return { data: { user: { email } }, error: null };
  },
  authError: null,
  clearAuthError: () => {},
  loading: false
});

const RegistrationForm = () => {
  const navigate = useNavigate();
  const { signUp, authError, clearAuthError, loading } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData?.fullName?.trim()?.length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (!formData?.email) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/?.test(formData?.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, number and special character';
    }

    if (!formData?.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData?.password !== formData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData?.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear specific field error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear auth error when user modifies form
    if (authError) {
      clearAuthError();
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    clearAuthError();

    try {
      const { data, error } = await signUp(
        formData?.email,
        formData?.password,
        {
          full_name: formData?.fullName?.trim(),
          role: 'developer'
        }
      );
      
      if (!error && data?.user) {
        // Show success message for email confirmation
        navigate('/login', {
          state: {
            message: 'Registration successful! Please check your email to confirm your account.',
            email: formData?.email
          }
        });
      }
    } catch (error) {
      // Error is handled by AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handlePasswordStrengthChange = (strength) => {
    setPasswordStrength(strength);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Authentication Error */}
      {authError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="AlertCircle" size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-700">{authError}</p>
              <button
                type="button"
                onClick={() => navigator.clipboard?.writeText(authError)}
                className="text-xs text-red-600 hover:text-red-800 underline mt-1"
              >
                Copy error message
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Full Name Field */}
      <Input
        label="Full Name"
        type="text"
        name="fullName"
        placeholder="Enter your full name"
        value={formData?.fullName}
        onChange={handleInputChange}
        error={errors?.fullName}
        required
        disabled={loading || isSubmitting}
      />
      {/* Email Field */}
      <Input
        label="Email Address"
        type="email"
        name="email"
        placeholder="Enter your email address"
        value={formData?.email}
        onChange={handleInputChange}
        error={errors?.email}
        required
        disabled={loading || isSubmitting}
      />
      {/* Password Field */}
      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Create a strong password"
          value={formData?.password}
          onChange={handleInputChange}
          error={errors?.password}
          required
          disabled={loading || isSubmitting}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
          disabled={loading || isSubmitting}
        >
          <Icon name={showPassword ? "EyeOff" : "Eye"} size={16} />
        </button>
      </div>
      {/* Password Strength Indicator */}
      <PasswordStrengthIndicator 
        password={formData?.password} 
        onStrengthChange={handlePasswordStrengthChange}
      />
      {/* Confirm Password Field */}
      <div className="relative">
        <Input
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="Confirm your password"
          value={formData?.confirmPassword}
          onChange={handleInputChange}
          error={errors?.confirmPassword}
          required
          disabled={loading || isSubmitting}
        />
        <button
          type="button"
          onClick={toggleConfirmPasswordVisibility}
          className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
          disabled={loading || isSubmitting}
        >
          <Icon name={showConfirmPassword ? "EyeOff" : "Eye"} size={16} />
        </button>
      </div>
      {/* Terms Agreement */}
      <Checkbox
        label={
          <span className="text-sm">
            I agree to the{' '}
            <Link to="/terms" className="text-primary hover:text-primary/80 underline">
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-primary hover:text-primary/80 underline">
              Privacy Policy
            </Link>
          </span>
        }
        name="agreeToTerms"
        checked={formData?.agreeToTerms}
        onChange={handleInputChange}
        error={errors?.agreeToTerms}
        disabled={loading || isSubmitting}
      />
      {/* Create Account Button */}
      <Button
        type="submit"
        variant="default"
        fullWidth
        loading={loading || isSubmitting}
        iconName="UserPlus"
        iconPosition="right"
        disabled={loading || isSubmitting}
      >
        {loading || isSubmitting ? 'Creating Account...' : 'Create Account'}
      </Button>
      {/* Sign In Link */}
      <div className="text-center pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Sign In
          </Link>
        </p>
      </div>
    </form>
  );
};

export default RegistrationForm;