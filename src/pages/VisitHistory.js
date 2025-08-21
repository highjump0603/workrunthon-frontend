import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './VisitHistory.css';
import BottomNavigation from '../components/BottomNavigation';

const VisitHistory = () => {
  const navigate = useNavigate();
  const [activePeriod, setActivePeriod] = useState('7일');
  const [sortBy] = useState('거리 순');

  const restaurants = [
    {
      id: 1,
      name: '스시야',
      rating: 4.5,
      price: '₩80,000',
      visitDate: '2024.1.17',
      distance: '1.1km'
    },
    {
      id: 2,
      name: '서울 식당',
      rating: 4.5,
      price: '₩9,500',
      visitDate: '2024.1.28',
      distance: '2.3km'
    },
    {
      id: 3,
      name: '더 키친',
      rating: 4.5,
      price: '₩27,000',
      visitDate: '2024.1.07',
      distance: '4.7km'
    },
    {
      id: 4,
      name: '이탈리안 비스트로',
      rating: 4.5,
      price: '₩78,000',
      visitDate: '2024.1.02',
      distance: '5.0km'
    },
    {
      id: 5,
      name: '고기 굽는 하루',
      rating: 4.5,
      price: '₩34,500',
      visitDate: '2024.1.11',
      distance: '7.2km'
    }
  ];

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= rating ? 'filled' : 'empty'}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  const handleRestaurantClick = (restaurant) => {
    console.log(`${restaurant.name} 상세 페이지로 이동`);
    // 식당 상세 페이지로 이동하는 로직 추가 가능
  };

  return (
    <div className="visit-history-container">
      {/* 헤더 */}
      <div className="visit-history-header">
        <button className="back-button" onClick={() => navigate('/mypage')}>
          ←
        </button>
        <h1 className="visit-history-title">방문 내역</h1>
      </div>

      {/* 검색 입력란 */}
      <div className="search-section">
        <input
          type="text"
          placeholder="검색할 가게명을 입력해주세요"
          className="search-input"
        />
      </div>

      {/* 기간 필터 및 정렬 옵션 */}
      <div className="filter-sort-section">
        <div className="period-filter">
          <button 
            className={`period-button ${activePeriod === '7일' ? 'active' : ''}`}
            onClick={() => setActivePeriod('7일')}
          >
            7일
          </button>
          <button 
            className={`period-button ${activePeriod === '1개월' ? 'active' : ''}`}
            onClick={() => setActivePeriod('1개월')}
          >
            1개월
          </button>
          <button 
            className={`period-button ${activePeriod === '6개월' ? 'active' : ''}`}
            onClick={() => setActivePeriod('6개월')}
          >
            6개월
          </button>
        </div>
        <button className="sort-button">
          {sortBy}
        </button>
      </div>

      {/* 식당 목록 */}
      <div className="restaurant-list">
        {restaurants.map((restaurant, index) => (
          <div key={restaurant.id} className="restaurant-item">
            <div className="restaurant-info" onClick={() => handleRestaurantClick(restaurant)}>
              <div className="restaurant-left">
                <div className="restaurant-name">{restaurant.name}</div>
                <div className="restaurant-rating">
                  {renderStars(restaurant.rating)}
                </div>
                <div className="restaurant-price">{restaurant.price}</div>
              </div>
              <div className="restaurant-right">
                <div className="visit-date">{restaurant.visitDate}</div>
                <div className="restaurant-distance">{restaurant.distance}</div>
              </div>
            </div>
            {index < restaurants.length - 1 && <div className="divider"></div>}
          </div>
        ))}
      </div>

      <div style={{height: '100px'}}></div>
      <BottomNavigation activeTab="mypage" />
    </div>
  );
};

export default VisitHistory;
