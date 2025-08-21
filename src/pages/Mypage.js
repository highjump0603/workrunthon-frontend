import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Mypage.css';
import BottomNavigation from '../components/BottomNavigation';

const Mypage = () => {
  const navigate = useNavigate();

  const handleAllergyClick = () => {
    navigate('/allergy-settings');
  };

  const handleFoodPreferencesClick = () => {
    navigate('/food-preferences');
  };

  const handleBudgetClick = () => {
    navigate('/budget-management');
  };

  return (
    <div className="mypage-container">
      {/* 상단 네비게이션 */}
      <div className="mypage-header">
        <div className="user-profile">
          <div className="user-name font-bold">홍길동</div>
        </div>
      </div>

      {/* 사용자 통계 */}
      <div className="user-stats">
        <div className="stat-item">
          <div className="stat-label font-regular">저장됨</div>
          <div className="stat-value font-semi-bold">25</div>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <div className="stat-label font-regular">내 리뷰</div>
          <div className="stat-value font-semi-bold">8</div>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <div className="stat-label font-regular">이번 달 남은 돈</div>
          <div className="stat-value font-semi-bold">350,000</div>
        </div>
      </div>

      {/* 나의 정보 섹션 */}
      <div className="info-section">
        <h2 className="section-title font-bold">나의 정보</h2>
        <div className="menu-list">
          <div className="menu-item" onClick={handleBudgetClick}>
            <span>내 예산</span>
            <span className="arrow">→</span>
          </div>
          <div className="menu-item">
            <span>내 리뷰</span>
            <span className="arrow">→</span>
          </div>
          <div className="menu-item">
            <span>최근 본 식당</span>
            <span className="arrow">→</span>
          </div>
          <div className="menu-item">
            <span>방문 기록</span>
            <span className="arrow">→</span>
          </div>
          <div className="menu-item">
            <span>저장됨</span>
            <span className="arrow">→</span>
          </div>
          <div className="menu-item" onClick={handleAllergyClick}>
            <span>알레르기 설정</span>
            <span className="arrow">→</span>
          </div>
          <div className="menu-item" onClick={handleFoodPreferencesClick}>
            <span>비선호 음식 설정</span>
            <span className="arrow">→</span>
          </div>
        </div>
      </div>

      {/* 나의 계정 정보 섹션 */}
      <div className="account-section">
        <h2 className="section-title">나의 계정 정보</h2>
        <div className="menu-list">
          <div className="menu-item">
            <span>회원 정보 수정</span>
            <span className="arrow">→</span>
          </div>
          <div className="menu-item">
            <span>주소 관리</span>
            <span className="arrow">→</span>
          </div>
          <div className="menu-item">
            <span>설정</span>
            <span className="arrow">→</span>
          </div>
        </div>
      </div>



      <div style={{height: '100px'}}></div>
      <BottomNavigation activeTab="mypage" />
    </div>
  );
};

export default Mypage;
