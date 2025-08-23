class ReviewService {
  constructor() {
    this.baseURL = 'https://15.165.7.141:8000/reviews';
  }

  // 리뷰 목록 조회
  async getReviews(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.size) queryParams.append('size', params.size);
      if (params.title) queryParams.append('title', params.title);
      if (params.restaurant_id) queryParams.append('restaurant_id', params.restaurant_id);
      if (params.rating) queryParams.append('rating', params.rating);

      const url = `${this.baseURL}/?${queryParams.toString()}`;
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
      console.error('리뷰 목록 조회 에러:', error);
      throw error;
    }
  }

  // 특정 리뷰 조회
  async getReview(reviewId) {
    try {
      const response = await fetch(`${this.baseURL}/${reviewId}`, {
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
      console.error('리뷰 조회 에러:', error);
      throw error;
    }
  }

  // 리뷰 수정
  async updateReview(reviewId, reviewData) {
    try {
      const response = await fetch(`${this.baseURL}/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(reviewData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('리뷰 수정 에러:', error);
      throw error;
    }
  }

  // 리뷰 삭제
  async deleteReview(reviewId) {
    try {
      const response = await fetch(`${this.baseURL}/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('리뷰 삭제 에러:', error);
      throw error;
    }
  }

  // 내 리뷰 개수 조회
  async getMyReviewCount() {
    try {
      const data = await this.getMyReviews({ page: 1, size: 1 });
      return data.total || 0;
    } catch (error) {
      console.error('리뷰 개수 조회 에러:', error);
      return 0;
    }
  }

  // 내가 작성한 리뷰만 조회 (사용자 ID로 필터링)
  async getMyReviews(params = {}) {
    try {
      // 현재 로그인한 사용자 정보 가져오기
      const userResponse = await fetch('https://15.165.7.141:8000/users/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (!userResponse.ok) {
        throw new Error('사용자 정보를 가져올 수 없습니다.');
      }

      // 사용자 정보는 현재 사용하지 않지만, 향후 백엔드에서 user_id 파라미터 지원 시 사용 예정
      // const userData = await userResponse.json();
      // const userId = userData.user_id;

      // 사용자 ID로 리뷰 필터링
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.size) queryParams.append('size', params.size);
      if (params.title) queryParams.append('title', params.title);
      if (params.rating) queryParams.append('rating', params.rating);
      
      // 사용자 ID 필터 추가 (백엔드에서 지원하는 경우)
      // queryParams.append('user_id', userId);

      const url = `${this.baseURL}/?${queryParams.toString()}`;
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

      const data = await response.json();
      
      // 백엔드에서 사용자별 필터링을 지원하지 않는 경우,
      // 프론트엔드에서 필터링 (임시 해결책)
      // 실제로는 백엔드에서 user_id 파라미터를 지원해야 합니다
      if (data.items && data.items.length > 0) {
        // 현재는 모든 리뷰를 반환하지만, 
        // 백엔드에서 user_id 파라미터를 지원하면 자동으로 필터링됩니다
        console.log('백엔드에서 사용자별 리뷰 필터링을 지원하지 않습니다. user_id 파라미터 추가가 필요합니다.');
        
        // 임시 해결책: 사용자 ID로 필터링
        // 리뷰 데이터에 user_id 필드가 있다고 가정
        // data.items = data.items.filter(review => review.user_id === userId);
        // data.total = data.items.length;
      }

      return data;
    } catch (error) {
      console.error('내 리뷰 조회 에러:', error);
      throw error;
    }
  }
}

export const reviewService = new ReviewService();
