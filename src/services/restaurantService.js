const API_BASE_URL = 'https://15.165.7.141:8000';

export const restaurantService = {
  // 식당 목록 조회
  async getRestaurants(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.size) queryParams.append('size', params.size);
      if (params.name) queryParams.append('name', params.name);
      if (params.main_category_id) queryParams.append('main_category_id', params.main_category_id);
      if (params.sub_category_id) queryParams.append('sub_category_id', params.sub_category_id);

      const url = `${API_BASE_URL}/restaurants/?${queryParams.toString()}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('식당 목록 조회 에러:', error);
      throw error;
    }
  },

  // 특정 식당 조회
  async getRestaurant(restaurantId) {
    try {
      const response = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('식당 조회 에러:', error);
      throw error;
    }
  }
};
