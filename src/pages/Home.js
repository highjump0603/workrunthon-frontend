import React, { useState } from 'react';
import './Home.css';

const Home = () => {
  const [currentBalance] = useState(150000);
  const [totalBudget] = useState(500000);
  const [todaySpending] = useState([
    { category: 'lunch', amount: 10000, time: '점심' },
    { category: 'dinner', amount: 30500, time: '저녁' }
  ]);

  const spendingProgress = (currentBalance / totalBudget) * 100;

  return (
    <div className="home-container">
      {/* Top Header Bar */}
      <div className="header-bar">
        <div className="location">반포동</div>
        <div className="balance-info">현재 약 ₩{currentBalance.toLocaleString()} 남음</div>
      </div>

      {/* Promotional Banner */}
      <div className="promo-banner">
        <div className="page-indicator">1/3</div>
        <div className="promo-content">
          <h2>오늘은 월급날!</h2>
          <p>고생한 <span className="highlight">연우</span> 님께 선보이는</p>
          <h3>오늘의 추천 메뉴</h3>
          <div className="sushi-image">
            🍣
          </div>
          <button className="recommend-btn">
            오늘의 추천 맛집 확인하기
          </button>
        </div>
      </div>

      {/* Today Section */}
      <div className="section">
        <h2 className="section-title">Today</h2>
        <p className="section-subtitle">
          이번주는 지난주보다 약 ₩34,728 덜 썼어요.
        </p>
        <div className="card">
          <div className="card-header">
            <div className="date-info">
              <span className="today-label">오늘</span> 8월 20일(수)
            </div>
            <div className="d-day">
              D-DAY 📅
            </div>
          </div>
          <div className="spending-list">
            {todaySpending.map((item, index) => (
              <div key={index} className="spending-item">
                <span className="dot green"></span>
                <span className="spending-text">{item.time} - {item.amount.toLocaleString()}원</span>
              </div>
            ))}
          </div>
          <div className="card-arrow">→</div>
        </div>
      </div>

      {/* My Wallet Section */}
      <div className="section">
        <h2 className="section-title">my wallet</h2>
        <div className="card">
          <div className="wallet-amounts">
            <div className="current-amount">₩{currentBalance.toLocaleString()}</div>
            <div className="total-budget">₩ {totalBudget.toLocaleString()}</div>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${spendingProgress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
