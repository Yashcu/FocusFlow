import React from 'react';
import Icon from '../../../components/AppIcon';

const LoginHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center mb-6">
        <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center shadow-lg">
          <Icon name="Zap" size={32} color="white" />
        </div>
      </div>
      
      <h1 className="text-3xl font-semibold text-foreground mb-2">
        Welcome Back
      </h1>
      
      <p className="text-muted-foreground text-base">
        Sign in to continue tracking your productivity
      </p>
    </div>
  );
};

export default LoginHeader;