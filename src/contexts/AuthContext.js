import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);



  // 사용자 정보 가져오기
  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      const userData = await authService.getUserInfo(token);
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('사용자 정보 가져오기 실패:', error);
      // 토큰이 유효하지 않거나 만료된 경우
      localStorage.removeItem('accessToken');
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 로그인
  const login = async (token) => {
    localStorage.setItem('accessToken', token);
    await fetchUserInfo();
  };

  // 로그아웃
  const logout = async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        await authService.logout(token);
      } catch (error) {
        console.error('로그아웃 API 호출 실패:', error);
      }
    }
    localStorage.removeItem('accessToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  // 컴포넌트 마운트 시 사용자 정보 확인
  useEffect(() => {
    fetchUserInfo();
  }, []);

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    fetchUserInfo
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
