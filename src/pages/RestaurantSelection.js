import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './RestaurantSelection.css';
import LeftArrowIcon from '../assets/left_arrow.svg';
import { restaurantService } from '../services/restaurantService';

const RestaurantSelection = () => {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchName, setSearchName] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 37.4966, lng: 126.9577 }); // 숭실대 기본값
  const [map, setMap] = useState(null);
  const [sortType, setSortType] = useState('distance'); // 'distance', 'rating', 'list'
  const [displayedRestaurants, setDisplayedRestaurants] = useState([]); // 화면에 표시할 식당 목록

  const pageSize = 100; // API 최대 제한

  // 두 지점 간의 거리 계산 (km 단위)
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
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
  };

  // 식당 목록 정렬
  const sortRestaurants = (restaurantList, sortType, centerLat, centerLng) => {
    if (!restaurantList.length) return restaurantList;

    const sortedList = [...restaurantList];

    switch (sortType) {
      case 'distance':
        // 거리순 정렬 (가까운 순)
        if (centerLat && centerLng) {
          sortedList.sort((a, b) => {
            if (!a.latitude || !a.longitude) return 1;
            if (!b.latitude || !b.longitude) return -1;
            
            const distanceA = calculateDistance(centerLat, centerLng, a.latitude, a.longitude);
            const distanceB = calculateDistance(centerLat, centerLng, b.latitude, b.longitude);
            return distanceA - distanceB;
          });
        }
        break;
      
      case 'rating':
        // 추천순 정렬 (랜덤 평점 기준)
        sortedList.sort((a, b) => {
          const ratingA = 4.0 + Math.random() * 1.0;
          const ratingB = 4.0 + Math.random() * 1.0;
          return ratingB - ratingA; // 높은 평점 순
        });
        break;
      
      case 'list':
      default:
        // 목록 순 (ID 순)
        sortedList.sort((a, b) => a.id - b.id);
        break;
    }

    return sortedList;
  };

  // 정렬 타입 변경 처리
  const handleSortChange = (newSortType) => {
    setSortType(newSortType);
    
    if (map) {
      const center = map.getCenter();
      if (center) {
        const centerLat = center.lat();
        const centerLng = center.lng();
        
        // 지도 중심점으로부터 일정 거리 내의 식당만 필터링
        const maxDistance = 10; // 10km 반경
        const nearbyRestaurants = restaurants.filter(restaurant => {
          if (!restaurant.latitude || !restaurant.longitude) return false;
          
          const distance = calculateDistance(
            centerLat, 
            centerLng, 
            restaurant.latitude, 
            restaurant.longitude
          );
          
          return distance <= maxDistance;
        });
        
        // 필터링된 식당들을 정렬
        const sortedList = sortRestaurants(nearbyRestaurants, newSortType, centerLat, centerLng);
        setDisplayedRestaurants(sortedList);
      }
    }
  };

  // 모든 식당 데이터를 가져오기
  const fetchAllRestaurants = async (name = '') => {
    try {
      setIsLoading(true);
      
      if (name) {
        // 검색 시에는 첫 페이지만 가져오기
        const params = { page: 1, size: pageSize, name };
        const data = await restaurantService.getRestaurants(params);
        setRestaurants(data.items || []);
      } else {
        // 검색이 아닐 때는 모든 페이지를 순차적으로 가져오기
        let allRestaurants = [];
        let currentPage = 1;
        let hasMoreData = true;
        
        while (hasMoreData) {
          const params = { page: currentPage, size: pageSize };
          const data = await restaurantService.getRestaurants(params);
          
          if (data.items && data.items.length > 0) {
            allRestaurants = [...allRestaurants, ...data.items];
            currentPage++;
            
            // 다음 페이지가 있는지 확인
            hasMoreData = data.items.length === pageSize && allRestaurants.length < data.total;
          } else {
            hasMoreData = false;
          }
        }
        
        // 중복된 ID 제거 (마지막에 온 데이터 우선)
        const uniqueRestaurants = [];
        const seenIds = new Set();
        
        for (let i = allRestaurants.length - 1; i >= 0; i--) {
          const restaurant = allRestaurants[i];
          if (!seenIds.has(restaurant.id)) {
            seenIds.add(restaurant.id);
            uniqueRestaurants.unshift(restaurant);
          }
        }
        
        setRestaurants(uniqueRestaurants);
        console.log(`총 ${uniqueRestaurants.length}개의 고유한 식당 데이터를 수집했습니다.`);
        
        // 초기 정렬된 목록 설정
        setDisplayedRestaurants(uniqueRestaurants);
      }
    } catch (error) {
      console.error('식당 목록 조회 에러:', error);
      setRestaurants([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 현재 지도 영역의 식당만 마커로 표시
  const updateMarkersForCurrentView = () => {
    if (!map || !restaurants.length) return;
    
    try {
      // 기존 마커들 제거
      if (window.restaurantMarkers) {
        window.restaurantMarkers.forEach(marker => {
          if (marker && marker.setMap) {
            marker.setMap(null);
          }
        });
      }
      
      // 마커 배열 초기화
      window.restaurantMarkers = [];
      
      // 지도 중심점 가져오기
      const center = map.getCenter();
      const centerLat = center.lat();
      const centerLng = center.lng();
      
      // 지도 중심점으로부터 일정 거리 내의 식당만 필터링 (예: 10km)
      const maxDistance = 10; // 10km 반경
      
      const nearbyRestaurants = restaurants.filter(restaurant => {
        if (!restaurant.latitude || !restaurant.longitude) return false;
        
        const distance = calculateDistance(
          centerLat, 
          centerLng, 
          restaurant.latitude, 
          restaurant.longitude
        );
        
        return distance <= maxDistance;
      });
      
      console.log(`지도 중심점으로부터 ${maxDistance}km 이내에 ${nearbyRestaurants.length}개의 식당이 있습니다.`);
      
      // 현재 정렬 타입에 따라 정렬
      const sortedNearbyRestaurants = sortRestaurants(nearbyRestaurants, sortType, centerLat, centerLng);
      
      // 마커 생성 및 표시
      sortedNearbyRestaurants.forEach((restaurant) => {
        try {
          // 커스텀 마커 HTML 생성 (거리 정보 포함)
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
          window.restaurantMarkers.push(marker);

          // 마커 클릭 시 식당 선택
          window.naver.maps.Event.addListener(marker, 'click', () => {
            console.log(`${restaurant.name} 마커 클릭됨`);
            handleRestaurantSelect(restaurant);
            
            // 선택된 식당이 목록에서 보이도록 스크롤
            const restaurantElement = document.querySelector(`[data-restaurant-id="${restaurant.id}"]`);
            if (restaurantElement) {
              restaurantElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          });

        } catch (markerError) {
          console.error(`${restaurant.name} 마커 생성 중 오류:`, markerError);
        }
      });
      
      console.log('모든 마커 및 이벤트 설정 완료');
    } catch (error) {
      console.error('마커 업데이트 중 오류 발생:', error);
    }
  };

  // 사용자 위치 정보 가져오기
  const fetchUserLocation = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.log('토큰이 없어서 기본 위치(숭실대)를 사용합니다.');
        setMapCenter({ lat: 37.4966, lng: 126.9577 }); // 숭실대 기본값
        return;
      }

      const response = await fetch('https://15.165.7.141:8000/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        if (userData.latitude && userData.longitude) {
          setMapCenter({ lat: userData.latitude, lng: userData.longitude });
          console.log('사용자 위치 정보 로드 완료:', userData.latitude, userData.longitude);
        } else {
          console.log('사용자 위치 정보가 없어서 기본 위치(숭실대)를 사용합니다.');
          setMapCenter({ lat: 37.4966, lng: 126.9577 }); // 숭실대 기본값
        }
      } else {
        console.log('사용자 정보 조회 실패, 기본 위치(숭실대)를 사용합니다.');
        setMapCenter({ lat: 37.4966, lng: 126.9577 }); // 숭실대 기본값
      }
    } catch (error) {
      console.error('사용자 위치 정보 조회 중 오류:', error);
      console.log('오류로 인해 기본 위치(숭실대)를 사용합니다.');
      setMapCenter({ lat: 37.4966, lng: 126.9577 }); // 숭실대 기본값
    }
  };

  // 컴포넌트 마운트 시 식당 목록 가져오기 및 지도 초기화
  useEffect(() => {
    fetchUserLocation();
    
    // 초기 식당 데이터 로드 (지도 없이도)
    fetchAllRestaurants('');
    
    // 전역 함수 등록 (마커 클릭 시 식당 선택용)
    window.selectRestaurant = (restaurantId) => {
      const restaurant = restaurants.find(r => r.id.toString() === restaurantId);
      if (restaurant) {
        handleRestaurantSelect(restaurant);
      }
    };
    
    // 네이버 지도 API 스크립트 로드
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
      // 전역 함수 정리
      delete window.selectRestaurant;
      // 마커 배열 정리
      if (window.restaurantMarkers) {
        window.restaurantMarkers.forEach(marker => {
          if (marker && marker.setMap) {
            marker.setMap(null);
          }
        });
        delete window.restaurantMarkers;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 검색 처리
  const handleSearch = () => {
    // 검색 시에는 모든 식당을 다시 가져와서 필터링
    fetchAllRestaurants(searchName);
    // 검색 결과에 따라 마커 업데이트 (지도가 준비된 경우)
    if (map) {
      updateMarkersForCurrentView();
      
      // 검색 결과도 지도 중심점 기준으로 필터링하여 목록 업데이트
      const center = map.getCenter();
      if (center) {
        const centerLat = center.lat();
        const centerLng = center.lng();
        
        const maxDistance = 10; // 10km 반경
        const nearbyRestaurants = restaurants.filter(restaurant => {
          if (!restaurant.latitude || !restaurant.longitude) return false;
          
          const distance = calculateDistance(
            centerLat, 
            centerLng, 
            restaurant.latitude, 
            restaurant.longitude
          );
          
          return distance <= maxDistance;
        });
        
        const sortedList = sortRestaurants(nearbyRestaurants, sortType, centerLat, centerLng);
        setDisplayedRestaurants(sortedList);
      }
    }
  };

  // 검색 초기화
  const handleResetSearch = () => {
    setSearchName('');
    // 검색어 초기화 시 마커 업데이트 (지도가 준비된 경우)
    if (map) {
      updateMarkersForCurrentView();
      
      // 검색 초기화 시에도 지도 중심점 기준으로 필터링하여 목록 업데이트
      const center = map.getCenter();
      if (center) {
        const centerLat = center.lat();
        const centerLng = center.lng();
        
        const maxDistance = 10; // 10km 반경
        const nearbyRestaurants = restaurants.filter(restaurant => {
          if (!restaurant.latitude || !restaurant.longitude) return false;
          
          const distance = calculateDistance(
            centerLat, 
            centerLng, 
            restaurant.latitude, 
            restaurant.longitude
          );
          
          return distance <= maxDistance;
        });
        
        const sortedList = sortRestaurants(nearbyRestaurants, sortType, centerLat, centerLng);
        setDisplayedRestaurants(sortedList);
      }
    }
  };

  // 식당 선택
  const handleRestaurantSelect = (restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  // 식당 확인 선택
  const handleConfirmSelection = () => {
    if (selectedRestaurant) {
      // 내역추가 페이지로 돌아가면서 선택된 식당 정보 전달
      navigate('/add-details', { 
        state: { 
          selectedRestaurant: selectedRestaurant,
          fromRestaurantSelection: true 
        } 
      });
    }
  };

  // 네이버 지도 초기화
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
      console.log('지도 생성 완료:', naverMap);

      // 지도가 완전히 로드된 후 이벤트 리스너 추가
      window.naver.maps.Event.addListener(naverMap, 'load', () => {
        console.log('지도 로드 완료, 이벤트 리스너 추가 중...');
        
        // 지도 이벤트 리스너 추가
        window.naver.maps.Event.addListener(naverMap, 'idle', updateMarkersForCurrentView);
        window.naver.maps.Event.addListener(naverMap, 'zoom_changed', updateMarkersForCurrentView);
        window.naver.maps.Event.addListener(naverMap, 'dragend', updateMarkersForCurrentView);
        
        // 초기 식당 목록 로드
        const bounds = naverMap.getBounds();
        if (bounds) {
          updateMarkersForCurrentView(); // 초기 로드 시 마커 업데이트
        }
      });

    } catch (error) {
      console.error('지도 초기화 중 오류 발생:', error);
    }
  };

  // 커스텀 마커 HTML 생성
  const createCustomMarkerHTML = (restaurant, centerLat, centerLng) => {
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
  };

  // 식당 목록이 변경될 때마다 마커 업데이트
  useEffect(() => {
    if (map && restaurants.length > 0) {
      // 지도가 완전히 로드된 후에만 마커 업데이트
      const center = map.getCenter();
      if (center) {
        const centerLat = center.lat();
        const centerLng = center.lng();
        
        // 지도 중심점으로부터 일정 거리 내의 식당만 필터링
        const maxDistance = 10; // 10km 반경
        const nearbyRestaurants = restaurants.filter(restaurant => {
          if (!restaurant.latitude || !restaurant.longitude) return false;
          
          const distance = calculateDistance(
            centerLat, 
            centerLng, 
            restaurant.latitude, 
            restaurant.longitude
          );
          
          return distance <= maxDistance;
        });
        
        // 필터링된 식당들을 정렬
        const sortedList = sortRestaurants(nearbyRestaurants, sortType, centerLat, centerLng);
        setDisplayedRestaurants(sortedList);
        updateMarkersForCurrentView();
      }
    }
  }, [restaurants, map, sortType]); // eslint-disable-line react-hooks/exhaustive-deps

  // 지도 렌더링
  const renderMap = () => {
    return (
      <div className="map-container" ref={mapRef}></div>
    );
  };

  return (
    <div className="restaurant-selection-container">
      {/* 헤더 */}
      <div className="restaurant-selection-header">
        <button className="back-button" onClick={() => navigate('/add-details')}>
          <img src={LeftArrowIcon} alt="back" className="back-arrow" />
        </button>
        <h1 className="restaurant-selection-title">가계부</h1>
      </div>

      {/* 검색 바 */}
      <div className="search-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="내가 방문한 식당 검색하기"
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

      {/* 지도 섹션 */}
      <div className="map-section">
        {renderMap()}
      </div>

      {/* 주변 음식점 섹션 */}
      <div className="nearby-restaurants-section">
        <div className="section-header">
          <h2 className="section-title">주변 음식점</h2>
          <div className="sort-options">
            <span 
              className={`sort-option ${sortType === 'rating' ? 'active' : ''}`}
              onClick={() => handleSortChange('rating')}
            >
              추천순
            </span>
            <span 
              className={`sort-option ${sortType === 'distance' ? 'active' : ''}`}
              onClick={() => handleSortChange('distance')}
            >
              거리순
            </span>
            <span 
              className={`sort-option ${sortType === 'list' ? 'active' : ''}`}
              onClick={() => handleSortChange('list')}
            >
              목록
            </span>
          </div>
        </div>

        {/* 로딩 상태 */}
        {isLoading && (
          <div className="loading-container">
            <p>식당 정보를 불러오는 중...</p>
          </div>
        )}

        {/* 식당 목록 */}
        {!isLoading && displayedRestaurants.length > 0 && (
          <div className="restaurant-list">
            {displayedRestaurants.map((restaurant, index) => {
              // 지도가 준비된 경우 거리 계산
              let distanceText = '거리 정보 없음';
              if (map) {
                const center = map.getCenter();
                if (center && restaurant.latitude && restaurant.longitude) {
                  const distance = calculateDistance(
                    center.lat(), 
                    center.lng(), 
                    restaurant.latitude, 
                    restaurant.longitude
                  );
                  distanceText = `${distance.toFixed(1)}km`;
                }
              }
              
              return (
                <div
                  key={`${restaurant.id}-${index}`}
                  className={`restaurant-item ${selectedRestaurant?.id === restaurant.id ? 'selected' : ''}`}
                  onClick={() => handleRestaurantSelect(restaurant)}
                  data-restaurant-id={restaurant.id}
                >
                  <div className="restaurant-image">
                    <div className="image-placeholder"></div>
                  </div>
                  <div className="restaurant-info">
                    <div className="restaurant-name">{restaurant.name}</div>
                    <div className="restaurant-rating">
                      <span className="star-icon">⭐</span>
                    </div>
                    <div className="restaurant-price">10000원 이내</div>
                    <div className="restaurant-distance">{distanceText}</div>
                  </div>
                  {selectedRestaurant?.id === restaurant.id && (
                    <div className="selection-indicator">✓</div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* 식당이 없을 때 */}
        {!isLoading && displayedRestaurants.length === 0 && (
          <div className="no-restaurants">
            <p>검색 결과가 없습니다.</p>
          </div>
        )}

        
      </div>

      {/* 선택된 식당 정보 */}
      {selectedRestaurant && (
        <div className="selected-restaurant-info">
          <h3>선택된 식당</h3>
          <p><strong>이름:</strong> {selectedRestaurant.name}</p>
          <p><strong>주소:</strong> {selectedRestaurant.address}</p>
          <p><strong>전화번호:</strong> {selectedRestaurant.contract || '정보 없음'}</p>
          <button className="confirm-selection-button" onClick={handleConfirmSelection}>
            이 식당으로 선택
          </button>
        </div>
      )}
    </div>
  );
};

export default RestaurantSelection;
