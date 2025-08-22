const API_BASE_URL = 'http://15.165.7.141:8000';

export const reviewService = {
  // 리뷰 목록 조회 (페이지네이션 포함)
  async getReviews(params = {}) {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('액세스 토큰이 없습니다.');
      }

      // 쿼리 파라미터 구성
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.size) queryParams.append('size', params.size);
      if (params.title) queryParams.append('title', params.title);
      if (params.restaurant_id) queryParams.append('restaurant_id', params.restaurant_id);
      if (params.rating) queryParams.append('rating', params.rating);

      const response = await fetch(`${API_BASE_URL}/reviews/?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        throw new Error('인증이 만료되었습니다.');
      }

      if (response.status === 404) {
        throw new Error('리뷰를 찾을 수 없습니다.');
      }

      if (!response.ok) {
        throw new Error('리뷰 조회에 실패했습니다.');
      }

      return await response.json();
    } catch (error) {
      console.error('리뷰 조회 오류:', error);
      throw error;
    }
  },

  // 특정 리뷰 조회
  async getReview(reviewId) {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('액세스 토큰이 없습니다.');
      }

      const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        throw new Error('인증이 만료되었습니다.');
      }

      if (response.status === 404) {
        throw new Error('리뷰를 찾을 수 없습니다.');
      }

      if (!response.ok) {
        throw new Error('리뷰 조회에 실패했습니다.');
      }

      return await response.json();
    } catch (error) {
      console.error('리뷰 조회 오류:', error);
      throw error;
    }
  },

  // 내 리뷰 개수 조회 (전체 리뷰 수 반환)
  async getMyReviewCount() {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('액세스 토큰이 없습니다.');
      }

      // 페이지 크기를 1로 설정하여 전체 개수만 가져오기
      const response = await fetch(`${API_BASE_URL}/reviews/?page=1&size=1`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        throw new Error('인증이 만료되었습니다.');
      }

      if (response.status === 404) {
        return 0; // 리뷰가 없는 경우 0 반환
      }

      if (!response.ok) {
        throw new Error('리뷰 개수 조회에 실패했습니다.');
      }

      const data = await response.json();
      return data.total || 0;
    } catch (error) {
      console.error('리뷰 개수 조회 오류:', error);
      return 0; // 오류 발생 시 0 반환
    }
  }
};
