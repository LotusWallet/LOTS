import React, { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetCanisterStatus, useDeployPersonalCanister, useGetDataEntries, FrontendDataEntry } from '../hooks/useQueries';
import { Shield, Plus, Search, Filter, Database, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import LoginButton from './LoginButton';
import LoadingSpinner from './LoadingSpinner';
import CreateEntryModal from './CreateEntryModal';
import EntryDetailsModal from './EntryDetailsModal';
import EntryList from './EntryList';

export default function Dashboard() {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: canisterStatus, isLoading: canisterStatusLoading } = useGetCanisterStatus();
  const { data: entries, isLoading: entriesLoading } = useGetDataEntries();
  const deployCanister = useDeployPersonalCanister();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<FrontendDataEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('');

  const principalId = identity?.getPrincipal().toString() || '';
  const shortPrincipal = principalId.slice(0, 8) + '...' + principalId.slice(-8);

  const handleDeployCanister = async () => {
    try {
      await deployCanister.mutateAsync();
    } catch (error) {
      console.error('Canister deployment failed:', error);
    }
  };

  const isCanisterDeployed = canisterStatus?.status === 'deployed';
  const isCanisterDeploying = canisterStatus?.status === 'deploying' || deployCanister.isPending;
  const canisterDeploymentFailed = canisterStatus?.status === 'failed';

  const filteredEntries = (entries || []).filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterCategory || entry.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  const categories = [...new Set((entries || []).map(entry => entry.category))];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">LotS</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {userProfile?.name || '用户'}
                </p>
                <p className="text-xs text-gray-500" title={principalId}>
                  {shortPrincipal}
                </p>
              </div>
              <LoginButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            欢迎回来，{userProfile?.name}！
          </h2>
          <p className="text-gray-600">
            管理您的安全数据条目，保护您的信息安全。
          </p>
        </div>

        {/* Canister Status Messages */}
        {canisterStatusLoading ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <LoadingSpinner size="sm" className="mr-3" />
              <p className="text-blue-700">正在检查容器状态...</p>
            </div>
          </div>
        ) : canisterStatus?.status === 'deployed' ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-600 mr-3 mt-0.5" />
              <div>
                <h3 className="text-lg font-medium text-green-800 mb-2">
                  个人容器已部署
                </h3>
                <p className="text-green-700">
                  您的个人数据容器运行正常，可以安全地管理您的数据条目。
                </p>
              </div>
            </div>
          </div>
        ) : canisterDeploymentFailed ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <XCircle className="h-6 w-6 text-red-600 mr-3 mt-0.5" />
              <div>
                <h3 className="text-lg font-medium text-red-800 mb-2">
                  容器部署失败
                </h3>
                <p className="text-red-700 mb-4">
                  个人容器部署失败。请稍后重试，或联系技术支持。
                </p>
                <button 
                  onClick={handleDeployCanister}
                  disabled={isCanisterDeploying}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  {isCanisterDeploying ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      重试中...
                    </>
                  ) : (
                    '重试部署'
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : isCanisterDeploying ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <LoadingSpinner size="md" className="mr-3 mt-0.5" />
              <div>
                <h3 className="text-lg font-medium text-blue-800 mb-2">
                  正在部署个人容器
                </h3>
                <p className="text-blue-700">
                  请稍候，我们正在为您创建专属的安全数据容器...
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <AlertCircle className="h-6 w-6 text-yellow-600 mr-3 mt-0.5" />
              <div>
                <h3 className="text-lg font-medium text-yellow-800 mb-2">
                  需要部署个人容器
                </h3>
                <p className="text-yellow-700 mb-4">
                  要开始存储您的安全数据条目，我们需要部署您的个人容器。
                  这确保您的数据完全隔离和加密。
                </p>
                <button 
                  onClick={handleDeployCanister}
                  disabled={isCanisterDeploying}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
                >
                  {isCanisterDeploying ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      部署中...
                    </>
                  ) : (
                    <>
                      <Database className="h-4 w-4 mr-2" />
                      部署个人容器
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Action Bar - Only show if canister is deployed */}
        {isCanisterDeployed && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="搜索条目..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">所有分类</option>
                  {categories.map((category: string) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <button 
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                新建条目
              </button>
            </div>
          </div>
        )}

        {/* Content Area */}
        {isCanisterDeployed ? (
          entriesLoading ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-600">正在加载数据条目...</p>
            </div>
          ) : filteredEntries.length > 0 ? (
            <EntryList 
              entries={filteredEntries}
              onEntryClick={setSelectedEntry}
            />
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Database className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {searchTerm || filterCategory ? '未找到匹配的条目' : '暂无数据条目'}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchTerm || filterCategory 
                  ? '尝试调整搜索条件或筛选器以查找您需要的条目。'
                  : '开始创建您的第一个安全数据条目，保护您的重要信息。'
                }
              </p>
              {!searchTerm && !filterCategory && (
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  创建第一个条目
                </button>
              )}
            </div>
          )
        ) : (
          /* Template Categories Preview */
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Database className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              数据条目模板
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              一旦您的个人容器部署完成，您就可以创建和管理
              密码、加密钱包、银行账户等安全数据条目。
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto mt-8">
              {[
                { name: '加密钱包', icon: '🔐' },
                { name: '登录信息', icon: '👤' },
                { name: '银行账户', icon: '🏦' },
                { name: '信用卡', icon: '💳' },
                { name: '身份证件', icon: '🆔' },
                { name: '驾驶证', icon: '🚗' },
                { name: '动态密码', icon: '📱' },
                { name: '安全备注', icon: '📝' },
              ].map((template) => (
                <div
                  key={template.name}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                >
                  <div className="text-2xl mb-2">{template.icon}</div>
                  <div className="text-sm font-medium text-gray-700">{template.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {showCreateModal && (
        <CreateEntryModal 
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {selectedEntry && (
        <EntryDetailsModal 
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            © 2025. 使用 ❤️ 构建于{' '}
            <a 
              href="https://caffeine.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              caffeine.ai
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
