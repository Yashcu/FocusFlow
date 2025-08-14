import React, { useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const PasswordStrengthIndicator = ({ password, onStrengthChange }) => {
  const calculateStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    const checks = {
      length: password?.length >= 8,
      lowercase: /[a-z]/?.test(password),
      uppercase: /[A-Z]/?.test(password),
      number: /\d/?.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/?.test(password)
    };
    
    score = Object.values(checks)?.filter(Boolean)?.length;
    
    const strengthLevels = {
      0: { label: '', color: '', bgColor: '' },
      1: { label: 'Very Weak', color: 'text-red-600', bgColor: 'bg-red-200' },
      2: { label: 'Weak', color: 'text-red-500', bgColor: 'bg-red-200' },
      3: { label: 'Fair', color: 'text-yellow-600', bgColor: 'bg-yellow-200' },
      4: { label: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-200' },
      5: { label: 'Strong', color: 'text-green-600', bgColor: 'bg-green-200' }
    };
    
    React.useEffect(() => {
      onStrengthChange?.(score);
    }, [score, onStrengthChange]);
    
    return { ...strengthLevels?.[score], score, checks };
  };

  const strength = calculateStrength(password);

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      {/* Strength Bar */}
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5]?.map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
              level <= strength?.score ? strength?.bgColor : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      {/* Strength Label */}
      <div className={`text-xs font-medium ${strength?.color}`}>
        {strength?.label}
      </div>
      {/* Requirements Checklist */}
      <div className="space-y-1">
        {Object.entries({
          length: 'At least 8 characters',
          lowercase: 'One lowercase letter',
          uppercase: 'One uppercase letter',
          number: 'One number',
          special: 'One special character'
        })?.map(([key, requirement]) => (
          <div key={key} className="flex items-center space-x-2 text-xs">
            <Icon
              name={strength?.checks?.[key] ? "CheckCircle2" : "Circle"}
              size={12}
              className={strength?.checks?.[key] ? 'text-green-600' : 'text-gray-400'}
            />
            <span className={strength?.checks?.[key] ? 'text-green-600' : 'text-gray-500'}>
              {requirement}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;