import React, { useState } from 'react';
import { X, Plus, Trash2, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { useCreateDataEntry } from '../hooks/useQueries';
import LoadingSpinner from './LoadingSpinner';

interface Field {
  name: string;
  type: 'text' | 'password' | 'otp';
  value: string;
}

interface CreateEntryModalProps {
  onClose: () => void;
}

const templates = [
  {
    name: '加密钱包',
    icon: '🔐',
    fields: [
      { name: '钱包名称', type: 'text' as const, value: '' },
      { name: '钱包地址', type: 'text' as const, value: '' },
      { name: '私钥', type: 'password' as const, value: '' },
      { name: '助记词', type: 'password' as const, value: '' },
    ]
  },
  {
    name: '登录信息',
    icon: '👤',
    fields: [
      { name: '网站/应用', type: 'text' as const, value: '' },
      { name: '用户名', type: 'text' as const, value: '' },
      { name: '密码', type: 'password' as const, value: '' },
      { name: '邮箱', type: 'text' as const, value: '' },
    ]
  },
  {
    name: '银行账户',
    icon: '🏦',
    fields: [
      { name: '银行名称', type: 'text' as const, value: '' },
      { name: '账户号码', type: 'text' as const, value: '' },
      { name: '开户人', type: 'text' as const, value: '' },
      { name: '登录密码', type: 'password' as const, value: '' },
    ]
  },
  {
    name: '信用卡',
    icon: '💳',
    fields: [
      { name: '卡号', type: 'text' as const, value: '' },
      { name: '持卡人', type: 'text' as const, value: '' },
      { name: '有效期', type: 'text' as const, value: '' },
      { name: 'CVV', type: 'password' as const, value: '' },
    ]
  },
  {
    name: '身份证件',
    icon: '🆔',
    fields: [
      { name: '证件类型', type: 'text' as const, value: '' },
      { name: '证件号码', type: 'text' as const, value: '' },
      { name: '姓名', type: 'text' as const, value: '' },
      { name: '有效期', type: 'text' as const, value: '' },
    ]
  },
  {
    name: '驾驶证',
    icon: '🚗',
    fields: [
      { name: '驾驶证号', type: 'text' as const, value: '' },
      { name: '姓名', type: 'text' as const, value: '' },
      { name: '准驾车型', type: 'text' as const, value: '' },
      { name: '有效期', type: 'text' as const, value: '' },
    ]
  },
  {
    name: 'OTP',
    icon: '📱',
    fields: [
      { name: '服务名称', type: 'text' as const, value: '' },
      { name: '账户', type: 'text' as const, value: '' },
      { name: '密钥', type: 'otp' as const, value: '' },
    ]
  },
  {
    name: '安全备注',
    icon: '📝',
    fields: [
      { name: '标题', type: 'text' as const, value: '' },
      { name: '内容', type: 'text' as const, value: '' },
    ]
  },
];

export default function CreateEntryModal({ onClose }: CreateEntryModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [title, setTitle] = useState('');
  const [fields, setFields] = useState<Field[]>([]);
  const [showPasswords, setShowPasswords] = useState<Record<number, boolean>>({});
  
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">新建数据条目</h2>
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
            <h3 className="text-lg font-medium text-gray-900 mb-4">选择模板</h3>
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
                    条目标题 *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={`我的${selectedTemplate}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Fields */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      字段信息
                    </label>
                    <button
                      type="button"
                      onClick={addCustomField}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      添加字段
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
                              placeholder="字段名称"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <select
                              value={field.type}
                              onChange={(e) => updateField(index, { type: e.target.value as Field['type'] })}
                              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="text">文本</option>
                              <option value="password">密码</option>
                              <option value="otp">OTP</option>
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
                          <input
                            type={field.type === 'password' && !showPasswords[index] ? 'password' : 'text'}
                            value={field.value}
                            onChange={(e) => updateField(index, { value: e.target.value })}
                            placeholder="字段值"
                            className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          {field.type === 'password' && (
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                              <button
                                type="button"
                                onClick={() => togglePasswordVisibility(index)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                {showPasswords[index] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                              <button
                                type="button"
                                onClick={() => generatePassword(index)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <RefreshCw className="h-4 w-4" />
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
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={!title.trim() || fields.length === 0 || createEntry.isPending}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {createEntry.isPending ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        保存中...
                      </>
                    ) : (
                      '保存条目'
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <div className="text-4xl mb-4">📋</div>
                  <p>请选择一个模板开始创建条目</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
