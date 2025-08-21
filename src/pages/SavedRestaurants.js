import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SavedRestaurants.css';
import BottomNavigation from '../components/BottomNavigation';
import LeftArrowIcon from '../assets/left_arrow.svg';

const SavedRestaurants = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('전체');
  const [selectedSort, setSelectedSort] = useState('최근 저장순');

  const savedRestaurants = [
    {
      id: 1,
      name: '맛있는 돈까스집',
      category: '일식',
      rating: 4.8,
      price: '저렴',
      savedDate: '2024.01.15',
      distance: '0.3km',
      address: '서울시 강남구 테헤란로 123'
    },
    {
      id: 2,
      name: '신선한 해산물집',
      category: '해산물',
      rating: 4.6,
      price: '보통',
      savedDate: '2024.01.10',
      distance: '0.5km',
      address: '서울시 강남구 테헤란로 456'
    },
    {
      id: 3,
      name: '정통 한식당',
      category: '한식',
      rating: 4.9,
      price: '보통',
      savedDate: '2024.01.05',
      distance: '0.8km',
      address: '서울시 강남구 테헤란로 789'
    },
    {
      id: 4,
      name: '이탈리안 파스타',
      category: '양식',
      rating: 4.7,
      price: '고급',
      savedDate: '2023.12.28',
      distance: '1.2km',
      address: '서울시 강남구 테헤란로 101'
    },
    {
      id: 5,
      name: '맛있는 치킨집',
      category: '치킨',
      rating: 4.5,
      price: '저렴',
      savedDate: '2023.12.20',
      distance: '0.6km',
      address: '서울시 강남구 테헤란로 202'
    }
  ];

  const periods = ['전체', '1개월', '3개월', '6개월', '1년'];
  const sortOptions = ['최근 저장순', '평점순', '거리순', '가격순'];

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  const handleSortChange = (sort) => {
    setSelectedSort(sort);
  };

  const handleRestaurantClick = (restaurant) => {
    console.log(`${restaurant.name} 클릭`);
    // 식당 상세 페이지로 이동하는 로직 추가 가능
  };

  const handleRemoveSaved = (restaurant) => {
    console.log(`${restaurant.name} 저장 해제`);
    // 저장 해제 로직 추가 가능
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">☆</span>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
    }

    return stars;
  };

  const getPriceText = (price) => {
    switch (price) {
      case '저렴': return '₩₩';
      case '보통': return '₩₩₩';
      case '고급': return '₩₩₩₩';
      default: return '₩₩';
    }
  };

  return (
    <div className="saved-restaurants-container">
      {/* 헤더 */}
      <div className="saved-restaurants-header">
        <button className="back-button" onClick={() => navigate('/mypage')}>
          <img src={LeftArrowIcon} alt="back" className="back-arrow" />
        </button>
        <h1 className="saved-restaurants-title">저장한 가게</h1>
      </div>

      {/* 검색 및 필터 */}
      <div className="search-filter-section">
        <input
          type="text"
          placeholder="가게명, 메뉴로 검색"
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
        />
        
        <div className="filter-row">
          <div className="filter-group">
            <span className="filter-label">기간</span>
            <div className="filter-buttons">
              {periods.map((period) => (
                <button
                  key={period}
                  className={`filter-button ${selectedPeriod === period ? 'active' : ''}`}
                  onClick={() => handlePeriodChange(period)}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          
          <div className="filter-group">
            <span className="filter-label">정렬</span>
            <div className="filter-buttons">
              {sortOptions.map((sort) => (
                <button
                  key={sort}
                  className={`filter-button ${selectedSort === sort ? 'active' : ''}`}
                  onClick={() => handleSortChange(sort)}
                >
                  {sort}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 저장된 가게 목록 */}
      <div className="saved-restaurants-list">
        {savedRestaurants.map((restaurant) => (
          <div key={restaurant.id} className="restaurant-item">
            <div className="restaurant-info" onClick={() => handleRestaurantClick(restaurant)}>
              <div className="restaurant-header">
                <h3 className="restaurant-name">{restaurant.name}</h3>
                <div className="restaurant-rating">
                  {renderStars(restaurant.rating)}
                  <span className="rating-number">{restaurant.rating}</span>
                </div>
              </div>
              
              <div className="restaurant-details">
                <div className="restaurant-category">{restaurant.category}</div>
                <div className="restaurant-price">{getPriceText(restaurant.price)}</div>
                <div className="restaurant-distance">{restaurant.distance}</div>
              </div>
              
              <div className="restaurant-address">{restaurant.address}</div>
              <div className="saved-date">저장일: {restaurant.savedDate}</div>
            </div>
            
            <div className="restaurant-actions">
              <button 
                className="action-button remove-button"
                onClick={() => handleRemoveSaved(restaurant)}
              >
                저장 해제
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{height: '100px'}}></div>
      <BottomNavigation activeTab="mypage" />
    </div>
  );
};

export default SavedRestaurants;
