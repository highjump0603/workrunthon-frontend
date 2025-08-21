import React, { useState, useEffect } from 'react';
import './Plan.css';
import BottomNavigation from '../components/BottomNavigation';
import ArrowRightIcon from '../assets/arrow.svg';

const Plan = () => {
  const [currentMonth, setCurrentMonth] = useState(8);
  const [currentYear, setCurrentYear] = useState(2025);
  const [monthlyLimit] = useState(500000);
  const [remainingBudget] = useState(350000);
  const [aiReallocation, setAiReallocation] = useState(true);
  const [paydayApply, setPaydayApply] = useState(true);
  const [weatherMenuRecommendation, setWeatherMenuRecommendation] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showExpensePopup, setShowExpensePopup] = useState(false);
  const [showLunchPopup, setShowLunchPopup] = useState(false);
  const [expenseIncluded, setExpenseIncluded] = useState(true);

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

  // 날짜 클릭 핸들러
  const handleDateClick = (day) => {
    const today = new Date();
    const clickedDate = day.date;
    
    if (clickedDate < today) {
      // 이전 날짜: 지출 상세 팝업
      setSelectedDate(day);
      setShowExpensePopup(true);
      // body 스크롤 방지
      document.body.classList.add('popup-open');
    } else {
      // 미래 날짜: 점심 후보 팝업
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
            <div className="budget-amount font-semi-bold">₩{monthlyLimit.toLocaleString()}</div>
          </div>
          <div className="budget-item">
            <div className="budget-label font-bold">남은 예산</div>
            <div className="budget-amount font-semi-bold">₩{remainingBudget.toLocaleString()}</div>
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
          {calendarDays.map((day, index) => (
            <div 
              key={index} 
              className={`calendar-day ${!day.isCurrentMonth ? 'other-month' : ''} ${
                day.date.getDay() === 0 ? 'sunday' : 
                day.date.getDay() === 6 ? 'saturday' : ''
              } ${day.isToday ? 'today' : ''}`}
              onClick={() => handleDateClick(day)}
            >
              {day.date.getDate()}
            </div>
          ))}
        </div>
      </div>

      {/* 설정 토글 */}
      <div className="settings-section">
        <div className="setting-item">
          <span className="setting-label">AI 다시 배치</span>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={aiReallocation}
              onChange={(e) => setAiReallocation(e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <div className="setting-item">
          <span className="setting-label">월급날 적용</span>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={paydayApply}
              onChange={(e) => setPaydayApply(e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        
        <div className="setting-item">
          <span className="setting-label">비 오는 날 따뜻한 메뉴 추천</span>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={weatherMenuRecommendation}
              onChange={(e) => setWeatherMenuRecommendation(e.target.checked)}
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

      <BottomNavigation activeTab="plan" />
    </div>
  );
};

export default Plan;
