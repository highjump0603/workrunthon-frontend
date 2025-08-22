import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BudgetManagement.css';
import LeftArrowIcon from '../assets/left_arrow.svg';
import { userService } from '../services/userService';

const BudgetManagement = () => {
  const navigate = useNavigate();
  const [currentBudget, setCurrentBudget] = useState(0);
  const [recommendedBudget] = useState(0); // API가 아직 없어서 0으로 설정
  const [recentSpendingAverage] = useState(0); // API가 아직 없어서 0으로 설정
  const [isLoading, setIsLoading] = useState(true);

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

  // 사용자 프로필에서 예산 정보 가져오기
  const fetchBudgetInfo = async () => {
    try {
      setIsLoading(true);
      const userData = await userService.getCurrentUser();
      setCurrentBudget(userData.budget || 0);
    } catch (error) {
      console.error('예산 정보 조회 에러:', error);
      setCurrentBudget(0); // 에러 시 0원으로 설정
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 예산 정보 가져오기
  useEffect(() => {
    fetchBudgetInfo();
  }, []);

  const handleSave = async () => {
    try {
      // 사용자 프로필 업데이트
      await userService.updateProfile({
        budget: currentBudget
      });
      
      alert('예산이 성공적으로 저장되었습니다.');
      navigate('/mypage');
    } catch (error) {
      console.error('예산 저장 에러:', error);
      alert('예산 저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 로딩 상태 표시
  if (isLoading) {
    return (
      <div className="budget-management-container">
        <div className="budget-header">
          <button className="back-button" onClick={() => navigate('/mypage')}>
            <img src={LeftArrowIcon} alt="back" className="back-arrow" />
          </button>
          <h1 className="budget-title">내 예산</h1>
        </div>
        <div className="budget-loading">
          <p>예산 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }



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
          <div className="manage-budget-amount">₩ {currentBudget.toLocaleString()}</div>
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
