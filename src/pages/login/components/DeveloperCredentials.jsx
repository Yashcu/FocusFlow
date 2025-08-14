import React from 'react';
import Icon from '../../../components/AppIcon';

const DeveloperCredentials = () => {
  const mockCredentials = {
    email: 'developer@focusflow.com',
    password: 'DevFlow2025!'
  };

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
  };

  return (
    <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center space-x-2 mb-3">
        <Icon name="Info" size={16} className="text-blue-600" />
        <h3 className="text-sm font-medium text-blue-800">Demo Credentials</h3>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-blue-700">Email:</span>
          <div className="flex items-center space-x-2">
            <code className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-mono">
              {mockCredentials?.email}
            </code>
            <button
              onClick={() => copyToClipboard(mockCredentials?.email)}
              className="text-blue-600 hover:text-blue-800 transition-colors"
              title="Copy email"
            >
              <Icon name="Copy" size={12} />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-blue-700">Password:</span>
          <div className="flex items-center space-x-2">
            <code className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-mono">
              {mockCredentials?.password}
            </code>
            <button
              onClick={() => copyToClipboard(mockCredentials?.password)}
              className="text-blue-600 hover:text-blue-800 transition-colors"
              title="Copy password"
            >
              <Icon name="Copy" size={12} />
            </button>
          </div>
        </div>
      </div>
      <p className="text-xs text-blue-600 mt-3">
        Use these credentials to access the demo productivity dashboard with sample data.
      </p>
    </div>
  );
};

export default DeveloperCredentials;