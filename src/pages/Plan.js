import React, { useState } from 'react';
import './Plan.css';
import BottomNavigation from '../components/BottomNavigation';

const Plan = () => {
  const [currentMonth, setCurrentMonth] = useState(8);
  const [currentYear, setCurrentYear] = useState(2025);
  const [monthlyLimit] = useState(500000);
  const [remainingBudget] = useState(350000);
  const [aiReallocation, setAiReallocation] = useState(true);
  const [paydayApply, setPaydayApply] = useState(true);

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
      </div>

      <div style={{height: '100px'}}></div>

      <BottomNavigation activeTab="plan" />
    </div>
  );
};

export default Plan;
