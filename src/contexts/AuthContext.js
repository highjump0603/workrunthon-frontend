import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  const [isDevMode, setIsDevMode] = useState(false);



  // 로그아웃
  const logout = useCallback(async () => {
    // 개발용 모드인 경우
    if (isDevMode) {
      setIsDevMode(false);
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    // 일반 로그아웃 처리
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        await authService.logout(token);
      } catch (error) {
        console.error('로그아웃 API 호출 실패:', error);
      }
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setIsAuthenticated(false);
  }, [isDevMode]);

  // 토큰 갱신
  const refreshAccessToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('리프레시 토큰이 없습니다.');
      }

      const response = await authService.refreshToken(refreshToken);
      localStorage.setItem('accessToken', response.access_token);
      localStorage.setItem('refreshToken', response.refresh_token);
      return response.access_token;
    } catch (error) {
      console.error('토큰 갱신 실패:', error);
      // 리프레시 토큰도 만료된 경우 로그아웃
      await logout();
      throw error;
    }
  }, [logout]);

  // 사용자 정보 가져오기
  const fetchUserInfo = useCallback(async () => {
    // 개발용 모드인 경우 API 호출하지 않음
    if (isDevMode) {
      return;
    }

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
      
      // 토큰이 만료된 경우 갱신 시도
      if (error.message.includes('401') || error.message.includes('403')) {
        try {
          const newToken = await refreshAccessToken();
          // 새 토큰으로 다시 시도
          const userData = await authService.getUserInfo(newToken);
          setUser(userData);
          setIsAuthenticated(true);
          return;
        } catch (refreshError) {
          console.error('토큰 갱신 실패:', refreshError);
        }
      }
      
      // 토큰 갱신 실패 시 로그아웃
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [refreshAccessToken, isDevMode]);

  // 로그인
  const login = useCallback(async (loginResponse) => {
    // 개발용 모드 체크
    if (loginResponse.access_token && loginResponse.access_token.startsWith('dev_access_token_')) {
      setIsDevMode(true);
      setIsAuthenticated(true);
      setUser({
        id: 999,
        user_id: 'dev_user',
        name: '개발자',
        oauth: 'None',
        address: '개발용 주소',
        budget: 50000,
        created_datetime: new Date().toISOString(),
        modified_datetime: new Date().toISOString()
      });
      setLoading(false);
      return;
    }

    // 일반 로그인 처리
    localStorage.setItem('accessToken', loginResponse.access_token);
    localStorage.setItem('refreshToken', loginResponse.refresh_token);
    await fetchUserInfo();
  }, [fetchUserInfo]);

  // 컴포넌트 마운트 시 사용자 정보 확인
  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  const value = {
    user,
    isAuthenticated,
    loading,
    isDevMode,
    login,
    logout,
    fetchUserInfo,
    refreshAccessToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
