import React from 'react';
import { Shield, Lock, Key, Database, Smartphone, Globe, CreditCard, Building, User, IdCard, Car, FileText, CheckCircle, Zap, Eye, Users, Award, Layers } from 'lucide-react';
import LoginButton from './LoginButton';

export default function LandingPage() {
  const dataTemplates = [
    {
      name: '加密钱包',
      icon: <Shield className="h-8 w-8" />,
      description: '安全存储您的加密货币钱包信息，包括钱包地址、私钥和助记词，确保数字资产安全。',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      name: '登录信息',
      icon: <User className="h-8 w-8" />,
      description: '管理网站和应用程序的登录凭据，包括用户名、密码和相关账户信息。',
      color: 'bg-green-100 text-green-600'
    },
    {
      name: '银行账户',
      icon: <Building className="h-8 w-8" />,
      description: '保护您的银行账户详细信息，包括账户号码、开户行信息和网银登录凭据。',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      name: '信用卡',
      icon: <CreditCard className="h-8 w-8" />,
      description: '安全存储信用卡和借记卡信息，包括卡号、有效期、CVV和持卡人信息。',
      color: 'bg-red-100 text-red-600'
    },
    {
      name: '身份证件',
      icon: <IdCard className="h-8 w-8" />,
      description: '管理各类身份证件信息，如身份证、护照、社保卡等重要证件数据。',
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      name: '驾驶证',
      icon: <Car className="h-8 w-8" />,
      description: '存储驾驶证相关信息，包括证件号码、准驾车型、有效期等驾驶资质数据。',
      color: 'bg-indigo-100 text-indigo-600'
    },
    {
      name: 'OTP动态密码',
      icon: <Smartphone className="h-8 w-8" />,
      description: '管理双因素认证密钥，生成与Google身份验证器兼容的TOTP动态验证码。',
      color: 'bg-pink-100 text-pink-600'
    },
    {
      name: '安全备注',
      icon: <FileText className="h-8 w-8" />,
      description: '记录重要的安全信息和备注，如安全问题答案、重要提醒等敏感文本内容。',
      color: 'bg-gray-100 text-gray-600'
    }
  ];

  const whyChooseReasons = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: '军用级安全加密',
      description: '采用端到端加密技术，确保您的数据在传输和存储过程中始终受到最高级别的保护。',
      color: 'text-blue-600'
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: '个人专属容器',
      description: '每位用户都拥有独立的数据容器，实现真正的数据隔离，保障您的隐私不被侵犯。',
      color: 'text-green-600'
    },
    {
      icon: <Key className="h-8 w-8" />,
      title: '去中心化认证',
      description: '基于Internet Identity的去中心化身份认证，无需记住复杂密码，安全便捷。',
      color: 'text-purple-600'
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: '完全去中心化',
      description: '运行在Internet Computer区块链上，无单点故障，抗审查，真正的去中心化应用。',
      color: 'text-red-600'
    },
    {
      icon: <Layers className="h-8 w-8" />,
      title: '丰富数据模板',
      description: '提供8种预设数据模板，覆盖日常生活中的各种敏感信息管理需求。',
      color: 'text-yellow-600'
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: '简单易用界面',
      description: '直观的用户界面设计，让复杂的安全功能变得简单易用，人人都能轻松上手。',
      color: 'text-indigo-600'
    }
  ];

  const keyBenefits = [
    {
      icon: <Lock className="h-8 w-8" />,
      title: '数据主权',
      description: '您完全拥有和控制自己的数据，无需担心第三方访问或数据泄露风险。',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      icon: <Eye className="h-8 w-8" />,
      title: '隐私保护',
      description: '零知识架构确保即使是平台运营方也无法访问您的敏感数据内容。',
      gradient: 'from-green-500 to-green-600'
    },
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: '高可用性',
      description: '基于区块链的分布式架构，确保服务24/7稳定运行，数据永不丢失。',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: '多设备同步',
      description: '在任何设备上安全访问您的数据，实现跨平台无缝同步体验。',
      gradient: 'from-red-500 to-red-600'
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: '行业标准',
      description: '遵循国际安全标准和最佳实践，为您提供企业级的数据保护能力。',
      gradient: 'from-yellow-500 to-yellow-600'
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: '智能功能',
      description: '集成密码生成器、TOTP动态码等智能工具，提升您的数字安全水平。',
      gradient: 'from-indigo-500 to-indigo-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">LotS</h1>
            </div>
            <LoginButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            安全数据管理
            <span className="block text-blue-600">简单易用</span>
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
            使用军用级加密、个人容器隔离和无缝Internet Identity钱包认证，
            存储和管理您的敏感数据。
          </p>
          <div className="mt-10">
            <LoginButton />
          </div>
        </div>

        {/* Comprehensive Data Templates Section */}
        <div className="mt-24">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">全面数据模板</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              LotS提供8种精心设计的数据模板，覆盖您日常生活中的各种敏感信息管理需求，
              让数据组织变得简单高效。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dataTemplates.map((template, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-lg ${template.color} mb-4`}>
                  {template.icon}
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">{template.name}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{template.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose LotS Section */}
        <div className="mt-24">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">为什么选择LotS？</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              LotS不仅仅是一个数据管理工具，更是您数字生活的安全守护者。
              以下6个理由让LotS成为您的最佳选择。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseReasons.map((reason, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow duration-300">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6 ${reason.color}`}>
                  {reason.icon}
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-4">{reason.title}</h4>
                <p className="text-gray-600 leading-relaxed">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Benefits Section */}
        <div className="mt-24">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">核心优势</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              LotS平台的6大核心优势，为您提供无与伦比的数据安全体验，
              让您在数字时代中安心无忧。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {keyBenefits.map((benefit, index) => (
              <div key={index} className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-r ${benefit.gradient} rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                <div className="relative bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:border-transparent">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${benefit.gradient} text-white mb-6`}>
                    {benefit.icon}
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">{benefit.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Original Features Grid */}
        <div className="mt-24">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">平台特性</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              基于最新技术构建的安全数据管理平台，为您提供全方位的数据保护。
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">
                端到端加密
              </h3>
              <p className="mt-2 text-base text-gray-600 text-center">
                您的数据在离开设备前就已加密，并在您的个人容器中保持安全。
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mx-auto">
                <Database className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">
                个人容器
              </h3>
              <p className="mt-2 text-base text-gray-600 text-center">
                每个用户都拥有自己的隔离容器，确保最大安全性和数据主权。
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white mx-auto">
                <Key className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">
                Internet Identity钱包认证
              </h3>
              <p className="mt-2 text-base text-gray-600 text-center">
                使用您的Internet Identity钱包进行安全认证，无需记住密码。
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-500 text-white mx-auto">
                <Smartphone className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">
                动态密码支持
              </h3>
              <p className="mt-2 text-base text-gray-600 text-center">
                生成和管理与Google身份验证器兼容的TOTP代码。
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-yellow-500 text-white mx-auto">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">
                模板化管理
              </h3>
              <p className="mt-2 text-base text-gray-600 text-center">
                预置加密钱包、登录信息、银行账户等模板。
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">
                去中心化
              </h3>
              <p className="mt-2 text-base text-gray-600 text-center">
                基于互联网计算机构建，实现真正的去中心化和抗审查。
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-6 py-16 sm:px-12 sm:py-20 lg:px-16">
            <div className="text-center">
              <h3 className="text-3xl font-extrabold text-white mb-4">
                准备保护您的数据了吗？
              </h3>
              <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                加入数千名信任LotS保护其最敏感信息的用户，开启您的安全数据管理之旅。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <LoginButton />
                <div className="text-blue-100 text-sm">
                  ✓ 完全免费使用 &nbsp;&nbsp; ✓ 无需信用卡 &nbsp;&nbsp; ✓ 即刻开始
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

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
