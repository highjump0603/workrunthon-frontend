// 네이버 지도 API 설정
// 실제 사용 시에는 네이버 클라우드 플랫폼에서 발급받은 클라이언트 ID를 사용하세요
export const NAVER_MAP_CONFIG = {
  // 개발용 임시 키 (실제 사용 시 교체 필요)
  CLIENT_ID: 'YOUR_NAVER_CLIENT_ID',
  
  // API 엔드포인트
  MAP_API_URL: 'https://openapi.map.naver.com/openapi/v3/maps.js',
  
  // 기본 설정
  DEFAULT_CENTER: {
    lat: 37.5665,  // 서울시청 위도
    lng: 126.9780  // 서울시청 경도
  },
  
  // 기본 줌 레벨
  DEFAULT_ZOOM: 15,
  
  // 지도 컨트롤 설정 (기본값)
  MAP_CONTROLS: {
    mapTypeControl: false,
    scaleControl: false,
    logoControl: false,
    mapDataControl: false,
    zoomControl: true
  }
};

// 네이버 지도 API 스크립트 로드 함수
export const loadNaverMapAPI = () => {
  return new Promise((resolve, reject) => {
    // 이미 로드된 경우
    if (window.naver && window.naver.maps) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `${NAVER_MAP_CONFIG.MAP_API_URL}?ncpClientId=${NAVER_MAP_CONFIG.CLIENT_ID}&submodules=geocoder`;
    script.async = true;
    
    script.onload = () => {
      resolve();
    };
    
    script.onerror = () => {
      reject(new Error('네이버 지도 API 로드에 실패했습니다.'));
    };

    document.head.appendChild(script);
  });
};
