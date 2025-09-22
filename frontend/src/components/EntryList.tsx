import React from 'react';
import { Shield, CreditCard, Building, User, IdCard, Car, Smartphone, FileText, Clock } from 'lucide-react';
import { FrontendDataEntry } from '../hooks/useQueries';

interface EntryListProps {
  entries: FrontendDataEntry[];
  onEntryClick: (entry: FrontendDataEntry) => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  'Crypto Wallet': <Shield className="h-5 w-5" />,
  'Login Credentials': <User className="h-5 w-5" />,
  'Bank Account': <Building className="h-5 w-5" />,
  'Credit Card': <CreditCard className="h-5 w-5" />,
  'Identity Document': <IdCard className="h-5 w-5" />,
  'Driver\'s License': <Car className="h-5 w-5" />,
  'OTP': <Smartphone className="h-5 w-5" />,
  'Secure Notes': <FileText className="h-5 w-5" />,
  // Legacy Chinese categories for backward compatibility
  '加密钱包': <Shield className="h-5 w-5" />,
  '登录凭据': <User className="h-5 w-5" />,
  '银行账户': <Building className="h-5 w-5" />,
  '信用卡': <CreditCard className="h-5 w-5" />,
  '身份证件': <IdCard className="h-5 w-5" />,
  '驾驶执照': <Car className="h-5 w-5" />,
  '安全笔记': <FileText className="h-5 w-5" />,
};

const categoryColors: Record<string, string> = {
  'Crypto Wallet': 'bg-blue-100 text-blue-800',
  'Login Credentials': 'bg-green-100 text-green-800',
  'Bank Account': 'bg-purple-100 text-purple-800',
  'Credit Card': 'bg-red-100 text-red-800',
  'Identity Document': 'bg-yellow-100 text-yellow-800',
  'Driver\'s License': 'bg-indigo-100 text-indigo-800',
  'OTP': 'bg-pink-100 text-pink-800',
  'Secure Notes': 'bg-gray-100 text-gray-800',
  // Legacy Chinese categories for backward compatibility
  '加密钱包': 'bg-blue-100 text-blue-800',
  '登录凭据': 'bg-green-100 text-green-800',
  '银行账户': 'bg-purple-100 text-purple-800',
  '信用卡': 'bg-red-100 text-red-800',
  '身份证件': 'bg-yellow-100 text-yellow-800',
  '驾驶执照': 'bg-indigo-100 text-indigo-800',
  '安全笔记': 'bg-gray-100 text-gray-800',
};

export default function EntryList({ entries, onEntryClick }: EntryListProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Data Entries</h3>
        <p className="text-sm text-gray-600">{entries.length} entries total</p>
      </div>
      
      <div className="divide-y divide-gray-200">
        {entries.map((entry) => (
          <div
            key={entry.id}
            onClick={() => onEntryClick(entry)}
            className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${categoryColors[entry.category] || 'bg-gray-100 text-gray-800'}`}>
                  {categoryIcons[entry.category] || <FileText className="h-5 w-5" />}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{entry.title}</h4>
                  <p className="text-sm text-gray-600">{entry.category}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatDate(entry.updatedAt)}
                </div>
                <div className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                  {entry.fields.length} fields
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
