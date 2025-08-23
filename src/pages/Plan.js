import React, { useState, useEffect, useCallback } from 'react';
import './Plan.css';
import BottomNavigation from '../components/BottomNavigation';
import ArrowRightIcon from '../assets/arrow.svg';

const Plan = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [aiReallocation, setAiReallocation] = useState(true);
  
  // 예산 정보 state 추가
  const [budgetInfo, setBudgetInfo] = useState({
    total_budget: 0,
    remaining_budget: 0,
    budget_percentage: 0
  });
  const [paydayApply, setPaydayApply] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showExpensePopup, setShowExpensePopup] = useState(false);
  const [showLunchPopup, setShowLunchPopup] = useState(false);
  const [showAiRecommendationPopup, setShowAiRecommendationPopup] = useState(false);
  const [aiRecommendationComment, setAiRecommendationComment] = useState('');
  const [aiRecommendationLoading, setAiRecommendationLoading] = useState(false);
  const [expenseIncluded, setExpenseIncluded] = useState(true);

  // 식사 계획 state 추가
  const [mealPlans, setMealPlans] = useState({});
  const [loading, setLoading] = useState(false);





  // 사용자 프로필에서 예산 정보 가져오기
  const fetchBudgetInfo = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const response = await fetch('http://15.165.7.141:8000/users/me', {
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

  // AI 추천 멘트 가져오기
  const fetchAiRecommendation = async () => {
    try {
      setAiRecommendationLoading(true);
      const response = await fetch('http://15.165.7.141:8000/planners/recommand', {
        method: 'GET',
        headers: {
          'accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAiRecommendationComment(data.comment || '');
      }
    } catch (error) {
      console.error('AI 추천 멘트 조회 에러:', error);
      // 에러 시 기본 멘트 설정
      setAiRecommendationComment('비 오는 금요일 밤, 따뜻한 일식으로 마음을 따뜻하게 감싸보세요 ☔');
    } finally {
      setAiRecommendationLoading(false);
    }
  };

  // 월별 식사 계획 조회
  const fetchMealPlans = useCallback(async (year, month) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token) {
        // 토큰이 없을 때 빈 데이터 설정
        setMealPlans({});
        setLoading(false);
        return;
      }

      // YYYY-MM 형식으로 날짜 생성
      const planDate = `${year}-${month.toString().padStart(2, '0')}`;
      
      const response = await fetch(`http://15.165.7.141:8000/planners/?plan_date=${planDate}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        // 날짜별로 식사 계획 정리
        const plansByDate = {};
        if (data.items && Array.isArray(data.items)) {
          data.items.forEach(plan => {
            const dateKey = plan.plan_date;
            if (!plansByDate[dateKey]) {
              plansByDate[dateKey] = [];
            }
            plansByDate[dateKey].push(plan);
          });
        }
        
        setMealPlans(plansByDate);
      } else {
        // API 응답이 실패할 때 빈 데이터 설정
        setMealPlans({});
      }
    } catch (error) {
      console.error('식사 계획 조회 에러:', error);
      // 에러 발생 시에도 빈 데이터 설정
      setMealPlans({});
    } finally {
      setLoading(false);
    }
  }, []);

  // 컴포넌트 마운트 시 예산 정보 가져오기
  useEffect(() => {
    fetchBudgetInfo();
  }, []);

  // 월이나 연도가 변경될 때 식사 계획 다시 조회
  useEffect(() => {
    fetchMealPlans(currentYear, currentMonth);
  }, [currentYear, currentMonth, fetchMealPlans]);

  // 컴포넌트 언마운트 시 body 클래스 정리
  useEffect(() => {
    return () => {
      document.body.classList.remove('popup-open');
    };
  }, []);

  // 지출 합계 포함 토글 핸들러
  const handleExpenseToggle = (checked) => {
    setExpenseIncluded(checked);
    console.log(`지출 합계 포함: ${checked ? '예' : '아니오'}`);
    
    if (checked) {
      console.log('이 지출이 총 지출에 포함됩니다.');
    } else {
      console.log('이 지출이 총 지출에서 제외됩니다.');
    }
  };

  // 월별 데이터
  const months = [
    { value: 1, label: 'Jan' },
    { value: 2, label: 'Feb' },
    { value: 3, label: 'Mar' },
    { value: 4, label: 'Apr' },
    { value: 5, label: 'May' },
    { value: 6, label: 'Jun' },
    { value: 7, label: 'Jul' },
    { value: 8, label: 'Aug' },
    { value: 9, label: 'Sep' },
    { value: 10, label: 'Oct' },
    { value: 11, label: 'Nov' },
    { value: 12, label: 'Dec' }
  ];

  // 연도 데이터
  const years = [2024, 2025, 2026];

  // 달력 데이터 생성
  const getCalendarDays = (year, month) => {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= lastDay || days.length < 42) {
      days.push({
        date: new Date(currentDate),
        isCurrentMonth: currentDate.getMonth() === month - 1,
        isToday: currentDate.toDateString() === new Date().toDateString()
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  const calendarDays = getCalendarDays(currentYear, currentMonth);

  // 특정 날짜의 식사 계획 가져오기
  const getMealPlansForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return mealPlans[dateString] || [];
  };

  // 식사 타입에 따른 색상 반환
  const getMealTypeColor = (type) => {
    switch (type) {
      case '아침':
        return '#FF6B6B'; // 빨간색
      case '점심':
        return '#4ECDC4'; // 연한 초록색
      case '저녁':
        return '#95A5A6'; // 연한 회색
      default:
        return '#95A5A6';
    }
  };

  // 날짜 클릭 핸들러
  const handleDateClick = (day) => {
    const today = new Date();
    const clickedDate = day.date;
    
    // 오늘 날짜는 시간을 고려해서 정확하게 비교
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const clickedDateStart = new Date(clickedDate.getFullYear(), clickedDate.getMonth(), clickedDate.getDate());
    
    if (clickedDateStart < todayStart) {
      // 어제 이전 날짜: 지출 상세 팝업
      setSelectedDate(day);
      setShowExpensePopup(true);
      // body 스크롤 방지
      document.body.classList.add('popup-open');
    } else {
      // 오늘 날짜 포함 미래 날짜: 점심 후보 팝업
      setSelectedDate(day);
      setShowLunchPopup(true);
      // body 스크롤 방지
      document.body.classList.add('popup-open');
    }
  };

  // 팝업 닫기 핸들러
  const closePopups = () => {
    setShowExpensePopup(false);
    setShowLunchPopup(false);
    setShowAiRecommendationPopup(false);
    setSelectedDate(null);
    // body 스크롤 복원
    document.body.classList.remove('popup-open');
  };

  const handleMonthChange = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 1) {
        setCurrentMonth(12);
        setCurrentYear(prev => prev - 1);
      } else {
        setCurrentMonth(prev => prev - 1);
      }
    } else {
      if (currentMonth === 12) {
        setCurrentMonth(1);
        setCurrentYear(prev => prev + 1);
      } else {
        setCurrentMonth(prev => prev + 1);
      }
    }
  };

  return (
    <div className="plan-container">
      {/* 상단 예산 정보 */}
      <div className="budget-section">
        <div className="budget-info">
          <div className="budget-item">
            <div className="budget-label font-bold">이번달 한도</div>
            <div className="budget-amount font-semi-bold">₩{budgetInfo?.total_budget?.toLocaleString() || 0}</div>
          </div>
          <div className="budget-item">
            <div className="budget-label font-bold">남은 예산</div>
            <div className="budget-amount font-semi-bold">₩{budgetInfo?.remaining_budget?.toLocaleString() || 0}</div>
          </div>
        </div>
        <div className="budget-comparison font-regular">
          지난달 보다 <span className="highlight">13만원</span> 여유 있어요
        </div>
      </div>

      {/* 달력 네비게이션 */}
      <div className="calendar-navigation">
        <button 
          className="nav-arrow" 
          onClick={() => handleMonthChange('prev')}
        >
          &lt;
        </button>
        <select 
          value={currentMonth} 
          onChange={(e) => setCurrentMonth(Number(e.target.value))}
          className="month-selector"
        >
          {months.map(month => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
        <select 
          value={currentYear} 
          onChange={(e) => setCurrentYear(Number(e.target.value))}
          className="year-selector"
        >
          {years.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <button 
          className="nav-arrow" 
          onClick={() => handleMonthChange('next')}
        >
          &gt;
        </button>
      </div>

      {/* 달력 */}
      <div className="calendar">
        <div className="calendar-header">
          <div className="day-header">일</div>
          <div className="day-header">월</div>
          <div className="day-header">화</div>
          <div className="day-header">수</div>
          <div className="day-header">목</div>
          <div className="day-header">금</div>
          <div className="day-header">토</div>
        </div>
        <div className="calendar-grid">
          {calendarDays.map((day, index) => {
            const dateMealPlans = getMealPlansForDate(day.date);
            
            return (
              <div 
                key={index} 
                className={`calendar-day ${!day.isCurrentMonth ? 'other-month' : ''} ${
                  day.date.getDay() === 0 ? 'sunday' : 
                  day.date.getDay() === 6 ? 'saturday' : ''
                } ${day.isToday ? 'today' : ''}`}
                onClick={() => handleDateClick(day)}
              >
                <div className="day-number">{day.date.getDate()}</div>
                
                                 {/* 식사 계획 금액 표시 */}
                 {dateMealPlans.length > 0 && (
                   <div className="meal-costs">
                     {dateMealPlans.slice(0, 3).map((plan, planIndex) => (
                       <div 
                         key={planIndex}
                         className="meal-cost-item"
                         style={{ 
                           color: getMealTypeColor(plan.type),
                           fontSize: '8px',
                           fontWeight: 'bold',
                           textAlign: 'center',
                           lineHeight: '1.2'
                         }}
                       >
                         -{plan.cost?.toLocaleString() || 0}
                       </div>
                     ))}
                   </div>
                 )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 로딩 표시 */}
      {loading && (
        <div className="loading-indicator">
          식사 계획을 불러오는 중...
        </div>
      )}

             {/* 설정 토글 */}
       <div className="settings-section">
         <div className="setting-item">
           <span className="setting-label">AI 배치</span>
           <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                           <button 
                className="inquiry-button"
                onClick={async () => {
                  await fetchAiRecommendation();
                  setShowAiRecommendationPopup(true);
                  document.body.classList.add('popup-open');
                }}
                disabled={aiRecommendationLoading}
              >
                {aiRecommendationLoading ? '조회중...' : '조회'}
              </button>
             <label className="toggle-switch">
               <input 
                 type="checkbox" 
                 checked={aiReallocation}
                 onChange={(e) => setAiReallocation(e.target.checked)}
               />
               <span className="toggle-slider"></span>
             </label>
           </div>
         </div>
         <div className="setting-item">
           <span className="setting-label">월급날 가중치 ON</span>
           <label className="toggle-switch">
             <input 
               type="checkbox" 
               checked={paydayApply}
               onChange={(e) => setPaydayApply(e.target.checked)}
             />
             <span className="toggle-slider"></span>
           </label>
         </div>
       </div>

      <div style={{height: '100px'}}></div>

      {/* 지출 상세 팝업 (이전 날짜) */}
      {showExpensePopup && selectedDate && (
        <div className="popup-overlay" onClick={closePopups}>
          <div className="expense-popup" onClick={(e) => e.stopPropagation()}>
            <div className="popup-date">{selectedDate.date.getMonth() + 1}월 {selectedDate.date.getDate()}일 {['일', '월', '화', '수', '목', '금', '토'][selectedDate.date.getDay()]}요일</div>
            <div className="expense-details">
              <div className="expense-info">
                <div className="expense-name">스시야</div>
                <div className="expense-amount">-100,000 원</div>
                                  <img 
                    src={ArrowRightIcon} 
                    alt="arrow" 
                    className="expense-arrow"
                    onClick={() => console.log('가게 상세 페이지로 이동')}
                  />
              </div>
              <div className="expense-category">
                <span className="category-label">항목</span>
                <span className="category-value">오마카세</span>
              </div>
                             <div className="expense-toggle">
                 <span className="toggle-label">지출 합계에 포함</span>
                 <label className="toggle-switch">
                   <input 
                     type="checkbox" 
                     checked={expenseIncluded}
                     onChange={(e) => handleExpenseToggle(e.target.checked)}
                   />
                   <span className="toggle-slider"></span>
                 </label>
               </div>
            </div>
          </div>
        </div>
      )}

             {/* 점심 후보 팝업 (미래 날짜) */}
       {showLunchPopup && selectedDate && (
         <div className="popup-overlay" onClick={closePopups}>
           <div className="lunch-popup" onClick={(e) => e.stopPropagation()}>
             <div className="popup-header">
               <div className="popup-title">{selectedDate.date.getMonth() + 1}월 {selectedDate.date.getDate()}일 점심 후보</div>
               <div className="popup-budget">10,500 원</div>
             </div>
             <div className="lunch-options">
               <div className="lunch-option">
                 <div className="option-info">
                   <div className="restaurant-name">김밥천국</div>
                   <div className="menu-item">떡갈비 김밥</div>
                 </div>
                 <div className="star-icon active">★</div>
               </div>
               <div className="lunch-option">
                 <div className="option-info">
                   <div className="restaurant-name">역전우동</div>
                   <div className="menu-item">우동 + 돈까스</div>
                 </div>
                 <div className="star-icon">★</div>
               </div>
               <div className="lunch-option">
                 <div className="option-info">
                   <div className="restaurant-name">맘스터치</div>
                   <div className="menu-item">싸이버거 세트</div>
                 </div>
                 <div className="star-icon active">★</div>
               </div>
             </div>
             <div className="popup-footer">
               <span className="view-more">후보 더 보기</span>
             </div>
           </div>
         </div>
       )}

               {/* AI 맞춤 추천 팝업 */}
        {showAiRecommendationPopup && (
          <div className="popup-overlay" onClick={closePopups}>
            <div className="ai-recommendation-popup" onClick={(e) => e.stopPropagation()}>
                            <div className="popup-header">
                 <div className="popup-title">AI 맞춤 추천</div>
                 <div className="popup-description">{aiRecommendationComment || '비 오는 금요일 밤, 따뜻한 일식으로 마음을 따뜻하게 감싸보세요 ☔'}</div>
               </div>
              <div className="ai-recommendation-options">
                <div className="ai-recommendation-option">
                  <div className="option-info">
                    <div className="restaurant-name">THE 회</div>
                    <div className="menu-item">회덮밥</div>
                  </div>
                  <div className="option-price">10,500</div>
                  <div className="star-icon active">★</div>
                </div>
                <div className="ai-recommendation-option">
                  <div className="option-info">
                    <div className="restaurant-name">역전우동</div>
                    <div className="menu-item">우동 + 돈까스</div>
                  </div>
                  <div className="option-price">10,500</div>
                  <div className="star-icon">★</div>
                </div>
                <div className="ai-recommendation-option">
                  <div className="option-info">
                    <div className="restaurant-name">스시야</div>
                    <div className="menu-item">모둠 초밥</div>
                  </div>
                  <div className="option-price">10,500</div>
                  <div className="star-icon active">★</div>
                </div>
              </div>
              <div className="popup-footer">
                <span className="view-more">후보 더 보기</span>
              </div>
            </div>
          </div>
        )}

        {/* AI 추천 조회중 로딩 팝업 */}
        {aiRecommendationLoading && (
          <div className="popup-overlay">
            <div className="loading-popup">
              <div className="loading-spinner"></div>
              <div className="loading-text">AI 추천을 조회중입니다...</div>
            </div>
          </div>
        )}

      <BottomNavigation activeTab="plan" />
    </div>
  );
};

export default Plan;
