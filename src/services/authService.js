const API_BASE_URL = 'http://15.165.7.141:8000';

export const authService = {
  // 로그인
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      if (!response.ok) {
        throw new Error('로그인에 실패했습니다.');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('로그인 에러:', error);
      throw error;
    }
  },

  // 사용자 정보 가져오기
  async getUserInfo(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('사용자 정보를 가져올 수 없습니다.');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('사용자 정보 가져오기 에러:', error);
      throw error;
    }
  },

  // 로그아웃
  async logout(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        console.warn('로그아웃 API 호출 실패');
      }
    } catch (error) {
      console.error('로그아웃 에러:', error);
    }
  }
};
