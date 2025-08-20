import React, { useEffect, useRef, useState } from 'react';

const NaverMap = () => {
  const mapRef = useRef(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 현재 위치 가져오기 (고정밀)
  const getCurrentLocation = () => {
    setIsLoading(true);
    setLocationError(null);

    if (navigator.geolocation) {
      // 고정밀 위치 정보 요청
      const options = {
        enableHighAccuracy: true,    // 고정밀 위치 정보
        timeout: 15000,              // 15초 타임아웃
        maximumAge: 0                // 캐시된 위치 정보 사용하지 않음
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          console.log('위치 정보:', { latitude, longitude, accuracy });
          
          setCurrentLocation({ 
            lat: latitude, 
            lng: longitude,
            accuracy: accuracy 
          });
          setLocationError(null);
          setIsLoading(false);
        },
        (error) => {
          console.error('위치 정보 오류:', error);
          let errorMessage = '';
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = '위치 정보 접근이 거부되었습니다. 브라우저 설정을 확인해주세요.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = '위치 정보를 사용할 수 없습니다.';
              break;
            case error.TIMEOUT:
              errorMessage = '위치 정보 요청 시간이 초과되었습니다.';
              break;
            default:
              errorMessage = '위치 정보를 가져올 수 없습니다.';
          }
          
          setLocationError(errorMessage);
          // 기본 위치로 설정 (서울시청)
          setCurrentLocation({ lat: 37.5665, lng: 126.9780, accuracy: null });
          setIsLoading(false);
        },
        options
      );

      // 지속적인 위치 추적 (선택사항)
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          if (accuracy < 100) { // 정확도가 100m 이하일 때만 업데이트
            setCurrentLocation({ 
              lat: latitude, 
              lng: longitude,
              accuracy: accuracy 
            });
          }
        },
        (error) => {
          console.log('위치 추적 오류:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000
        }
      );

      // 컴포넌트 언마운트 시 위치 추적 중지
      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    } else {
      setLocationError('이 브라우저는 위치 정보를 지원하지 않습니다.');
      setCurrentLocation({ lat: 37.5665, lng: 126.9780, accuracy: null });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // 컴포넌트 마운트 시 현재 위치 가져오기
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (!currentLocation) return;

    const initMap = () => {
      if (window.naver && window.naver.maps) {
        const map = new window.naver.maps.Map(mapRef.current, {
          center: new window.naver.maps.LatLng(currentLocation.lat, currentLocation.lng),
          zoom: 16, // 더 상세한 줌 레벨
          mapTypeControl: true,
          mapTypeControlOptions: {
            style: window.naver.maps.MapTypeControlStyle.DROPDOWN
          }
        });

        // 현재 위치 마커 추가 (파란색)
        const currentMarker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(currentLocation.lat, currentLocation.lng),
          map: map,
          icon: {
            content: `
              <div style="
                background: #007bff; 
                border: 3px solid white; 
                border-radius: 50%; 
                width: 24px; 
                height: 24px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.4);
                position: relative;
              ">
                <div style="
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  width: 8px;
                  height: 8px;
                  background: white;
                  border-radius: 50%;
                "></div>
              </div>
            `,
            size: new window.naver.maps.Size(24, 24),
            anchor: new window.naver.maps.Point(12, 12)
          }
        });

        // 현재 위치 정보창
        const currentInfoWindow = new window.naver.maps.InfoWindow({
          content: `
            <div style="padding:15px;text-align:center;min-width:250px;">
              <strong style="color: #007bff;">📍 현재 위치</strong><br><br>
              위도: ${currentLocation.lat.toFixed(6)}<br>
              경도: ${currentLocation.lng.toFixed(6)}<br>
              ${currentLocation.accuracy ? `정확도: ±${Math.round(currentLocation.accuracy)}m` : ''}
            </div>
          `
        });

        // 현재 위치 마커 클릭 시 정보창 표시
        window.naver.maps.Event.addListener(currentMarker, 'click', function() {
          if (currentInfoWindow.getMap()) {
            currentInfoWindow.close();
          } else {
            currentInfoWindow.open(map, currentMarker);
          }
        });

        // 서울시청 마커 추가 (빨간색)
        const seoulMarker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(37.5665, 126.9780),
          map: map,
          icon: {
            content: `
              <div style="
                background: #dc3545; 
                border: 3px solid white; 
                border-radius: 50%; 
                width: 20px; 
                height: 20px;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              "></div>
            `,
            size: new window.naver.maps.Size(20, 20),
            anchor: new window.naver.maps.Point(10, 10)
          }
        });

        // 서울시청 정보창
        const seoulInfoWindow = new window.naver.maps.InfoWindow({
          content: '<div style="padding:10px;text-align:center;min-width:200px;">🏛️ 서울시청</div>'
        });

        // 서울시청 마커 클릭 시 정보창 표시
        window.naver.maps.Event.addListener(seoulMarker, 'click', function() {
          if (seoulInfoWindow.getMap()) {
            seoulInfoWindow.close();
          } else {
            seoulInfoWindow.open(map, seoulMarker);
          }
        });
      }
    };

    // 네이버지도 API 스크립트 로드 (새로운 형식 사용)
    const naverClientId = process.env.REACT_APP_NAVER_CLIENT_ID;
    
    if (!naverClientId) {
      console.warn('네이버지도 API 키가 설정되지 않았습니다. .env 파일에 REACT_APP_NAVER_CLIENT_ID를 추가해주세요.');
      return;
    }

    const script = document.createElement('script');
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${naverClientId}`;
    script.onload = initMap;
    document.head.appendChild(script);

    // 인증 실패 시 처리
    window.navermap_authFailure = function () {
      console.error('네이버지도 API 인증에 실패했습니다. API 키를 확인해주세요.');
    };

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [currentLocation]);

  return (
    <div style={{ marginBottom: '30px' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '15px', color: '#03c75a' }}>
        네이버지도
      </h3>
      
      {/* 현재 위치 버튼 */}
      <div style={{ textAlign: 'center', marginBottom: '15px' }}>
        <button
          onClick={getCurrentLocation}
          disabled={isLoading}
          style={{
            padding: '10px 20px',
            backgroundColor: isLoading ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          {isLoading ? '🔄 위치 확인 중...' : '📍 현재 위치 새로고침'}
        </button>
      </div>

      {/* 위치 정보 표시 */}
      {currentLocation && (
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '15px', 
          padding: '12px',
          backgroundColor: '#e7f3ff',
          borderRadius: '6px',
          fontSize: '13px',
          color: '#0056b3',
          border: '1px solid #b3d9ff'
        }}>
          <strong>📍 현재 위치:</strong><br/>
          위도: {currentLocation.lat.toFixed(6)} | 경도: {currentLocation.lng.toFixed(6)}
          {currentLocation.accuracy && (
            <span style={{ marginLeft: '10px', color: '#28a745' }}>
              (정확도: ±{Math.round(currentLocation.accuracy)}m)
            </span>
          )}
        </div>
      )}

      {/* 오류 메시지 */}
      {locationError && (
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '15px', 
          padding: '12px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '6px',
          fontSize: '13px',
          border: '1px solid #f5c6cb'
        }}>
          ⚠️ {locationError}
        </div>
      )}

      {/* 지도 */}
      <div 
        ref={mapRef} 
        style={{ 
          width: '100%', 
          height: '400px',
          border: '2px solid #03c75a',
          borderRadius: '8px'
        }}
      />

      {/* 마커 설명 */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '10px', 
        fontSize: '12px', 
        color: '#666' 
      }}>
        <span style={{ color: '#007bff' }}>●</span> 현재 위치 | 
        <span style={{ color: '#dc3545' }}>●</span> 서울시청
      </div>
    </div>
  );
};

export default NaverMap;
