import React, { useEffect, useRef } from 'react';

const KakaoMap = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    const initMap = () => {
      if (window.kakao && window.kakao.maps) {
        const options = {
          center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 서울시청
          level: 3
        };

        const map = new window.kakao.maps.Map(mapRef.current, options);

        // 마커 추가
        const markerPosition = new window.kakao.maps.LatLng(37.5665, 126.9780);
        const marker = new window.kakao.maps.Marker({
          position: markerPosition
        });

        marker.setMap(map);

        // 인포윈도우 추가
        const infowindow = new window.kakao.maps.InfoWindow({
          content: '<div style="padding:10px;text-align:center;min-width:200px;">서울시청</div>'
        });

        // 마커 클릭 시 인포윈도우 표시
        window.kakao.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map, marker);
        });

        // 줌 컨트롤 추가
        const zoomControl = new window.kakao.maps.ZoomControl();
        map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);
      }
    };

    // 카카오지도 API 스크립트 로드
    const kakaoAppKey = process.env.REACT_APP_KAKAO_APP_KEY;
    
    if (!kakaoAppKey) {
      console.warn('카카오지도 API 키가 설정되지 않았습니다. .env 파일에 REACT_APP_KAKAO_APP_KEY를 추가해주세요.');
      return;
    }

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoAppKey}&libraries=services`;
    script.onload = initMap;
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div style={{ marginBottom: '30px' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '15px', color: '#FEE500' }}>
        카카오지도
      </h3>
      <div 
        ref={mapRef} 
        style={{ 
          width: '100%', 
          height: '400px',
          border: '2px solid #FEE500',
          borderRadius: '8px'
        }}
      />
    </div>
  );
};

export default KakaoMap;
