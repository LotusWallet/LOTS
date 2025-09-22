import React, { useState } from 'react';
import { X, RefreshCw, Copy, CheckCircle, Key } from 'lucide-react';

interface PasswordGeneratorModalProps {
  onClose: () => void;
  onPasswordSelect: (password: string) => void;
  showUseButton?: boolean;
}

export default function PasswordGeneratorModal({ 
  onClose, 
  onPasswordSelect, 
  showUseButton = true 
}: PasswordGeneratorModalProps) {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSpecialChars, setIncludeSpecialChars] = useState(true);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    
    if (includeNumbers) {
      chars += '0123456789';
    }
    
    if (includeSpecialChars) {
      chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    }

    const newPassword = Array.from({ length }, () => 
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');
    
    setPassword(newPassword);
  };

  const copyPassword = async () => {
    if (!password) return;
    
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy password:', error);
    }
  };

  const handleUsePassword = () => {
    if (password) {
      onPasswordSelect(password);
      if (showUseButton) {
        onClose();
      }
    }
  };

  const handleCopyAndClose = async () => {
    if (password) {
      await copyPassword();
      if (!showUseButton) {
        // For standalone usage, close after copying
        setTimeout(() => onClose(), 1000);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Key className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Password Generator</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Configuration */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password Length: {length}
              </label>
              <input
                type="range"
                min="8"
                max="64"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>8</span>
                <span>64</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Include Numbers (0-9)</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeSpecialChars}
                  onChange={(e) => setIncludeSpecialChars(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Include Special Characters (!@#$%...)</span>
              </label>
            </div>
          </div>

          {/* Generated Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Generated Password
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={password}
                readOnly
                placeholder="Click 'Generate' to create a password"
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md font-mono text-sm"
              />
              <button
                onClick={handleCopyAndClose}
                disabled={!password}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Copy password"
              >
                {copied ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 mb-4">
            <button
              onClick={generatePassword}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Generate
            </button>
            
            {password && (
              <button
                onClick={generatePassword}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Regenerate
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Cancel
          </button>
          {showUseButton && (
            <button
              onClick={handleUsePassword}
              disabled={!password}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              Use This Password
            </button>
          )}
          {!showUseButton && password && (
            <button
              onClick={handleCopyAndClose}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              {copied ? 'Copied!' : 'Copy Password'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
