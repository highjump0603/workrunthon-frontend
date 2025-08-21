import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BudgetManagement.css';
import LeftArrowIcon from '../assets/left_arrow.svg';

const BudgetManagement = () => {
  const navigate = useNavigate();
  const [currentBudget, setCurrentBudget] = useState(400000);
  const [recommendedBudget] = useState(325000);
  const [recentSpendingAverage] = useState(392000);

  const handleBudgetChange = (amount) => {
    const newBudget = currentBudget + amount;
    if (newBudget >= 100000 && newBudget <= 1000000) {
      setCurrentBudget(newBudget);
    }
  };

  const handleSliderChange = (e) => {
    const value = parseInt(e.target.value);
    setCurrentBudget(value);
  };

  const handleSave = () => {
    console.log('예산 설정 저장:', currentBudget);
    alert('예산이 저장되었습니다.');
    navigate('/mypage');
  };

  return (
    <div className="budget-management-container">
      {/* 헤더 */}
      <div className="budget-header">
        <button className="back-button" onClick={() => navigate('/mypage')}>
          <img src={LeftArrowIcon} alt="back" className="back-arrow" />
        </button>
        <h1 className="budget-title">내 예산</h1>
      </div>

      {/* 예산 조정 섹션 */}
      <div className="budget-adjustment-section">
        <div className="current-budget-display">
          <button 
            className="budget-button minus-button" 
            onClick={() => handleBudgetChange(-10000)}
          >
            -
          </button>
          <div className="budget-amount">₩ {currentBudget.toLocaleString()}</div>
          <button 
            className="budget-button plus-button" 
            onClick={() => handleBudgetChange(10000)}
          >
            +
          </button>
        </div>
        
        {/* 예산 슬라이더 */}
        <div className="budget-slider-container">
          <input
            type="range"
            min="100000"
            max="1000000"
            step="10000"
            value={currentBudget}
            onChange={handleSliderChange}
            className="budget-slider"
          />
          <div className="slider-labels">
            <span className="min-value">₩100,000</span>
            <span className="max-value">₩1,000,000</span>
          </div>
        </div>
      </div>

      {/* 권장 예산 섹션 */}
      <div className="budget-info-section">
        <div className="budget-info-item">
          <div className="budget-info-value">₩{recommendedBudget.toLocaleString()}</div>
          <div className="budget-info-label">권장 예산</div>
          <div className="budget-info-description">
            권장 예산에 따라 예산이 자동으로 분배됩니다.
          </div>
        </div>
      </div>

      {/* 최근 지출 평균 섹션 */}
      <div className="budget-info-section">
        <div className="budget-info-item">
          <div className="budget-info-value">₩{recentSpendingAverage.toLocaleString()}</div>
          <div className="budget-info-label">최근 지출 평균</div>
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="save-button-container2">
        <button className="save-button2" onClick={handleSave}>
          저장
        </button>
      </div>
    </div>
  );
};

export default BudgetManagement;
