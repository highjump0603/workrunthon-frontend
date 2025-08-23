import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Explore.css';
import BottomNavigation from '../components/BottomNavigation';
import { restaurantService } from '../services/restaurantService';

const Explore = () => {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const [viewMode, setViewMode] = useState('list'); // 'map' 또는 'list'
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchName, setSearchName] = useState('');
  const [mapCenter, setMapCenter] = useState({ lat: 37.4966, lng: 126.9577 }); // 숭실대 기본값
  const [map, setMap] = useState(null);

  // 두 지점 간의 거리 계산 (km 단위)
  const calculateDistance = useCallback((lat1, lng1, lat2, lng2) => {
    if (!lat1 || !lng1) return 99999;

    const R = 6371; // 지구 반지름 (단위: km)
    const toRad = (deg) => (deg * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }, []);

  const handleViewToggle = (mode) => {
    setViewMode(mode);
  };

  // 사용자 위치 기반으로 식당 데이터를 한 번에 가져오기
  const fetchRestaurantsWithLocation = async (name = '') => {
    try {
      setIsLoading(true);
      
      // 사용자 위치 정보 가져오기
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.log('토큰이 없어서 기본 위치 기반으로 검색합니다.');
        await fetchRestaurantsFromAPI(mapCenter.lat, mapCenter.lng, name);
        return;
      }

      const userResponse = await fetch('https://wrtigloo.duckdns.org:8000/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        console.log('=== Explore 사용자 정보 조회 결과 ===');
        console.log('사용자 데이터:', userData);
        console.log('사용자 저장된 위도:', userData.latitude);
        console.log('사용자 저장된 경도:', userData.longitude);
        
        const userLat = userData.latitude || mapCenter.lat;
        const userLng = userData.longitude || mapCenter.lng;
        
        console.log('=== Explore 최종 사용할 위치 정보 ===');
        console.log('최종 위도:', userLat);
        console.log('최종 경도:', userLng);
        console.log('기본 위치 사용 여부:', !userData.latitude || !userData.longitude);
        
        // 지도 중심도 업데이트
        setMapCenter({ lat: userLat, lng: userLng });
        
        await fetchRestaurantsFromAPI(userLat, userLng, name);
      } else {
        console.log('사용자 정보 조회 실패, 기본 위치로 검색합니다.');
        await fetchRestaurantsFromAPI(mapCenter.lat, mapCenter.lng, name);
      }
    } catch (error) {
      console.error('사용자 위치 기반 식당 조회 에러:', error);
      await fetchRestaurantsFromAPI(mapCenter.lat, mapCenter.lng, name);
    } finally {
      setIsLoading(false);
    }
  };

  // 위치 기반 식당 API 호출
  const fetchRestaurantsFromAPI = async (latitude, longitude, name = '') => {
    try {
      console.log('=== Explore 위치 정보 ===');
      console.log('전달받은 위도 (latitude):', latitude);
      console.log('전달받은 경도 (longitude):', longitude);
      console.log('검색어:', name || '없음');
      
      const params = {
        page: 1,
        size: 100, // 한 번에 최대 100개 조회
        latitude: latitude,
        longitude: longitude,
        use_location_filter: true,
        max_distance: 10 // 10km 반경
      };

      // 검색어가 있으면 추가
      if (name.trim()) {
        params.name = name.trim();
      }

      console.log('Explore - restaurantService로 전달할 파라미터:', params);
      const data = await restaurantService.getRestaurants(params);
      
      if (data.items && data.items.length > 0) {
        setRestaurants(data.items);
        console.log(`Explore - 위치 기반으로 ${data.items.length}개의 식당을 조회했습니다.`);
      } else {
        setRestaurants([]);
        console.log('Explore - 조회된 식당이 없습니다.');
      }
    } catch (error) {
      console.error('Explore - 식당 API 조회 에러:', error);
      setRestaurants([]);
    }
  };

  // 검색 처리
  const handleSearch = () => {
    fetchRestaurantsWithLocation(searchName);
  };

  // 검색 초기화
  const handleResetSearch = () => {
    setSearchName('');
    fetchRestaurantsWithLocation('');
  };

  // 식당 상세 페이지로 이동
  const handleRestaurantDetail = useCallback((restaurantId) => {
    navigate(`/restaurant-detail/${restaurantId}`);
  }, [navigate]);

  // 커스텀 마커 HTML 생성
  const createCustomMarkerHTML = useCallback((restaurant, centerLat, centerLng) => {
    // 랜덤 평점 (4.0 ~ 5.0)
    const rating = (4.0 + Math.random() * 1.0).toFixed(1);
    // 랜덤 가격 (5,000 ~ 15,000원)
    const price = Math.floor(5000 + Math.random() * 10000);

    // 거리 계산
    const distance = calculateDistance(centerLat, centerLng, restaurant.latitude, restaurant.longitude);
    const distanceText = `${distance.toFixed(1)}km`;

    return `
      <div class="custom-marker" style="
        background: white;
        border: 2px solid #26CA1D;
        border-radius: 12px;
        padding: 8px 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        cursor: pointer;
        min-width: 120px;
        text-align: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      ">
        <div style="
          font-weight: bold;
          font-size: 14px;
          color: #000;
          margin-bottom: 4px;
          line-height: 1.2;
        ">${restaurant.name}</div>
        <div style="
          font-size: 12px;
          color: #666;
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <span style="color: #FFD700;">⭐ ${rating}</span>
          <span style="color: #26CA1D; font-weight: 600;">₩${price.toLocaleString()}</span>
        </div>
        <div style="
          font-size: 10px;
          color: #999;
          margin-top: 4px;
        ">${distanceText}</div>
      </div>
    `;
  }, [calculateDistance]);

  // 모든 식당 마커 표시
  const updateMarkersForCurrentView = useCallback(() => {
    if (!map || !restaurants.length) return;
    
    try {
      // 기존 마커들 제거
      if (window.exploreMarkers) {
        window.exploreMarkers.forEach(marker => {
          if (marker && marker.setMap) {
            marker.setMap(null);
          }
        });
      }
      
      // 마커 배열 초기화
      window.exploreMarkers = [];
      
      // 지도 중심점 가져오기
      const center = map.getCenter();
      const centerLat = center.lat();
      const centerLng = center.lng();
      
      console.log(`Explore - ${restaurants.length}개의 식당 마커를 표시합니다.`);
      
      // 모든 식당에 대해 마커 생성 및 표시
      restaurants.forEach((restaurant) => {
        try {
          if (!restaurant.latitude || !restaurant.longitude) return;

          // 커스텀 마커 HTML 생성
          const markerHTML = createCustomMarkerHTML(restaurant, centerLat, centerLng);

          // 식당의 실제 위치 사용
          const position = new window.naver.maps.LatLng(
            restaurant.latitude,
            restaurant.longitude
          );

          // 표준 Marker 사용하여 HTML 아이콘으로 마커 생성
          const marker = new window.naver.maps.Marker({
            position: position,
            map: map,
            icon: {
              content: markerHTML,
              size: new window.naver.maps.Size(120, 60),
              anchor: new window.naver.maps.Point(60, 30)
            }
          });

          // 마커 배열에 추가
          window.exploreMarkers.push(marker);

          // 마커 클릭 시 식당 상세 페이지로 이동
          window.naver.maps.Event.addListener(marker, 'click', () => {
            console.log(`${restaurant.name} 마커 클릭됨`);
            handleRestaurantDetail(restaurant.id);
          });

        } catch (markerError) {
          console.error(`${restaurant.name} 마커 생성 중 오류:`, markerError);
        }
      });
      
      console.log('Explore 모든 마커 및 이벤트 설정 완료');
    } catch (error) {
      console.error('Explore 마커 업데이트 중 오류 발생:', error);
    }
  }, [map, restaurants, handleRestaurantDetail, createCustomMarkerHTML]);

  const initMap = useCallback(() => {
    try {
      console.log('Explore 네이버 지도 초기화 시작...');
      
      if (!window.naver || !window.naver.maps) {
        console.error('Naver Maps 객체를 찾을 수 없습니다');
        return;
      }

      if (!mapRef.current) {
        console.error('지도 컨테이너를 찾을 수 없습니다');
        return;
      }

      console.log('Explore 네이버 지도 API 로드 완료, 지도 생성 중...');
      
      const naverMap = new window.naver.maps.Map(mapRef.current, {
        center: new window.naver.maps.LatLng(mapCenter.lat, mapCenter.lng),
        zoom: 15,
        mapTypeControl: false,
        scaleControl: false,
        logoControl: false,
        mapDataControl: false,
        zoomControl: true,
        minZoom: 10,
        maxZoom: 20
      });
      
      setMap(naverMap);
      console.log('Explore 지도 생성 완료:', naverMap);

      // 지도가 완전히 로드된 후 마커는 별도 useEffect에서 처리
      window.naver.maps.Event.addListener(naverMap, 'load', () => {
        console.log('Explore 지도 로드 완료');
      });

    } catch (error) {
      console.error('Explore 지도 초기화 중 오류 발생:', error);
    }
  }, [mapCenter]);

  // 컴포넌트 마운트 시 초기 데이터 로드
  useEffect(() => {
    fetchRestaurantsWithLocation('');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 지도 모드 변경 시 지도 초기화
  useEffect(() => {
    if (viewMode === 'map') {
      // 기존 스크립트가 이미 있는지 확인
      const existingScript = document.querySelector('script[src*="openapi.map.naver.com"]');
      
      if (existingScript || window.naver) {
        // 이미 로드되어 있으면 바로 지도 초기화
        initMap();
            } else {
        // 새로 스크립트 로드
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
    }
    
    // 지도 모드가 아닐 때 마커 정리
    if (viewMode !== 'map' && window.exploreMarkers) {
      window.exploreMarkers.forEach(marker => {
        if (marker && marker.setMap) {
          marker.setMap(null);
        }
      });
      delete window.exploreMarkers;
    }
  }, [viewMode, initMap]);

  // 식당 목록이 변경될 때마다 마커 업데이트
  useEffect(() => {
    if (map && restaurants.length > 0 && viewMode === 'map') {
      updateMarkersForCurrentView();
    }
  }, [restaurants, map, viewMode]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="explore-container">
      {/* 헤더 */}
      <div className="explore-header">
        <h1 className="explore-title">탐색</h1>
        
        {/* 검색바 */}
        <div className="search-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="음식, 식당 둘러보기"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="search-input"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="search-button" onClick={handleSearch}>
              검색
            </button>
          </div>
          {searchName && (
            <button className="reset-search-button" onClick={handleResetSearch}>
              초기화
            </button>
          )}
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

          {/* 로딩 상태 */}
          {isLoading && (
            <div className="loading-container">
              <p>식당 정보를 불러오는 중...</p>
            </div>
          )}

          {/* 음식점 목록 */}
          {!isLoading && restaurants.length > 0 && (
          <div className="restaurants-section">
              {restaurants.map((restaurant, index) => {
                // 랜덤 거리 표시 (실제로는 API에서 거리순 정렬됨)
                const randomDistance = (1 + Math.random() * 9).toFixed(1);
                const distanceText = `${randomDistance}km`;
                // 랜덤 가격
                const randomPrice = Math.floor(5000 + Math.random() * 10000);
                const priceText = `${randomPrice.toLocaleString()}원 이내`;
                
                return (
                  <div 
                    key={`${restaurant.id}-${index}`} 
                    className="restaurant-item"
                    onClick={() => handleRestaurantDetail(restaurant.id)}
                    style={{ cursor: 'pointer' }}
                  >
                <div className="restaurant-image">
                      {restaurant.image ? (
                        <img src={restaurant.image} alt={restaurant.name} />
                      ) : (
                        <div className="image-placeholder"></div>
                      )}
                </div>
                <div className="restaurant-info">
                  <div className="restaurant-header">
                    <h3 className="restaurant-name">{restaurant.name}</h3>
                    <span className="star-icon">★</span>
                  </div>
                      <p className="restaurant-price">{priceText}</p>
                      <p className="restaurant-address">{restaurant.address}</p>
                </div>
                <div className="restaurant-distance">
                      {distanceText}
                </div>
              </div>
                );
              })}
            </div>
          )}

          {/* 식당이 없을 때 */}
          {!isLoading && restaurants.length === 0 && (
            <div className="no-restaurants">
              <p>검색 결과가 없습니다.</p>
          </div>
          )}
        </>
      )}

      <div style={{height: '100px'}}></div>
      <BottomNavigation activeTab="explore" />
    </div>
  );
};

export default Explore;