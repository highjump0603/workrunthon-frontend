import React, { useState, useEffect, useCallback } from 'react';
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

  // 가계부와 동일한 방식으로 예산 정보와 지출 계산을 한 번에 처리
  const fetchBudgetAndExpenseInfo = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      // 1. 사용자 프로필에서 예산 정보와 사용자 ID 가져오기
      const userResponse = await fetch('https://wrtigloo.duckdns.org:8000/users/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json'
        }
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        console.log('Mypage.js - 사용자 데이터:', userData); // 디버깅용
        
        const userId = userData.id;
        const totalBudget = userData.budget || 0;
        console.log('Mypage.js - 사용자 ID:', userId, '총 예산:', totalBudget); // 디버깅용
        
        // 사용자 ID는 로컬 변수로만 사용
        
        // 2. 지출 데이터 가져오기 (가계부와 동일한 API 사용)
        const response = await fetch(`https://wrtigloo.duckdns.org:8000/planners/history?user_id=${userId}&limit=100`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Mypage.js - 지출 데이터:', data); // 디버깅용
          
          if (Array.isArray(data)) {
            // 3. 총 지출 계산 (가계부와 동일한 방식)
            const totalSpent = data.reduce((sum, plan) => sum + (plan.cost || 0), 0);
            const remainingBudget = Math.max(0, totalBudget - totalSpent);
            const budgetPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
            
            console.log('Mypage.js - 예산 계산:', {
              totalBudget,
              totalSpent,
              remainingBudget,
              budgetPercentage
            }); // 디버깅용
            
            // 4. 예산 정보 업데이트 (한 번만)
            setBudgetInfo({
              total_budget: totalBudget,
              remaining_budget: remainingBudget,
              budget_percentage: budgetPercentage
            });
          } else {
            console.log('Mypage.js - API 응답이 배열이 아닙니다:', typeof data);
            setBudgetInfo({
              total_budget: totalBudget,
              remaining_budget: totalBudget,
              budget_percentage: 0
            });
          }
        } else {
          console.error('Mypage.js - 지출 API 응답 오류:', response.status, response.statusText);
          setBudgetInfo({
            total_budget: totalBudget,
            remaining_budget: totalBudget,
            budget_percentage: 0
          });
        }
      }
    } catch (error) {
      console.error('Mypage.js - 예산 및 지출 정보 조회 에러:', error);
    }
  }, []);

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

  // 컴포넌트 마운트 시 예산 정보와 리뷰 개수 가져오기 (가계부와 동일한 로직)
  useEffect(() => {
    fetchBudgetAndExpenseInfo();
    fetchReviewCount();
  }, [fetchBudgetAndExpenseInfo]);

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
