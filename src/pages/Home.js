import React, { useState, useEffect } from 'react';
import './Home.css';

const Home = () => {
  const [currentBalance] = useState(150000);
  const [totalBudget] = useState(500000);
  const [todaySpending] = useState([
    { category: 'lunch', amount: 10000, time: '점심' },
    { category: 'dinner', amount: 30500, time: '저녁' }
  ]);

  // 페이지뷰 관련 state
  const [currentPage, setCurrentPage] = useState(0);
  
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

  const spendingProgress = (currentBalance / totalBudget) * 100;

  // 자동 페이지 전환 효과
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % pages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [pages.length]);

  // 수동 페이지 변경
  const goToPage = (index) => {
    setCurrentPage(index);
  };

  return (
    <div className="home-container">
      {/* Top Header Bar */}
      <div className="header-bar">
        <div className="location">반포동</div>
        <div className="balance-info">현재 약 ₩{currentBalance.toLocaleString()} 남음</div>
      </div>

      {/* Promotional Banner */}
      <div className="promo-banner">
        <div className="page-indicator">{currentPage + 1}/{pages.length}</div>
        
        {/* 페이지뷰 컨테이너 */}
        <div className="page-container">
          <div 
            className="page-wrapper"
            style={{
              transform: `translateX(-${currentPage * (100 / pages.length)}%)`,
              transition: 'transform 0.5s ease-in-out'
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
                  <button className="recommend-btn">
                    {page.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 페이지 인디케이터 */}
        <div className="page-indicators">
          {pages.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentPage ? 'active' : ''}`}
              onClick={() => goToPage(index)}
            />
          ))}
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
