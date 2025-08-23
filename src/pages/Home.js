import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import ArrowRightIcon from '../assets/arrow.svg';
import BottomNavigation from '../components/BottomNavigation';

const Home = () => {
  const navigate = useNavigate();
  const [todaySpending] = useState([
    { category: 'lunch', amount: 10000, time: '점심' },
    { category: 'dinner', amount: 30500, time: '저녁' }
  ]);

  const [budgetInfo, setBudgetInfo] = useState({
    total_budget: 0,
    remaining_budget: 0,
    budget_percentage: 0
  });

  // 사용자 프로필에서 예산 정보 가져오기
  const fetchBudgetInfo = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const response = await fetch('https://15.165.7.141:8000/users/me', {
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

  // 컴포넌트 마운트 시 예산 정보 가져오기
  useEffect(() => {
    fetchBudgetInfo();
  }, []);

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
          이번주는 지난주보다 약 ₩34,728 덜 썼어요.
        </p>
        <div className="card">
          <div className="card-header">
            <div className="date-info font-bold">
              <span className="today-label font-bold">오늘</span> 8월 20일(수)
            </div>
            <div className="d-day font-bold">
              D-DAY 💵
            </div>
          </div>
          <div className="spending-list">
            {todaySpending.map((item, index) => (
              <div key={index} className="spending-item">
                <span className="dot green"></span>
                <span className="spending-text font-bold">{item.time} - <span className="font-bold spending-text-green">{item.amount.toLocaleString()}원</span></span>
              </div>
            ))}
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
