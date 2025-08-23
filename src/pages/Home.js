import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import ArrowRightIcon from '../assets/arrow.svg';
import BottomNavigation from '../components/BottomNavigation';

const Home = () => {
  const navigate = useNavigate();
  const [todaySpending, setTodaySpending] = useState([]);
  const [thisWeekSpending, setThisWeekSpending] = useState(0);
  const [lastWeekSpending, setLastWeekSpending] = useState(0);
  const [budgetInfo, setBudgetInfo] = useState({
    total_budget: 0,
    remaining_budget: 0,
    budget_percentage: 0
  });
  // 현재 사용자 ID 추가
  const [currentUserId, setCurrentUserId] = useState(null);

  // 오늘 날짜를 YYYY-MM-DD 형식으로 가져오기
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 이번주와 지난주 날짜 범위 계산
  const getWeekRanges = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일
    
    // 이번주 월요일부터 오늘까지
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - currentDay + (currentDay === 0 ? -6 : 1));
    
    // 지난주 월요일부터 일요일까지
    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(thisWeekStart.getDate() - 7);
    const lastWeekEnd = new Date(thisWeekStart);
    lastWeekEnd.setDate(thisWeekStart.getDate() - 1);
    
    return {
      thisWeekStart: thisWeekStart.toISOString().split('T')[0],
      thisWeekEnd: today.toISOString().split('T')[0],
      lastWeekStart: lastWeekStart.toISOString().split('T')[0],
      lastWeekEnd: lastWeekEnd.toISOString().split('T')[0]
    };
  };

  // 사용자 프로필에서 예산 정보 가져오기
  const fetchBudgetInfo = useCallback(async () => {
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
        console.log('사용자 데이터:', userData); // 디버깅용
        
        // user_id 확인 및 설정 (숫자 ID 사용)
        const userId = userData.id; // user_id 대신 id 사용
        console.log('설정할 사용자 ID:', userId); // 디버깅용
        
        // 사용자 ID 저장
        setCurrentUserId(userId);
        setBudgetInfo({
          total_budget: userData.budget || 0,
          remaining_budget: userData.budget || 0,
          budget_percentage: 0
        });
      }
    } catch (error) {
      console.error('사용자 프로필 조회 에러:', error);
    }
  }, []);

  // 월 전체 지출 내역 가져오기 (가계부와 동일한 방식)
  const fetchMonthlySpending = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token || !currentUserId) return;

      // currentUserId는 이미 숫자이므로 parseInt 불필요
      const userId = currentUserId;
      
      // /planners/ API 사용 (숫자 user_id)
      const response = await fetch(`https://wrtigloo.duckdns.org:8000/planners/?user_id=${userId}&limit=100`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const allPlans = data.items || []; // items 배열 사용
        
        console.log('전체 계획 데이터:', allPlans); // 디버깅용
        
        // 오늘 날짜에 해당하는 계획만 필터링 (오늘 지출 표시용)
        const todayPlansFiltered = allPlans.filter(plan => {
          const planDate = plan.plan_date;
          const today = getTodayDate();
          console.log('계획 날짜:', planDate, '오늘 날짜:', today, '일치:', planDate === today); // 디버깅용
          return planDate === today;
        });
        
        console.log('오늘 필터링된 계획:', todayPlansFiltered); // 디버깅용
        
        // 오늘 지출 내역을 시간대별로 그룹화
        const spendingByTime = {};
        todayPlansFiltered.forEach(plan => {
          const time = plan.type || '기타';
          if (!spendingByTime[time]) {
            spendingByTime[time] = 0;
          }
          spendingByTime[time] += plan.cost || 0;
        });

        // 시간대별 지출을 배열로 변환
        const spendingArray = Object.entries(spendingByTime).map(([time, amount]) => ({
          category: time,
          amount: amount,
          time: time
        }));

        setTodaySpending(spendingArray);
        
        // 전체 지출 계산 (가계부와 동일한 방식)
        const totalSpent = allPlans.reduce((sum, plan) => sum + (plan.cost || 0), 0);
        console.log('전체 지출:', totalSpent, '총 예산:', budgetInfo.total_budget); // 디버깅용
        
        // 예산 정보 업데이트 (가계부와 동일한 계산 로직)
        setBudgetInfo(prev => {
          const totalBudget = prev.total_budget;
          const remainingBudget = Math.max(0, totalBudget - totalSpent);
          const budgetPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
          
          console.log('예산 계산 결과:', { totalBudget, totalSpent, remainingBudget, budgetPercentage }); // 디버깅용
          
          return {
            ...prev,
            remaining_budget: remainingBudget,
            budget_percentage: budgetPercentage
          };
        });
      } else {
        console.error('지출 이력 조회 실패:', response.status, response.statusText);
        try {
          const errorData = await response.json();
          console.error('에러 상세:', errorData);
        } catch (e) {
          console.error('에러 응답 읽기 실패:', e);
        }
      }
    } catch (error) {
      console.error('지출 이력 조회 에러:', error);
    }
  }, [currentUserId, budgetInfo.total_budget]);

  // 이번주와 지난주 지출 비교
  const fetchWeekComparison = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token || !currentUserId) return;

      // currentUserId는 이미 숫자이므로 parseInt 불필요
      const userId = currentUserId;

      const weekRanges = getWeekRanges();
      
      // plan_date를 YYYY-MM 형식으로 변경하고 max_cost 제거
      const thisWeekMonth = weekRanges.thisWeekStart.substring(0, 7);
      const lastWeekMonth = weekRanges.lastWeekStart.substring(0, 7);
      
      // user_id를 숫자로 변환하여 API 호출
      const thisWeekResponse = await fetch(`https://wrtigloo.duckdns.org:8000/planners/?plan_date=${thisWeekMonth}&user_id=${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json'
        }
      });

      // user_id를 숫자로 변환하여 API 호출
      const lastWeekResponse = await fetch(`https://wrtigloo.duckdns.org:8000/planners/?plan_date=${lastWeekMonth}&user_id=${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json'
        }
      });

      if (thisWeekResponse.ok && lastWeekResponse.ok) {
        const thisWeekData = await thisWeekResponse.json();
        const lastWeekData = await lastWeekResponse.json();

        // 해당 주에 속하는 계획만 필터링
        const thisWeekPlans = (thisWeekData.items || []).filter(plan => {
          const planDate = new Date(plan.plan_date);
          const weekStart = new Date(weekRanges.thisWeekStart);
          const weekEnd = new Date(weekRanges.thisWeekEnd);
          return planDate >= weekStart && planDate <= weekEnd;
        });
        
        const lastWeekPlans = (lastWeekData.items || []).filter(plan => {
          const planDate = new Date(plan.plan_date);
          const weekStart = new Date(weekRanges.lastWeekStart);
          const weekEnd = new Date(weekRanges.lastWeekEnd);
          return planDate >= weekStart && planDate <= weekEnd;
        });

        const thisWeekTotal = thisWeekPlans.reduce((sum, plan) => sum + (plan.cost || 0), 0);
        const lastWeekTotal = lastWeekPlans.reduce((sum, plan) => sum + (plan.cost || 0), 0);

        setThisWeekSpending(thisWeekTotal);
        setLastWeekSpending(lastWeekTotal);
      } else {
        console.error('주간 비교 조회 실패:', {
          thisWeek: thisWeekResponse.status,
          lastWeek: lastWeekResponse.status
        });
        
        // 에러 응답 상세 확인
        if (!thisWeekResponse.ok) {
          try {
            const errorData = await thisWeekResponse.json();
            console.error('이번주 조회 에러 상세:', errorData);
          } catch (e) {
            console.error('이번주 에러 응답 읽기 실패:', e);
          }
        }
        
        if (!lastWeekResponse.ok) {
          try {
            const errorData = await lastWeekResponse.json();
            console.error('지난주 조회 에러 상세:', errorData);
          } catch (e) {
            console.error('지난주 에러 응답 읽기 실패:', e);
          }
        }
      }
    } catch (error) {
      console.error('주간 지출 비교 조회 에러:', error);
    }
  }, [currentUserId]);

  // 컴포넌트 마운트 시 데이터 가져오기
  useEffect(() => {
    fetchBudgetInfo();
  }, [fetchBudgetInfo]);

  // 예산 정보가 로드된 후 지출 데이터 가져오기 (가계부와 동일한 방식)
  useEffect(() => {
    if (budgetInfo.total_budget > 0 && currentUserId) {
      fetchMonthlySpending();
      fetchWeekComparison();
    }
  }, [budgetInfo.total_budget, currentUserId, fetchMonthlySpending, fetchWeekComparison]);

  // 페이지뷰 관련 state
  const [currentPage, setCurrentPage] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  
  // refs
  const pageWrapperRef = useRef(null);
  
  // 페이지 데이터
  const pages = [
    {
      id: 1,
      title: "오늘은 월급날!",
      subtitle: "고생한 연우 님께 선보이는",
      menuTitle: "오늘의 추천 메뉴",
      image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop&crop=center",
      buttonText: "오늘의 추천 맛집 확인하기"
    },
    {
      id: 2,
      title: "주말 특별 메뉴!",
      subtitle: "친구들과 함께 즐기는",
      menuTitle: "주말 추천 메뉴",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center",
      buttonText: "주말 맛집 둘러보기"
    },
    {
      id: 3,
      title: "건강한 한끼!",
      subtitle: "건강을 생각하는 당신을 위한",
      menuTitle: "건강식 추천 메뉴",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&crop=center",
      buttonText: "건강식 메뉴 보기"
    }
  ];

  // 터치/마우스 이벤트 핸들러
  const handleStart = (clientX) => {
    setIsDragging(true);
    setStartX(clientX);
    setCurrentX(clientX);
    setDragOffset(0);
  };

  const handleMove = (clientX) => {
    if (!isDragging) return;
    
    const deltaX = clientX - startX;
    
    // 드래그 제한
    if (currentPage === 0 && deltaX > 0) return; // 첫 페이지에서 오른쪽으로 드래그 불가
    if (currentPage === pages.length - 1 && deltaX < 0) return; // 마지막 페이지에서 왼쪽으로 드래그 불가
    
    setDragOffset(deltaX);
    setCurrentX(clientX);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    const deltaX = currentX - startX;
    const threshold = 50; // 50px 이상 드래그해야 페이지 전환
    
    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0 && currentPage > 0) {
        // 오른쪽으로 드래그 - 이전 페이지
        setCurrentPage(prev => prev - 1);
      } else if (deltaX < 0 && currentPage < pages.length - 1) {
        // 왼쪽으로 드래그 - 다음 페이지
        setCurrentPage(prev => prev + 1);
      }
    }
    
    setDragOffset(0);
  };

  // 마우스 이벤트
  const handleMouseDown = (e) => {
    e.preventDefault();
    handleStart(e.clientX);
  };

  const handleMouseMove = (e) => {
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  const handleMouseLeave = () => {
    handleEnd();
  };

  // 터치 이벤트
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    handleStart(touch.clientX);
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    handleMove(touch.clientX);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  // 오늘 날짜 표시
  const getTodayDisplay = () => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const date = today.getDate();
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const dayName = dayNames[today.getDay()];
    return `${month}월 ${date}일(${dayName})`;
  };

  // 이번주 vs 지난주 비교 메시지
  const getComparisonMessage = () => {
    const difference = lastWeekSpending - thisWeekSpending;
    if (difference > 0) {
      return `이번주는 지난주보다 약 ₩${difference.toLocaleString()} 덜 썼어요.`;
    } else if (difference < 0) {
      return `이번주는 지난주보다 약 ₩${Math.abs(difference).toLocaleString()} 더 썼어요.`;
    } else {
      return '이번주와 지난주 지출이 비슷해요.';
    }
  };

  return (
    <div className="home-container">
      {/* Top Info Bar */}
      <div className="info-bar">
        <div className="location">반포동</div>
        <div className="balance-info">현재 약 <span className="font-semi-bold" style={{color: '#000'}}>₩{budgetInfo?.remaining_budget?.toLocaleString() || 0}</span> 남음</div>
      </div>

      {/* Promotional Banner */}
      <div className="promo-banner">
        <div className="page-indicator">{currentPage + 1}/{pages.length}</div>
        
        {/* 페이지뷰 컨테이너 */}
        <div 
          className="page-container"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            ref={pageWrapperRef}
            className="page-wrapper"
            style={{
              transform: `translateX(calc(-${currentPage * (100 / pages.length)}% + ${dragOffset}px))`,
              transition: isDragging ? 'none' : 'transform 0.3s ease-out'
            }}
          >
            {pages.map((page, index) => (
              <div 
                key={page.id}
                className="page"
              >
                <div className="page-content">
                  <h2>{page.title}</h2>
                  <p>{page.subtitle}</p>
                  <h3>{page.menuTitle}</h3>
                  <div className="food-image">
                    <img 
                      src={page.image} 
                      alt={page.menuTitle}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <div className="fallback-emoji" style={{ display: 'none' }}>
                      {index === 0 ? '🍣' : index === 1 ? '🍕' : '🥗'}
                    </div>
                  </div>
                  <button className="recommend-btn font-regular">
                    {page.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Today Section */}
      <div className="section">
        <h2 className="home-section-title font-bold">Today</h2>
        <p className="home-section-subtitle font-regular">
          {getComparisonMessage()}
        </p>
        <div className="card">
          <div className="card-header">
            <div className="date-info font-bold">
              <span className="today-label font-bold">오늘</span> {getTodayDisplay()}
            </div>
            <div className="d-day font-bold">
              D-DAY 💵
            </div>
          </div>
          <div className="spending-list">
            {todaySpending.length > 0 ? (
              todaySpending.map((item, index) => (
                <div key={index} className="spending-item">
                  <span className="dot green"></span>
                  <span className="spending-text font-bold">{item.time} - <span className="font-bold spending-text-green">{item.amount.toLocaleString()}원</span></span>
                </div>
              ))
            ) : (
              <div className="spending-item">
                <span className="dot gray"></span>
                <span className="spending-text font-regular">오늘은 아직 지출이 없어요</span>
              </div>
            )}
          </div>
          <div className="card-arrow" onClick={() => navigate('/plan')}>
            <img src={ArrowRightIcon} alt="arrow" />
          </div>
        </div>
      </div>
          
      <div className="section">
        <h2 className="home-section-title font-bold">my wallet</h2>
        <div className="card">
          <div className="wallet-amounts">
            <div className="current-amount font-bold">₩{budgetInfo?.remaining_budget?.toLocaleString() || 0}</div>
            <div className="total-budget font-bold">₩{budgetInfo?.total_budget?.toLocaleString() || 0}</div>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${Math.min(budgetInfo?.budget_percentage || 0, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div style={{height: '100px'}}></div>

      <BottomNavigation activeTab="home" />
    </div>
  );
};

export default Home;
