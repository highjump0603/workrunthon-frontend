import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './RestaurantDetail.css';
import BottomNavigation from '../components/BottomNavigation';
import LeftArrowIcon from '../assets/left_arrow.svg';
import StarIcon from '../assets/star.svg';

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 주소를 기반으로 위도경도 설정
  const setCoordinatesFromAddress = useCallback(async (address) => {
    if (!address) return;
    
    try {
      // 네이버 지도 API 지오코딩 (클라이언트 사이드에서 직접 호출)
      const response = await fetch(`https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(address)}`, {
        method: 'GET',
        headers: {
          'X-NCP-APIGW-API-KEY-ID': process.env.REACT_APP_NAVER_CLIENT_ID || '',
          'X-NCP-APIGW-API-KEY': process.env.REACT_APP_NAVER_CLIENT_SECRET || ''
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.addresses && data.addresses.length > 0) {
          const coords = data.addresses[0];
          setRestaurant(prev => ({
            ...prev,
            latitude: parseFloat(coords.y),
            longitude: parseFloat(coords.x)
          }));
        }
      }
    } catch (error) {
      console.error('주소 기반 좌표 변환 에러:', error);
      // API 키가 없거나 에러 발생 시 기본값 사용
      setRestaurant(prev => ({
        ...prev,
        latitude: 37.5665, // 서울 시청 기본값
        longitude: 126.9780
      }));
    }
  }, []);

  // 식당 상세 정보 가져오기
  const fetchRestaurantDetail = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`https://wrtigloo.duckdns.org:8000/restaurants/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRestaurant(data);
      } else {
        setError('식당 정보를 불러올 수 없습니다.');
      }
    } catch (error) {
      console.error('식당 상세 정보 조회 에러:', error);
      setError('식당 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  // 컴포넌트 마운트 시 식당 정보 가져오기
  useEffect(() => {
    if (id) {
      fetchRestaurantDetail();
    }
  }, [id, fetchRestaurantDetail]);

  // 식당 정보가 로드되면 주소 기반으로 위도경도 설정
  useEffect(() => {
    const updateCoordinates = async () => {
      if (restaurant && restaurant.address && (!restaurant.latitude || !restaurant.longitude)) {
        const coordinates = await setCoordinatesFromAddress(restaurant.address);
        if (coordinates) {
          setRestaurant(prev => ({
            ...prev,
            latitude: coordinates.latitude,
            longitude: coordinates.longitude
          }));
        }
      }
    };
    
    updateCoordinates();
  }, [restaurant, setCoordinatesFromAddress]);

  // 방문 버튼 클릭 핸들러
  const handleVisit = () => {
    console.log('방문 처리');
    // 방문 로직 구현
  };

  // 저장 버튼 클릭 핸들러
  const handleSave = () => {
    console.log('저장 처리');
    // 저장 로직 구현
  };

  // 플랜에 추가 버튼 클릭 핸들러
  const handleAddToPlan = () => {
    navigate('/plan');
  };

  // 길안내 버튼 클릭 핸들러
  const handleDirections = () => {
    if (restaurant && restaurant.latitude && restaurant.longitude) {
      const url = `https://map.naver.com/?lat=${restaurant.latitude}&lng=${restaurant.longitude}&zoom=15`;
      window.open(url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="restaurant-detail-container">
        <div className="restaurant-detail-loading-container">
          <div className="restaurant-detail-loading-spinner"></div>
          <div className="restaurant-detail-loading-text">식당 정보를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="restaurant-detail-container">
        <div className="restaurant-detail-error-container">
          <div className="restaurant-detail-error-text">{error}</div>
          <button className="restaurant-detail-retry-button" onClick={fetchRestaurantDetail}>
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="restaurant-detail-container">
        <div className="restaurant-detail-error-container">
          <div className="restaurant-detail-error-text">식당을 찾을 수 없습니다.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="restaurant-detail-container">
      {/* 헤더 */}
      <div className="restaurant-detail-header">
        <button className="restaurant-detail-back-button" onClick={() => navigate(-1)}>
          <img src={LeftArrowIcon} alt="back" className="restaurant-detail-back-arrow" />
        </button>
      </div>

      {/* 상단 이미지 영역 */}
      <div className="restaurant-detail-image-section">
        <div className="restaurant-detail-image-placeholder">
          <div className="restaurant-detail-sushi-plate">
            <div className="restaurant-detail-sushi-item red"></div>
            <div className="restaurant-detail-sushi-item orange"></div>
            <div className="restaurant-detail-sushi-item white"></div>
            <div className="restaurant-detail-sushi-item pink"></div>
            <div className="restaurant-detail-sushi-item brown"></div>
            <div className="restaurant-detail-sushi-item green"></div>
            <div className="restaurant-detail-ginger"></div>
          </div>
        </div>
      </div>

      {/* 식당 정보 헤더 영역 */}
      <div className="restaurant-detail-info-header">
        <div className="restaurant-detail-name-section">
          <h1 className="restaurant-detail-name">{restaurant.name}</h1>
          <div className="restaurant-detail-rating">
            <img src={StarIcon} alt="star" className="restaurant-detail-star-icon" />
            <span className="restaurant-detail-rating-score">4.1</span>
          </div>
        </div>
        <div className="restaurant-detail-category">{restaurant.main_category_id === 1 ? '일식' : '기타'}</div>
        <div className="restaurant-detail-meta">
          <span className="restaurant-detail-price">₩34,500</span>
          <span className="restaurant-detail-distance">1.1km</span>
        </div>
        <div className="restaurant-detail-actions">
          <button className="restaurant-detail-action-button restaurant-detail-visit-button" onClick={handleVisit}>
            방문
          </button>
          <button className="restaurant-detail-action-button restaurant-detail-save-button" onClick={handleSave}>
            저장
          </button>
        </div>
      </div>

      {/* 상세 정보 섹션 */}
      <div className="restaurant-detail-detail-section">
        <h2 className="restaurant-detail-section-title">상세 정보</h2>
        <div className="restaurant-detail-detail-item">
          <span className="restaurant-detail-detail-label">주소</span>
          <span className="restaurant-detail-detail-value">{restaurant.address}</span>
        </div>
        <div className="restaurant-detail-detail-item">
          <span className="restaurant-detail-detail-label">영업시간</span>
          <div className="restaurant-detail-detail-value">
            <div>11:30 ~ 14:00</div>
            <div>17:30 ~ 22:00</div>
          </div>
        </div>
        <div className="restaurant-detail-detail-item">
          <span className="restaurant-detail-detail-label">휴무일</span>
          <span className="restaurant-detail-detail-value">일요일 휴무</span>
        </div>
      </div>

      {/* 플랜 추천 섹션 */}
      <div className="restaurant-detail-plan-recommendation-section">
        <h2 className="restaurant-detail-section-title">플랜 추천</h2>
        <div className="restaurant-detail-recommendation-box">
          <div className="restaurant-detail-recommendation-text">
            오늘 월급날이라 비싼 오마카세 먹고싶어
          </div>
        </div>
        <button className="restaurant-detail-add-to-plan-button" onClick={handleAddToPlan}>
          플랜에 추가
        </button>
      </div>

      {/* 네이버 지도 섹션 */}
      <div className="restaurant-detail-map-section">
        <div className="restaurant-detail-map-container">
          <div className="restaurant-detail-map-placeholder">
            <div className="restaurant-detail-map-text">네이버 지도</div>
            <div className="restaurant-detail-map-coordinates">
              위도: {restaurant.latitude}, 경도: {restaurant.longitude}
            </div>
          </div>
        </div>
        <button 
          className="restaurant-detail-directions-button" 
          onClick={handleDirections}
          disabled={!restaurant.latitude || !restaurant.longitude}
        >
          {restaurant.latitude && restaurant.longitude ? '길안내' : '위치 정보 없음'}
        </button>
      </div>

      <div style={{height: '100px'}}></div>
      <BottomNavigation activeTab="plan" />
    </div>
  );
};

export default RestaurantDetail;
