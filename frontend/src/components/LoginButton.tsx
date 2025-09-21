import React from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { LogIn, LogOut, Loader2 } from 'lucide-react';

export default function LoginButton() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <button
      onClick={handleAuth}
      disabled={disabled}
      className={`inline-flex items-center px-6 py-3 rounded-full font-medium transition-all duration-200 ${
        isAuthenticated
          ? 'bg-gray-200 hover:bg-gray-300 text-gray-800 shadow-sm'
          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {loginStatus === 'logging-in' ? (
        <>
          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          连接中...
        </>
      ) : isAuthenticated ? (
        <>
          <LogOut className="h-5 w-5 mr-2" />
          退出登录
        </>
      ) : (
        <>
          <LogIn className="h-5 w-5 mr-2" />
          连接Internet Identity钱包
        </>
      )}
    </button>
  );
}
