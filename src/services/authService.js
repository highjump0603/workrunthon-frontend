const API_BASE_URL = 'https://wrtigloo.duckdns.org:8000';

export const authService = {
  // 로그인
  async login(userId, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify({
          user_id: userId,
          password: password
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

  // 토큰 갱신
  async refreshToken(refreshToken) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify({
          refresh_token: refreshToken
        })
      });

      if (!response.ok) {
        throw new Error('토큰 갱신에 실패했습니다.');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('토큰 갱신 에러:', error);
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
