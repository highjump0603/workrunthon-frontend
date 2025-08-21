import React, { useEffect, useRef } from 'react';
import './Explore.css';
import BottomNavigation from '../components/BottomNavigation';

const Explore = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    // 네이버 지도 API 스크립트 로드
    const script = document.createElement('script');
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=qjeimluyjg`;
    script.async = true;
    script.onload = initMap;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const initMap = () => {
    try {
      console.log('지도 초기화 시작...');
      console.log('window.naver:', window.naver);
      console.log('mapRef.current:', mapRef.current);
      
      if (window.naver && mapRef.current) {
        console.log('네이버 지도 API 로드 완료, 지도 생성 중...');
        
        const map = new window.naver.maps.Map(mapRef.current, {
          center: new window.naver.maps.LatLng(37.5665, 126.9780), // 서울시청
          zoom: 15,
          mapTypeControl: true,
          mapTypeControlOptions: {
            style: window.naver.maps.MapTypeControlStyle.DROPDOWN
          }
        });
        
        console.log('지도 생성 완료:', map);

      // 현재 위치 마커 (사용하지 않음 - 향후 기능 확장 시 활용)
      // const currentLocationMarker = new window.naver.maps.Marker({
      //   position: new window.naver.maps.LatLng(37.5665, 126.9780),
      //   map: map,
      //   title: '현재 위치'
      // });

      // 주변 맛집 마커들 (예시)
      const restaurants = [
        { name: '피자헛 강남점', lat: 37.5665, lng: 126.9780, type: '피자' },
        { name: '라멘집', lat: 37.5666, lng: 126.9781, type: '일식' },
        { name: '스테이크하우스', lat: 37.5664, lng: 126.9779, type: '양식' }
      ];

      restaurants.forEach((restaurant, index) => {
        try {
          console.log(`${index + 1}번째 맛집 마커 생성 중:`, restaurant.name);
          
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
                <p style="margin: 0; color: #666;">${restaurant.type}</p>
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
    } else {
      console.error('지도 초기화 실패: window.naver 또는 mapRef.current가 없음');
      console.log('window.naver 존재 여부:', !!window.naver);
      console.log('mapRef.current 존재 여부:', !!mapRef.current);
    }
  } catch (error) {
    console.error('지도 초기화 중 오류 발생:', error);
    console.error('오류 스택:', error.stack);
  }
};

  return (
    <div className="explore-container">
      <div className="explore-header">
        <h1>탐색</h1>
        <p>주변 맛집과 서비스를 발견해보세요</p>
      </div>
      
      <div className="search-section">
        <input 
          type="text" 
          placeholder="검색어를 입력하세요..."
          className="search-input"
        />
        <button className="search-button">검색</button>
      </div>
      
      <div className="category-section">
        <h2>카테고리</h2>
        <div className="category-grid">
          <div className="category-item">
            <div className="category-icon">🍕</div>
            <span>피자</span>
          </div>
          <div className="category-item">
            <div className="category-icon">🍜</div>
            <span>면류</span>
          </div>
          <div className="category-item">
            <div className="category-icon">🍖</div>
            <span>고기</span>
          </div>
          <div className="category-item">
            <div className="category-icon">🍣</div>
            <span>일식</span>
          </div>
          <div className="category-item">
            <div className="category-icon">🍔</div>
            <span>패스트푸드</span>
          </div>
          <div className="category-item">
            <div className="category-icon">☕</div>
            <span>카페</span>
          </div>
        </div>
      </div>
      
      <div className="map-section">
        <h2>지도</h2>
        <div className="map-container">
          <div ref={mapRef} className="naver-map"></div>
        </div>
      </div>
      
      <div className="trending-section">
        <h2>인기 맛집</h2>
        <div className="restaurant-list">
          <div className="restaurant-item">
            <div className="restaurant-image">🍕</div>
            <div className="restaurant-info">
              <h3>피자헛 강남점</h3>
              <p>⭐ 4.5 (리뷰 128개)</p>
              <p>📍 강남구 역삼동</p>
            </div>
          </div>
          <div className="restaurant-item">
            <div className="restaurant-image">🍜</div>
            <div className="restaurant-info">
              <h3>라멘집</h3>
              <p>⭐ 4.3 (리뷰 95개)</p>
              <p>📍 강남구 논현동</p>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation activeTab="explore" />
    </div>
  );
};

export default Explore;
