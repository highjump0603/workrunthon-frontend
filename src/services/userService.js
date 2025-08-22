const API_BASE_URL = 'http://15.165.7.141:8000';

export const userService = {
  // 현재 사용자 프로필 조회
  async getCurrentUser() {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('액세스 토큰이 없습니다.');
      }

      const response = await fetch(`${API_BASE_URL}/users/me`, {
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
        throw new Error('사용자를 찾을 수 없습니다.');
      }

      if (!response.ok) {
        throw new Error('사용자 정보 조회에 실패했습니다.');
      }

      return await response.json();
    } catch (error) {
      console.error('사용자 정보 조회 오류:', error);
      throw error;
    }
  },

  // 사용자 정보 수정
  async updateUser(userId, updateData) {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('액세스 토큰이 없습니다.');
      }

      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (response.status === 401) {
        throw new Error('인증이 만료되었습니다.');
      }

      if (response.status === 404) {
        throw new Error('사용자를 찾을 수 없습니다.');
      }

      if (!response.ok) {
        throw new Error('사용자 정보 수정에 실패했습니다.');
      }

      return await response.json();
    } catch (error) {
      console.error('사용자 정보 수정 오류:', error);
      throw error;
    }
  }
};
