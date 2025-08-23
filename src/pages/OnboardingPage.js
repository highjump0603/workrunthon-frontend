import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { userService } from '../services/userService';
import './OnboardingPage.css';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // SignupPage에서 전달받은 예산 정보가 있으면 사용, 없으면 기본값
  const initialBudget = location.state?.budget || 300000;
  const [budget, setBudget] = useState(initialBudget);
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async () => {
    try {
      setIsLoading(true);
      
      // 예산 정보를 서버에 저장
      await userService.updateProfile({
        budget: budget,
        onboarding_completed: true
      });
      
      console.log('온보딩 예산 설정 완료:', budget);
      alert('예산 설정이 완료되었습니다!');
      
      // 예산 설정 완료 후 홈으로 이동
      navigate('/home');
    } catch (error) {
      console.error('온보딩 예산 저장 에러:', error);
      alert('예산 저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatBudget = (amount) => {
    return `₩${amount.toLocaleString()}`;
  };

  const getSliderGradient = (value) => {
    const percentage = (value / 1000000) * 100;
    return `linear-gradient(to right, #4CAF50 0%, #4CAF50 ${percentage}%, #E0E0E0 ${percentage}%, #E0E0E0 100%)`;
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-container">
        {/* 헤더 */}
        <div className="onboarding-header">
          <h1 className="onboarding-app-title">365 plate</h1>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="onboarding-content">
          <h2 className="onboarding-question">한 달 식비 예산을 알려주세요</h2>
          
          <div className="onboarding-budget-controls">
            <button 
              className="onboarding-budget-button minus-button"
              onClick={() => setBudget(prev => Math.max(0, prev - 50000))}
            >
              <span className="onboarding-button-icon">−</span>
            </button>
            
            <div className="onboarding-budget-display">
              {formatBudget(budget)}
            </div>
            
            <button 
              className="onboarding-budget-button plus-button"
              onClick={() => setBudget(prev => prev + 50000)}
            >
              <span className="onboarding-button-icon">+</span>
            </button>
          </div>

          <div className="onboarding-budget-slider-container">
            <input
              type="range"
              min="0"
              max="1000000"
              step="50000"
              value={budget}
              onChange={(e) => setBudget(parseInt(e.target.value))}
              className="onboarding-budget-slider"
              style={{
                background: getSliderGradient(budget)
              }}
            />
            <div className="onboarding-slider-labels">
              <span>₩0</span>
              <span>₩1,000,000</span>
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="onboarding-footer">
          <button 
            className="onboarding-complete-button"
            onClick={handleComplete}
            disabled={isLoading}
          >
            {isLoading ? '저장 중...' : '시작하기'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
