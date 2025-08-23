const API_BASE_URL = 'https://wrtigloo.duckdns.org:8000';

export const menuService = {
  // 메뉴 목록 조회
  getMenus: async (params = {}) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      const queryParams = new URLSearchParams();
      
             // 기본 파라미터
       queryParams.append('page', params.page || 1);
       queryParams.append('size', params.size || 100);
       
       // categories 파라미터가 없으면 빈 배열로 설정 (백엔드 validation 오류 방지)
       if (!params.categories || params.categories.length === 0) {
         queryParams.append('categories', '[]');
       }
      
      // 선택적 파라미터들
      if (params.name) queryParams.append('name', params.name);
      if (params.restaurant_id) queryParams.append('restaurant_id', params.restaurant_id);
      if (params.min_cost) queryParams.append('min_cost', params.min_cost);
      if (params.max_cost) queryParams.append('max_cost', params.max_cost);
      if (params.use_budget_filter !== undefined) queryParams.append('use_budget_filter', params.use_budget_filter);
      if (params.use_location_filter !== undefined) queryParams.append('use_location_filter', params.use_location_filter);
      if (params.max_distance) queryParams.append('max_distance', params.max_distance);
      if (params.categories && params.categories.length > 0) {
        params.categories.forEach(category => queryParams.append('categories', category));  
      }

      const response = await fetch(`${API_BASE_URL}/menus/?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('메뉴 조회 API 응답:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          body: errorText
        });
        throw new Error(`메뉴 조회 실패: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('메뉴 조회 에러:', error);
      throw error;
    }
  }
};
