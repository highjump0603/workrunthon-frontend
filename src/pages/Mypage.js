import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Mypage.css';
import BottomNavigation from '../components/BottomNavigation';
import ArrowRightIcon from '../assets/arrow.svg';
import { reviewService } from '../services/reviewService';

const Mypage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // 예산 정보 state 추가
  const [budgetInfo, setBudgetInfo] = useState({
    total_budget: 0,
    remaining_budget: 0,
    budget_percentage: 0
  });

  // 리뷰 개수 state 추가
  const [reviewCount, setReviewCount] = useState(0);

  const handleAllergyClick = () => {
    navigate('/allergy-settings');
  };

  const handleFoodPreferencesClick = () => {
    navigate('/food-preferences');
  };

  const handleBudgetClick = () => {
    navigate('/budget-management');
  };

  const handleRecentlyViewedClick = () => {
    navigate('/recently-viewed');
  };

  const handleVisitHistoryClick = () => {
    navigate('/visit-history');
  };

  const handleMyReviewsClick = () => {
    navigate('/my-reviews');
  };

  const handleAddressManagementClick = () => {
    navigate('/address-management');
  };

  const handleProfileEditClick = () => {
    navigate('/profile-edit');
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const handleSavedRestaurantsClick = () => {
    navigate('/saved-restaurants');
  };

  // 사용자 프로필에서 예산 정보 가져오기
  const fetchBudgetInfo = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const response = await fetch('https://wrtigloo.duckdns.org:8000/users/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        // 사용자 프로필에서 예산 정보 추출
        setBudgetInfo({
          total_budget: userData.budget || 0,
          remaining_budget: userData.budget || 0, // 현재는 총 예산과 동일하게 설정
          budget_percentage: 0 // 아직 지출 정보가 없어서 0으로 설정
        });
      }
    } catch (error) {
      console.error('사용자 프로필 조회 에러:', error);
    }
  };

  // 리뷰 개수 가져오기
  const fetchReviewCount = async () => {
    try {
      const count = await reviewService.getMyReviewCount();
      setReviewCount(count);
    } catch (error) {
      console.error('리뷰 개수 조회 에러:', error);
      setReviewCount(0); // 오류 시 0으로 설정
    }
  };

  // 컴포넌트 마운트 시 예산 정보와 리뷰 개수 가져오기
  useEffect(() => {
    fetchBudgetInfo();
    fetchReviewCount();
  }, []);

  const handleLogout = async () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      await logout();
      navigate('/login');
    }
  };

  return (
    <div className="mypage-container">
      {/* 상단 네비게이션 */}
      <div className="mypage-header">
        <div className="user-profile">
          <div className="user-name font-bold">{user?.name || '사용자'}</div>
        </div>
      </div>

      {/* 사용자 통계 */}
      <div className="user-stats">
        <div className="stat-item">
          <div className="stat-label font-regular">저장됨</div>
          <div className="stat-value font-semi-bold">0</div>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <div className="stat-label font-regular">내 리뷰</div>
          <div className="stat-value font-semi-bold">{reviewCount}</div>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <div className="stat-label font-regular">이번 달 남은 돈</div>
          <div className="stat-value font-semi-bold">{budgetInfo?.remaining_budget?.toLocaleString() || 0}</div>
        </div>
      </div>

      {/* 나의 정보 섹션 */}
      <div className="info-section">
        <h2 className="section-title font-bold">나의 정보</h2>
        <div className="menu-list">
          <div className="menu-item" onClick={handleBudgetClick}>
            <span>내 예산</span>
            <img src={ArrowRightIcon} alt="arrow" className="arrow" />
          </div>
          <div className="menu-item" onClick={handleMyReviewsClick}>
            <span>내 리뷰</span>
            <img src={ArrowRightIcon} alt="arrow" className="arrow" />
          </div>
          <div className="menu-item" onClick={handleRecentlyViewedClick}>
            <span>최근 본 식당</span>
            <img src={ArrowRightIcon} alt="arrow" className="arrow" />
          </div>
          <div className="menu-item" onClick={handleVisitHistoryClick}>
            <span>방문 내역</span>
            <img src={ArrowRightIcon} alt="arrow" className="arrow" />
          </div>
          <div className="menu-item" onClick={handleSavedRestaurantsClick}>
            <span>저장한 가게</span>
            <img src={ArrowRightIcon} alt="arrow" className="arrow" />
          </div>
          <div className="menu-item" onClick={handleAllergyClick}>
            <span>알레르기 설정</span>
            <img src={ArrowRightIcon} alt="arrow" className="arrow" />
          </div>
          <div className="menu-item" onClick={handleFoodPreferencesClick}>
            <span>비선호 음식 설정</span>
            <img src={ArrowRightIcon} alt="arrow" className="arrow" />
          </div>
        </div>
      </div>

      {/* 나의 계정 정보 섹션 */}
      <div className="account-section">
        <h2 className="section-title">나의 계정 정보</h2>
        <div className="menu-list">
          <div className="menu-item" onClick={handleProfileEditClick}>
            <span>회원 정보 수정</span>
            <img src={ArrowRightIcon} alt="arrow" className="arrow" />
          </div>
          <div className="menu-item" onClick={handleAddressManagementClick}>
            <span>주소 관리</span>
            <img src={ArrowRightIcon} alt="arrow" className="arrow" />
          </div>
          <div className="menu-item" onClick={handleSettingsClick}>
            <span>설정</span>
            <img src={ArrowRightIcon} alt="arrow" className="arrow" />
          </div>
          <div className="menu-item logout-item" onClick={handleLogout}>
            <span>로그아웃</span>
            <img src={ArrowRightIcon} alt="arrow" className="arrow" />
          </div>
        </div>
      </div>

      <div style={{height: '100px'}}></div>
      <BottomNavigation activeTab="mypage" />
    </div>
  );
};

export default Mypage;
