import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import './LoginPage.css';

const LoginPage = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [keepLogin, setKeepLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const location = useLocation();
  const welcomeMessage = location.state?.message;
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 실제 로그인 API 호출
      const response = await authService.login(userId, password);
      
      if (response.access_token) {
        await login(response);
        console.log('로그인 성공, 홈으로 이동');
        navigate('/home');
      } else {
        setError('로그인 응답에 토큰이 없습니다.');
      }
    } catch (error) {
      setError(error.message || '로그인에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header" onClick={() => navigate('/')}>
          <h1>365 plate</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-form-group">
            <label htmlFor="userId">아이디</label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="아이디"
              required
            />
          </div>
          
          <div className="login-form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              required
            />
          </div>
          
          <div className="login-form-group login-checkbox-group">
            <label className="login-checkbox-label">
              <input
                type="checkbox"
                id="keepLogin"
                checked={keepLogin}
                onChange={(e) => setKeepLogin(e.target.checked)}
              />
              <span className="checkmark"></span>
              로그인 상태유지
            </label>
          </div>
          
          {welcomeMessage && <div className="login-welcome-message">{welcomeMessage}</div>}
          {error && <div className="login-error-message">{error}</div>}
          
          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>
        
        <div className="login-footer">
          <div className="login-signup-link">
            <p>계정이 없으신가요? <button 
              type="button" 
              className="login-signup-button"
              onClick={() => navigate('/signup')}
            >계정 만들기</button></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
