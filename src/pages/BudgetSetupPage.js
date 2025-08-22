import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BudgetSetupPage.css';

const BudgetSetupPage = () => {
  const navigate = useNavigate();
  const [budget, setBudget] = useState(300000);



  const handleContinue = () => {
    // 회원가입 페이지로 예산 정보와 함께 이동
    navigate('/signup', { state: { budget: budget } });
  };

  const formatBudget = (amount) => {
    return `₩${amount.toLocaleString()}`;
  };

  const getSliderGradient = (value) => {
    const percentage = (value / 1000000) * 100;
    return `linear-gradient(to right, #4CAF50 0%, #4CAF50 ${percentage}%, #E0E0E0 ${percentage}%, #E0E0E0 100%)`;
  };

  return (
    <div className="budget-setup-page">
      <div className="budget-container">
        {/* 헤더 */}
        <div className="budget-setup-header">
          <h1 className="budget-setup-app-title">365 plate</h1>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="budget-setup-content">
          <h2 className="budget-setup-question">한 달 식비 예산을 알려주세요</h2>
          
          <div className="budget-setup-controls">
            <button 
              className="budget-setup-button minus-button"
              onClick={() => setBudget(prev => Math.max(0, prev - 50000))}
            >
              <span className="budget-setup-button-icon">−</span>
            </button>
            
            <div className="budget-setup-display">
              {formatBudget(budget)}
            </div>
            
            <button 
              className="budget-setup-button plus-button"
              onClick={() => setBudget(prev => prev + 50000)}
            >
              <span className="budget-setup-button-icon">+</span>
            </button>
          </div>

          <div className="budget-setup-slider-container">
            <input
              type="range"
              min="0"
              max="1000000"
              step="50000"
              value={budget}
              onChange={(e) => setBudget(parseInt(e.target.value))}
              className="budget-setup-slider"
              style={{
                background: getSliderGradient(budget)
              }}
            />
            <div className="budget-setup-slider-labels">
              <span>₩0</span>
              <span>₩1,000,000</span>
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="budget-setup-footer">
          <button 
            className="budget-setup-continue-button"
            onClick={handleContinue}
          >
            계속하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default BudgetSetupPage;
