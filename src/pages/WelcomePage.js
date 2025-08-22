import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './WelcomePage.css';

const WelcomePage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleStartClick = () => {
    navigate('/signup');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  // 개발용: 로그인 없이 홈으로 이동
  const handleDevLogin = () => {
    // 개발용 더미 토큰 생성
    const dummyTokens = {
      access_token: 'dev_access_token_' + Date.now(),
      refresh_token: 'dev_refresh_token_' + Date.now()
    };
    
    // 더미 사용자 정보와 함께 로그인 처리
    login(dummyTokens);
    
    // 잠시 대기 후 홈으로 이동 (상태 업데이트 완료 대기)
    setTimeout(() => {
      navigate('/home');
    }, 100);
  };

  return (
    <div className="welcome-page">
      <div className="welcome-container">
        {/* 상단 로고 */}
        <div className="welcome-logo-section">
          <h1 className="welcome-app-title font-bold">365 plate</h1>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="welcome-main-content">
          <h2 className="welcome-main-title">똑똑한 식비 관리를 시작해보세요</h2>
          <p className="welcome-main-description">
            AI 추출으로 예산 내에서 식사를 계획하고 관리 할 수 있어요.
          </p>
        </div>

        {/* 시작하기 버튼 */}
        <div className="welcome-action-section">
          <button 
            className="welcome-start-button"
            onClick={handleStartClick}
          >
            시작하기
          </button>
        </div>

        {/* 로그인 링크 */}
        <div className="welcome-login-section">
          <p className="welcome-login-text">
            이미 계정이 있으신가요?{' '}
            <button 
              className="welcome-login-link"
              onClick={handleLoginClick}
            >
              로그인
            </button>
          </p>
        </div>

        {/* 개발용 로그인 버튼 */}
        <div className="welcome-dev-section">
          <button 
            className="welcome-dev-button"
            onClick={handleDevLogin}
          >
            🚀 개발용: 바로 홈으로
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
