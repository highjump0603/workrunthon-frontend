import React, { useEffect, useRef } from 'react';

const NaverMap = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    const initMap = () => {
      if (window.naver && window.naver.maps) {
        const map = new window.naver.maps.Map(mapRef.current, {
          center: new window.naver.maps.LatLng(37.5665, 126.9780), // 서울시청
          zoom: 15,
          mapTypeControl: true,
          mapTypeControlOptions: {
            style: window.naver.maps.MapTypeControlStyle.DROPDOWN
          }
        });

        // 마커 추가
        const marker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(37.5665, 126.9780),
          map: map
        });

        // 정보창 추가
        const infoWindow = new window.naver.maps.InfoWindow({
          content: '<div style="padding:10px;text-align:center;min-width:200px;">서울시청</div>'
        });

        // 마커 클릭 시 정보창 표시
        window.naver.maps.Event.addListener(marker, 'click', function() {
          if (infoWindow.getMap()) {
            infoWindow.close();
          } else {
            infoWindow.open(map, marker);
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
  }, []);

  return (
    <div style={{ marginBottom: '30px' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '15px', color: '#03c75a' }}>
        네이버지도
      </h3>
      <div 
        ref={mapRef} 
        style={{ 
          width: '100%', 
          height: '400px',
          border: '2px solid #03c75a',
          borderRadius: '8px'
        }}
      />
    </div>
  );
};

export default NaverMap;
