import React, { useState } from 'react';
import { X, Plus, Trash2, Eye, EyeOff, RefreshCw, Key } from 'lucide-react';
import { useCreateDataEntry } from '../hooks/useQueries';
import LoadingSpinner from './LoadingSpinner';
import PasswordGeneratorModal from './PasswordGeneratorModal';

interface Field {
  name: string;
  type: 'text' | 'password' | 'otp' | 'url' | 'email' | 'date';
  value: string;
}

interface CreateEntryModalProps {
  onClose: () => void;
}

const templates = [
  {
    name: 'Crypto Wallet',
    icon: '🔐',
    fields: [
      { name: 'Wallet Name', type: 'text' as const, value: '' },
      { name: 'Wallet Address', type: 'text' as const, value: '' },
      { name: 'Private Key', type: 'password' as const, value: '' },
      { name: 'Seed Phrase', type: 'password' as const, value: '' },
    ]
  },
  {
    name: 'Login Credentials',
    icon: '👤',
    fields: [
      { name: 'Website/App', type: 'url' as const, value: '' },
      { name: 'Username', type: 'text' as const, value: '' },
      { name: 'Password', type: 'password' as const, value: '' },
      { name: 'Email', type: 'email' as const, value: '' },
    ]
  },
  {
    name: 'Bank Account',
    icon: '🏦',
    fields: [
      { name: 'Bank Name', type: 'text' as const, value: '' },
      { name: 'Account Number', type: 'text' as const, value: '' },
      { name: 'Account Holder', type: 'text' as const, value: '' },
      { name: 'Login Password', type: 'password' as const, value: '' },
    ]
  },
  {
    name: 'Credit Card',
    icon: '💳',
    fields: [
      { name: 'Card Number', type: 'text' as const, value: '' },
      { name: 'Cardholder', type: 'text' as const, value: '' },
      { name: 'Expiry Date', type: 'date' as const, value: '' },
      { name: 'CVV', type: 'password' as const, value: '' },
    ]
  },
  {
    name: 'Identity Document',
    icon: '🆔',
    fields: [
      { name: 'Document Type', type: 'text' as const, value: '' },
      { name: 'Document Number', type: 'text' as const, value: '' },
      { name: 'Full Name', type: 'text' as const, value: '' },
      { name: 'Expiry Date', type: 'date' as const, value: '' },
    ]
  },
  {
    name: 'Driver\'s License',
    icon: '🚗',
    fields: [
      { name: 'License Number', type: 'text' as const, value: '' },
      { name: 'Full Name', type: 'text' as const, value: '' },
      { name: 'Vehicle Category', type: 'text' as const, value: '' },
      { name: 'Expiry Date', type: 'date' as const, value: '' },
    ]
  },
  {
    name: 'OTP',
    icon: '📱',
    fields: [
      { name: 'Service Name', type: 'text' as const, value: '' },
      { name: 'Account', type: 'text' as const, value: '' },
      { name: 'Secret Key', type: 'otp' as const, value: '' },
    ]
  },
  {
    name: 'Secure Notes',
    icon: '📝',
    fields: [
      { name: 'Title', type: 'text' as const, value: '' },
      { name: 'Content', type: 'text' as const, value: '' },
    ]
  },
];

export default function CreateEntryModal({ onClose }: CreateEntryModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [title, setTitle] = useState('');
  const [fields, setFields] = useState<Field[]>([]);
  const [showPasswords, setShowPasswords] = useState<Record<number, boolean>>({});
  const [showPasswordGenerator, setShowPasswordGenerator] = useState(false);
  const [passwordFieldIndex, setPasswordFieldIndex] = useState<number | null>(null);
  
  const createEntry = useCreateDataEntry();

  const handleTemplateSelect = (templateName: string) => {
    const template = templates.find(t => t.name === templateName);
    if (template) {
      setSelectedTemplate(templateName);
      setTitle('');
      setFields([...template.fields]);
    }
  };

  const addCustomField = () => {
    setFields([...fields, { name: '', type: 'text', value: '' }]);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, updates: Partial<Field>) => {
    setFields(fields.map((field, i) => 
      i === index ? { ...field, ...updates } : field
    ));
  };

  const generatePassword = (index: number) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    const password = Array.from({ length: 16 }, () => 
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');
    updateField(index, { value: password });
  };

  const openPasswordGenerator = (index: number) => {
    setPasswordFieldIndex(index);
    setShowPasswordGenerator(true);
  };

  const handlePasswordSelect = (password: string) => {
    if (passwordFieldIndex !== null) {
      updateField(passwordFieldIndex, { value: password });
    }
    setPasswordFieldIndex(null);
  };

  const togglePasswordVisibility = (index: number) => {
    setShowPasswords(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || fields.length === 0) return;

    try {
      await createEntry.mutateAsync({
        title: title.trim(),
        category: selectedTemplate,
        fields: fields.filter(field => field.name.trim() && field.value.trim())
      });
      onClose();
    } catch (error) {
      console.error('Failed to create entry:', error);
    }
  };

  const renderFieldInput = (field: Field, index: number) => {
    if (field.type === 'date') {
      return (
        <input
          type="date"
          value={field.value}
          onChange={(e) => updateField(index, { value: e.target.value })}
          className="w-full px-3 py-2 pr-24 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      );
    }

    if (field.type === 'email') {
      return (
        <input
          type="email"
          value={field.value}
          onChange={(e) => updateField(index, { value: e.target.value })}
          placeholder="Field value"
          className="w-full px-3 py-2 pr-24 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      );
    }

    if (field.type === 'url') {
      return (
        <input
          type="url"
          value={field.value}
          onChange={(e) => updateField(index, { value: e.target.value })}
          placeholder="Field value"
          className="w-full px-3 py-2 pr-24 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      );
    }

    return (
      <input
        type={field.type === 'password' && !showPasswords[index] ? 'password' : 'text'}
        value={field.value}
        onChange={(e) => updateField(index, { value: e.target.value })}
        placeholder="Field value"
        className="w-full px-3 py-2 pr-24 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create New Data Entry</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Template Selection */}
          <div className="w-1/3 border-r border-gray-200 p-6 overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Select Template</h3>
            <div className="space-y-2">
              {templates.map((template) => (
                <button
                  key={template.name}
                  onClick={() => handleTemplateSelect(template.name)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedTemplate === template.name
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{template.icon}</span>
                    <span className="font-medium text-gray-900">{template.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="flex-1 p-6 overflow-y-auto">
            {selectedTemplate ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Entry Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={`My ${selectedTemplate}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Fields */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Field Information
                    </label>
                    <button
                      type="button"
                      onClick={addCustomField}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Field
                    </button>
                  </div>

                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-4 flex-1">
                            <input
                              type="text"
                              value={field.name}
                              onChange={(e) => updateField(index, { name: e.target.value })}
                              placeholder="Field name"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <select
                              value={field.type}
                              onChange={(e) => updateField(index, { type: e.target.value as Field['type'] })}
                              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="text">Text</option>
                              <option value="password">Password</option>
                              <option value="otp">OTP</option>
                              <option value="url">URL</option>
                              <option value="email">Email</option>
                              <option value="date">Date</option>
                            </select>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeField(index)}
                            className="text-red-500 hover:text-red-700 ml-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="relative">
                          {renderFieldInput(field, index)}
                          {field.type === 'password' && (
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">
                              <button
                                type="button"
                                onClick={() => togglePasswordVisibility(index)}
                                className="text-gray-400 hover:text-gray-600"
                                title="Toggle visibility"
                              >
                                {showPasswords[index] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                              <button
                                type="button"
                                onClick={() => generatePassword(index)}
                                className="text-gray-400 hover:text-gray-600"
                                title="Generate random password"
                              >
                                <RefreshCw className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => openPasswordGenerator(index)}
                                className="text-blue-500 hover:text-blue-700"
                                title="Open password generator"
                              >
                                <Key className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!title.trim() || fields.length === 0 || createEntry.isPending}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {createEntry.isPending ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Saving...
                      </>
                    ) : (
                      'Save Entry'
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <div className="text-4xl mb-4">📋</div>
                  <p>Please select a template to start creating an entry</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Password Generator Modal */}
      {showPasswordGenerator && (
        <PasswordGeneratorModal
          onClose={() => {
            setShowPasswordGenerator(false);
            setPasswordFieldIndex(null);
          }}
          onPasswordSelect={handlePasswordSelect}
          showUseButton={true}
        />
      )}
    </div>
  );
}
