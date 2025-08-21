import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RecentlyViewed.css';
import BottomNavigation from '../components/BottomNavigation';

const RecentlyViewed = () => {
  const navigate = useNavigate();
  const [activePeriod, setActivePeriod] = useState('7일');
  const [sortBy] = useState('최근 저장 순');

  const restaurants = [
    {
      id: 1,
      name: '스시야',
      cuisine: '일식',
      rating: 4.4,
      distance: '1.2km'
    },
    {
      id: 2,
      name: '이탈리안 비스트로',
      cuisine: '양식',
      rating: 4.3,
      distance: '17km'
    },
    {
      id: 3,
      name: '고기 굽는 하루',
      cuisine: '육류, 고기요리',
      rating: 4.1,
      distance: '23km'
    }
  ];

  const handleMapClick = (restaurant) => {
    console.log(`${restaurant.name} 지도 보기`);
    // 지도 페이지로 이동하는 로직 추가 가능
  };

  const handleSaveClick = (restaurant) => {
    console.log(`${restaurant.name} 저장`);
    // 저장 로직 추가 가능
  };

  const handleRestaurantClick = (restaurant) => {
    console.log(`${restaurant.name} 상세 페이지로 이동`);
    // 식당 상세 페이지로 이동하는 로직 추가 가능
  };

  return (
    <div className="recently-viewed-container">
      {/* 헤더 */}
      <div className="recently-viewed-header">
        <button className="back-button" onClick={() => navigate('/mypage')}>
          ←
        </button>
        <h1 className="recently-viewed-title">최근 본 식당</h1>
      </div>

      {/* 필터 및 정렬 옵션 */}
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
        </div>
        <button className="sort-button">
          {sortBy}
        </button>
      </div>

      {/* 식당 목록 */}
      <div className="restaurant-list">
        {restaurants.map((restaurant) => (
          <div key={restaurant.id} className="restaurant-item">
            <div className="restaurant-info" onClick={() => handleRestaurantClick(restaurant)}>
              <div className="restaurant-name-cuisine">
                <div className="restaurant-name">{restaurant.name}</div>
                <div className="restaurant-cuisine">{restaurant.cuisine}</div>
              </div>
              <div className="restaurant-rating-distance">
                <div className="restaurant-rating">
                  <span className="star">★</span>
                  {restaurant.rating}
                </div>
                <div className="restaurant-distance">{restaurant.distance}</div>
              </div>
            </div>
            
            <div className="restaurant-actions">
              <button 
                className="map-button"
                onClick={() => handleMapClick(restaurant)}
              >
                지도
              </button>
              <button 
                className="save-button"
                onClick={() => handleSaveClick(restaurant)}
              >
                저장
              </button>
            </div>
            
            <div className="restaurant-arrow">→</div>
          </div>
        ))}
      </div>

      <div style={{height: '100px'}}></div>
      <BottomNavigation activeTab="mypage" />
    </div>
  );
};

export default RecentlyViewed;
