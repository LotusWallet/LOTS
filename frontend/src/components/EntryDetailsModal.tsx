import React, { useState, useEffect } from 'react';
import { X, Edit, Trash2, Copy, Eye, EyeOff, Clock, CheckCircle, Key, Plus, ExternalLink, Mail, Calendar } from 'lucide-react';
import { useUpdateDataEntry, useDeleteDataEntry, useGenerateTOTP, FrontendDataEntry } from '../hooks/useQueries';
import LoadingSpinner from './LoadingSpinner';
import PasswordGeneratorModal from './PasswordGeneratorModal';

interface Field {
  name: string;
  type: 'text' | 'password' | 'otp' | 'url' | 'email' | 'date';
  value: string;
}

interface EntryDetailsModalProps {
  entry: FrontendDataEntry;
  onClose: () => void;
}

export default function EntryDetailsModal({ entry, onClose }: EntryDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEntry, setEditedEntry] = useState(entry);
  const [showPasswords, setShowPasswords] = useState<Record<number, boolean>>({});
  const [copiedField, setCopiedField] = useState<number | null>(null);
  const [totpCodes, setTotpCodes] = useState<Record<number, { code: string; timeLeft: number }>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPasswordGenerator, setShowPasswordGenerator] = useState(false);
  const [passwordFieldIndex, setPasswordFieldIndex] = useState<number | null>(null);

  const updateEntry = useUpdateDataEntry();
  const deleteEntry = useDeleteDataEntry();
  const generateTOTP = useGenerateTOTP();

  // Generate TOTP codes for OTP fields
  useEffect(() => {
    const otpFields = entry.fields
      .map((field, index) => ({ field, index }))
      .filter(({ field }) => field.type === 'otp');

    if (otpFields.length === 0) return;

    const updateTOTP = async () => {
      for (const { field, index } of otpFields) {
        try {
          const result = await generateTOTP.mutateAsync(field.value);
          setTotpCodes(prev => ({
            ...prev,
            [index]: result
          }));
        } catch (error) {
          console.error('Failed to generate TOTP:', error);
        }
      }
    };

    updateTOTP();
    const interval = setInterval(updateTOTP, 1000);
    return () => clearInterval(interval);
  }, [entry.fields, generateTOTP]);

  const handleCopy = async (text: string, fieldIndex: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldIndex);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const togglePasswordVisibility = (index: number) => {
    setShowPasswords(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
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

  const addCustomField = () => {
    setEditedEntry(prev => ({
      ...prev,
      fields: [...prev.fields, { name: '', type: 'text', value: '' }]
    }));
  };

  const removeField = (index: number) => {
    setEditedEntry(prev => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    try {
      await updateEntry.mutateAsync({
        ...editedEntry,
        fields: editedEntry.fields.filter(field => field.name.trim() && field.value.trim())
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update entry:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteEntry.mutateAsync(entry.id);
      onClose();
    } catch (error) {
      console.error('Failed to delete entry:', error);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US');
  };

  const formatDateValue = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US');
    } catch {
      return dateString;
    }
  };

  const updateField = (index: number, updates: Partial<Field>) => {
    setEditedEntry(prev => ({
      ...prev,
      fields: prev.fields.map((field, i) => 
        i === index ? { ...field, ...updates } : field
      )
    }));
  };

  const renderFieldValue = (field: Field, index: number) => {
    if (isEditing) {
      return (
        <div className="relative">
          {field.type === 'date' ? (
            <input
              type="date"
              value={field.value}
              onChange={(e) => updateField(index, { value: e.target.value })}
              className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          ) : field.type === 'email' ? (
            <input
              type="email"
              value={field.value}
              onChange={(e) => updateField(index, { value: e.target.value })}
              placeholder="Field value"
              className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          ) : field.type === 'url' ? (
            <input
              type="url"
              value={field.value}
              onChange={(e) => updateField(index, { value: e.target.value })}
              placeholder="Field value"
              className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          ) : (
            <input
              type={field.type === 'password' && !showPasswords[index] ? 'password' : 'text'}
              value={field.value}
              onChange={(e) => updateField(index, { value: e.target.value })}
              placeholder="Field value"
              className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          )}
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
                onClick={() => openPasswordGenerator(index)}
                className="text-blue-500 hover:text-blue-700"
                title="Open password generator"
              >
                <Key className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      );
    }

    // View mode
    if (field.type === 'otp') {
      return (
        <div className="space-y-2">
          <div className="font-mono text-lg bg-gray-50 p-3 rounded-md text-center">
            {totpCodes[index]?.code || '------'}
          </div>
          {totpCodes[index] && (
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Refreshes in {totpCodes[index].timeLeft} seconds</span>
            </div>
          )}
        </div>
      );
    }

    if (field.type === 'url') {
      return (
        <div className="flex items-center">
          <a
            href={field.value}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-blue-600 hover:text-blue-800 underline"
          >
            {field.value}
          </a>
          <ExternalLink className="ml-2 h-4 w-4 text-gray-400" />
        </div>
      );
    }

    if (field.type === 'email') {
      return (
        <div className="flex items-center">
          <a
            href={`mailto:${field.value}`}
            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-blue-600 hover:text-blue-800 underline"
          >
            {field.value}
          </a>
          <Mail className="ml-2 h-4 w-4 text-gray-400" />
        </div>
      );
    }

    if (field.type === 'date') {
      return (
        <div className="flex items-center">
          <input
            type="text"
            value={formatDateValue(field.value)}
            readOnly
            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md"
          />
          <Calendar className="ml-2 h-4 w-4 text-gray-400" />
        </div>
      );
    }

    return (
      <div className="flex items-center">
        <input
          type={field.type === 'password' && !showPasswords[index] ? 'password' : 'text'}
          value={field.value}
          readOnly
          className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md"
        />
        {field.type === 'password' && (
          <button
            onClick={() => togglePasswordVisibility(index)}
            className="ml-2 text-gray-400 hover:text-gray-600"
          >
            {showPasswords[index] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
    );
  };

  const getFieldTypeLabel = (type: string) => {
    const labels = {
      text: 'Text',
      password: 'Password',
      otp: 'OTP',
      url: 'URL',
      email: 'Email',
      date: 'Date'
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {isEditing ? (
                <input
                  type="text"
                  value={editedEntry.title}
                  onChange={(e) => setEditedEntry(prev => ({ ...prev, title: e.target.value }))}
                  className="text-xl font-semibold bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
                />
              ) : (
                entry.title
              )}
            </h2>
            <p className="text-sm text-gray-600">{entry.category}</p>
          </div>
          <div className="flex items-center space-x-2">
            {!isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Fields */}
          <div className="space-y-4">
            {/* Add Field Button - Only show when editing */}
            {isEditing && (
              <div className="flex justify-between items-center mb-4">
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
            )}

            {(isEditing ? editedEntry.fields : entry.fields).map((field, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    {isEditing ? (
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
                    ) : (
                      field.name
                    )}
                  </label>
                  <div className="flex items-center space-x-2">
                    {!isEditing && (
                      <>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                          {getFieldTypeLabel(field.type)}
                        </span>
                        <button
                          onClick={() => handleCopy(field.value, index)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {copiedField === index ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </>
                    )}
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => removeField(index)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="relative">
                  {renderFieldValue(field, index)}
                </div>
              </div>
            ))}
          </div>

          {/* Metadata */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Created:</span>
                <span className="ml-2">{formatDate(entry.createdAt)}</span>
              </div>
              <div>
                <span className="font-medium">Updated:</span>
                <span className="ml-2">{formatDate(entry.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 p-6 border-t border-gray-200">
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedEntry(entry);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={updateEntry.isPending}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {updateEntry.isPending ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-60">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the entry "{entry.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteEntry.isPending}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {deleteEntry.isPending ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Deleting...
                  </>
                ) : (
                  'Confirm Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

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
