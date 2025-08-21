import React, { useState, useEffect, useRef } from 'react';
import './Explore.css';
import BottomNavigation from '../components/BottomNavigation';

const Explore = () => {
  const [viewMode, setViewMode] = useState('list'); // 'map' 또는 'list'
  const mapRef = useRef(null);

  // 음식점 데이터
  const restaurants = [
    {
      id: 1,
      name: '안동국밥',
      price: '10000원 이내',
      distance: '1.1km',
      rating: 4.5
    },
    {
      id: 2,
      name: '서울 식당',
      price: '9000원 이내',
      distance: '2.3km',
      rating: 4.2
    },
    {
      id: 3,
      name: '김밥 천국',
      price: '5000원 미만',
      distance: '4.7km',
      rating: 4.0
    },
    {
      id: 4,
      name: '이탈리안 비스트로',
      price: '12000원 이내',
      distance: '5.0km',
      rating: 4.3
    },
    {
      id: 5,
      name: '고기 굽는 하루',
      price: '삼겹살 1인분 13000원',
      distance: '7.2km',
      rating: 4.7
    }
  ];

  const handleViewToggle = (mode) => {
    setViewMode(mode);
  };

  // 네이버 지도 초기화
  useEffect(() => {
    if (viewMode === 'map') {
      const script = document.createElement('script');
      script.src = 'https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=qjeimluyjg';
      script.async = true;
      script.onload = initMap;
      script.onerror = () => {
        console.error('Naver Maps API 로드 실패');
      };
      document.head.appendChild(script);

      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    }
  }, [viewMode]);

  const initMap = () => {
    try {
      console.log('네이버 지도 초기화 시작...');
      
      if (!window.naver || !window.naver.maps) {
        console.error('Naver Maps 객체를 찾을 수 없습니다');
        return;
      }

      if (!mapRef.current) {
        console.error('지도 컨테이너를 찾을 수 없습니다');
        return;
      }

      console.log('네이버 지도 API 로드 완료, 지도 생성 중...');
      
      const map = new window.naver.maps.Map(mapRef.current, {
        center: new window.naver.maps.LatLng(37.5665, 126.9780), // 서울시청
        zoom: 15,
        mapTypeControl: false,
        scaleControl: false,
        logoControl: false,
        mapDataControl: false,
        zoomControl: true,
        minZoom: 10,
        maxZoom: 20
      });
      
      console.log('지도 생성 완료:', map);

      // 음식점 마커들 추가
      const restaurantMarkers = [
        { name: '안동국밥', lat: 37.5665, lng: 126.9780, price: '10000원 이내' },
        { name: '서울 식당', lat: 37.5666, lng: 126.9781, price: '9000원 이내' },
        { name: '김밥 천국', lat: 37.5664, lng: 126.9779, price: '5000원 미만' },
        { name: '이탈리안 비스트로', lat: 37.5667, lng: 126.9782, price: '12000원 이내' },
        { name: '고기 굽는 하루', lat: 37.5663, lng: 126.9778, price: '삼겹살 1인분 13000원' }
      ];

      restaurantMarkers.forEach((restaurant, index) => {
        try {
          console.log(`${index + 1}번째 음식점 마커 생성 중:`, restaurant.name);
          
          const marker = new window.naver.maps.Marker({
            position: new window.naver.maps.LatLng(restaurant.lat, restaurant.lng),
            map: map,
            title: restaurant.name
          });

          console.log(`${restaurant.name} 마커 생성 완료:`, marker);

          // 정보창
          const infoWindow = new window.naver.maps.InfoWindow({
            content: `
              <div style="padding: 10px; min-width: 200px;">
                <h3 style="margin: 0 0 5px 0; font-size: 16px;">${restaurant.name}</h3>
                <p style="margin: 0; color: #666;">${restaurant.price}</p>
                <button onclick="alert('${restaurant.name} 상세정보')" style="margin-top: 10px; padding: 5px 10px; background: #26CA1D; color: white; border: none; border-radius: 5px; cursor: pointer;">상세보기</button>
              </div>
            `
          });

          console.log(`${restaurant.name} 정보창 생성 완료:`, infoWindow);

          // 마커 클릭 시 정보창 표시
          window.naver.maps.Event.addListener(marker, 'click', () => {
            if (infoWindow.getMap()) {
              infoWindow.close();
            } else {
              infoWindow.open(map, marker);
            }
          });

          console.log(`${restaurant.name} 클릭 이벤트 리스너 등록 완료`);
        } catch (markerError) {
          console.error(`${restaurant.name} 마커 생성 중 오류:`, markerError);
        }
      });

      console.log('모든 마커 및 이벤트 설정 완료');
    } catch (error) {
      console.error('지도 초기화 중 오류 발생:', error);
    }
  };

  return (
    <div className="explore-container">
      {/* 헤더 */}
      <div className="explore-header">
        <h1 className="explore-title">탐색</h1>
        
        {/* 검색바 */}
        <div className="search-section">
          <div className="search-bar">
            <span className="search-placeholder">음식, 식당 둘러보기</span>
          </div>
          <button className="filter-btn">필터</button>
        </div>
        
        {/* 뷰 토글 버튼 */}
        <div className="view-toggle">
          <button 
            className={`toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
            onClick={() => handleViewToggle('map')}
          >
            지도
          </button>
          <button 
            className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => handleViewToggle('list')}
          >
            목록
          </button>
        </div>
      </div>

      {/* 지도 또는 목록 표시 */}
      {viewMode === 'map' ? (
        <div className="map-section">
          <div className="map-container" ref={mapRef}></div>
        </div>
      ) : (
        <>
          {/* 추천 배너 */}
          <div className="recommendation-banner">
            <div className="banner-content">
              <p className="banner-text">
                오늘 점심은 <strong>12,000원</strong> 이하의 한식을 먹는 것이 좋겠어요!
              </p>
            </div>
          </div>

          {/* 음식점 목록 */}
          <div className="restaurants-section">
            {restaurants.map((restaurant) => (
              <div key={restaurant.id} className="restaurant-item">
                <div className="restaurant-image">
                  {/* 플레이스홀더 이미지 */}
                </div>
                <div className="restaurant-info">
                  <div className="restaurant-header">
                    <h3 className="restaurant-name">{restaurant.name}</h3>
                    <span className="star-icon">★</span>
                  </div>
                  <p className="restaurant-price">{restaurant.price}</p>
                </div>
                <div className="restaurant-distance">
                  {restaurant.distance}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div style={{height: '100px'}}></div>
      <BottomNavigation activeTab="explore" />
    </div>
  );
};

export default Explore;