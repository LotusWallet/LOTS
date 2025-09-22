import React from 'react';
import { Shield, Lock, Key, Database, Smartphone, Globe, CreditCard, Building, User, IdCard, Car, FileText, CheckCircle, Zap, Eye, Users, Award, Layers } from 'lucide-react';
import LoginButton from './LoginButton';

export default function LandingPage() {
  const dataTemplates = [
    {
      name: 'Crypto Wallet',
      icon: <Shield className="h-8 w-8" />,
      description: 'Securely store your cryptocurrency wallet information, including wallet addresses, private keys, and seed phrases to ensure digital asset security.',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      name: 'Login Credentials',
      icon: <User className="h-8 w-8" />,
      description: 'Manage login credentials for websites and applications, including usernames, passwords, and related account information.',
      color: 'bg-green-100 text-green-600'
    },
    {
      name: 'Bank Account',
      icon: <Building className="h-8 w-8" />,
      description: 'Protect your bank account details, including account numbers, bank information, and online banking credentials.',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      name: 'Credit Card',
      icon: <CreditCard className="h-8 w-8" />,
      description: 'Securely store credit and debit card information, including card numbers, expiration dates, CVV, and cardholder information.',
      color: 'bg-red-100 text-red-600'
    },
    {
      name: 'Identity Document',
      icon: <IdCard className="h-8 w-8" />,
      description: 'Manage various identity document information, such as ID cards, passports, social security cards, and other important document data.',
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      name: 'Driver\'s License',
      icon: <Car className="h-8 w-8" />,
      description: 'Store driver\'s license related information, including license numbers, vehicle categories, expiration dates, and other driving qualification data.',
      color: 'bg-indigo-100 text-indigo-600'
    },
    {
      name: 'OTP',
      icon: <Smartphone className="h-8 w-8" />,
      description: 'Manage two-factor authentication keys and generate Google Authenticator compatible TOTP dynamic verification codes.',
      color: 'bg-pink-100 text-pink-600'
    },
    {
      name: 'Secure Notes',
      icon: <FileText className="h-8 w-8" />,
      description: 'Record important security information and notes, such as security question answers, important reminders, and other sensitive text content.',
      color: 'bg-gray-100 text-gray-600'
    }
  ];

  const whyChooseReasons = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Military-Grade Security Encryption',
      description: 'Uses end-to-end encryption technology to ensure your data is always protected at the highest level during transmission and storage.',
      color: 'text-blue-600'
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: 'Personal Dedicated Container',
      description: 'Each user has an independent data container, achieving true data isolation and protecting your privacy from intrusion.',
      color: 'text-green-600'
    },
    {
      icon: <Key className="h-8 w-8" />,
      title: 'Decentralized Identity Authentication',
      description: 'Based on Internet Identity decentralized identity authentication, no need to remember complex passwords, secure and convenient.',
      color: 'text-purple-600'
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: 'Fully Decentralized',
      description: 'Runs on the Internet Computer blockchain, no single point of failure, censorship-resistant, truly decentralized application.',
      color: 'text-red-600'
    },
    {
      icon: <Layers className="h-8 w-8" />,
      title: 'Rich Data Templates',
      description: 'Provides 8 preset data templates covering various sensitive information management needs in daily life.',
      color: 'text-yellow-600'
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: 'Simple and Easy-to-Use Interface',
      description: 'Intuitive user interface design makes complex security features simple and easy to use, accessible to everyone.',
      color: 'text-indigo-600'
    }
  ];

  const keyBenefits = [
    {
      icon: <Lock className="h-8 w-8" />,
      title: 'Data Sovereignty',
      description: 'You completely own and control your own data, no need to worry about third-party access or data breach risks.',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      icon: <Eye className="h-8 w-8" />,
      title: 'Privacy Protection',
      description: 'Zero-knowledge architecture ensures that even platform operators cannot access your sensitive data content.',
      gradient: 'from-green-500 to-green-600'
    },
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: 'High Availability',
      description: 'Blockchain-based distributed architecture ensures 24/7 stable service operation with data never lost.',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Multi-Device Sync',
      description: 'Securely access your data on any device, achieving seamless cross-platform synchronization experience.',
      gradient: 'from-red-500 to-red-600'
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: 'Industry Standards',
      description: 'Follows international security standards and best practices, providing enterprise-level data protection capabilities.',
      gradient: 'from-yellow-500 to-yellow-600'
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: 'Smart Features',
      description: 'Integrates password generators, TOTP dynamic codes, and other smart tools to enhance your digital security level.',
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
            <div className="flex items-center gap-4">
              <LoginButton />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Secure Data Management
            <span className="block text-blue-600">Made Simple</span>
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
            Store and manage your sensitive data using military-grade encryption, personal container isolation, and seamless Internet Identity wallet authentication.
          </p>
          <div className="mt-10">
            <LoginButton />
          </div>
        </div>

        {/* Comprehensive Data Templates Section */}
        <div className="mt-24">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Comprehensive Data Templates</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              LotS provides 8 carefully designed data templates covering various sensitive information management needs in your daily life, making data organization simple and efficient.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dataTemplates.map((template, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
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
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Choose LotS?</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              LotS is not just a data management tool, but your digital life security guardian. Here are 6 reasons to choose LotS.
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
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Core Advantages</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The 6 core advantages of the LotS platform provide you with an unparalleled data security experience, giving you peace of mind in the digital age.
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
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Platform Features</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A secure data management platform built with the latest technology, providing comprehensive data protection.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">
                End-to-End Encryption
              </h3>
              <p className="mt-2 text-base text-gray-600 text-center">
                Your data is encrypted before leaving your device and remains secure in your personal container.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mx-auto">
                <Database className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">
                Personal Container
              </h3>
              <p className="mt-2 text-base text-gray-600 text-center">
                Each user has their own isolated container, ensuring maximum security and data sovereignty.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white mx-auto">
                <Key className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">
                Internet Identity Authentication
              </h3>
              <p className="mt-2 text-base text-gray-600 text-center">
                Secure authentication using your Internet Identity wallet, no passwords to remember.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-500 text-white mx-auto">
                <Smartphone className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">
                Dynamic Password Support
              </h3>
              <p className="mt-2 text-base text-gray-600 text-center">
                Generate and manage Google Authenticator compatible TOTP codes.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-yellow-500 text-white mx-auto">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">
                Template Management
              </h3>
              <p className="mt-2 text-base text-gray-600 text-center">
                Pre-built templates for crypto wallets, login credentials, bank accounts, and more.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">
                Decentralized
              </h3>
              <p className="mt-2 text-base text-gray-600 text-center">
                Built on the Internet Computer, achieving true decentralization and censorship resistance.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-6 py-16 sm:px-12 sm:py-20 lg:px-16">
            <div className="text-center">
              <h3 className="text-3xl font-extrabold text-white mb-4">
                Ready to Protect Your Data?
              </h3>
              <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of users who trust LotS to protect their most sensitive information and start your secure data management journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <LoginButton />
                <div className="text-blue-100 text-sm">
                  ✓ Completely free to use   ✓ No credit card required   ✓ Start immediately
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
            © 2025. Built with ❤️ using{' '}
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
