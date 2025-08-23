import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.css';

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate('/signup');
  };

  const handleLoginClick = () => {
    navigate('/login');
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
      </div>
    </div>
  );
};

export default WelcomePage;
