// 카카오 로컬 API를 사용한 지오코딩 서비스
// 주소를 위도/경도로 변환하는 전용 API

const KAKAO_LOCAL_API_URL = 'https://dapi.kakao.com/v2/local/search/address.json';

export const geocodingService = {
  // 주소를 위도/경도로 변환
  async geocodeAddress(address) {
    try {
      if (!address || address.trim() === '') {
        return null;
      }

      console.log('카카오 로컬 API 지오코딩 시작:', address);

      // 카카오 로컬 API 호출
      const params = new URLSearchParams({
        query: address,
        analyze_type: 'similar', // 유사한 주소도 검색
        size: 1 // 첫 번째 결과만 사용
      });

      const response = await fetch(`${KAKAO_LOCAL_API_URL}?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': 'KakaoAK fc58a9b45ec4e8ffe031a4ab70a27832', // REST API 키
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('카카오 로컬 API 응답:', data);

      if (data.documents && data.documents.length > 0) {
        const result = data.documents[0];
        const coordinates = {
          latitude: parseFloat(result.y),
          longitude: parseFloat(result.x),
          address_name: result.address_name,
          address_type: result.address_type,
          confidence: 1.0
        };
        
        console.log('카카오 로컬 API 좌표 변환 성공:', coordinates);
        return coordinates;
      }
      
      console.warn('카카오 로컬 API 지오코딩 결과가 없습니다:', address);
      return this.fallbackGeocoding(address);
    } catch (error) {
      console.error('카카오 로컬 API 지오코딩 에러:', error);
      return this.fallbackGeocoding(address);
    }
  },

  // 대체 지오코딩 방법 (OpenStreetMap 사용)
  async fallbackGeocoding(address) {
    try {
      console.log('대체 지오코딩 방법 사용 (OpenStreetMap):', address);
      
      const params = new URLSearchParams({
        q: address,
        format: 'json',
        limit: 1,
        countrycodes: 'kr'
      });

      const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'WorkRunThon/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        const coordinates = {
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
          address_name: result.display_name,
          confidence: 0.8
        };
        
        console.log('대체 지오코딩 성공:', coordinates);
        return coordinates;
      }
      
      console.warn('대체 지오코딩 결과가 없습니다:', address);
      return null;
    } catch (error) {
      console.error('대체 지오코딩 에러:', error);
      return null;
    }
  },

  // 위도/경도를 주소로 변환 (역지오코딩)
  async reverseGeocode(lat, lon) {
    try {
      console.log('카카오 로컬 API 역지오코딩 시작:', lat, lon);
      
      const params = new URLSearchParams({
        x: lon.toString(),
        y: lat.toString()
      });

      const response = await fetch(`https://dapi.kakao.com/v2/local/geo/coord2address.json?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': 'KakaoAK fc58a9b45ec4e8ffe031a4ab70a27832',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.documents && data.documents.length > 0) {
        const result = data.documents[0];
        return {
          address: result.address.address_name,
          country: '대한민국',
          city: result.address.region_2depth_name || result.address.region_1depth_name,
          street: result.road_address?.road_name || result.address.region_3depth_name
        };
      }
      
      console.warn('카카오 로컬 API 역지오코딩 결과가 없습니다');
      return null;
    } catch (error) {
      console.error('카카오 로컬 API 역지오코딩 에러:', error);
      return null;
    }
  },

  // 주소 유효성 검사
  isValidAddress(address) {
    if (!address || typeof address !== 'string') {
      return false;
    }
    
    // 한국 주소 패턴 (간단한 검증)
    const koreanAddressPattern = /^[가-힣\s\d\-()]+$/;
    return koreanAddressPattern.test(address.trim()) && address.trim().length > 5;
  }
};
