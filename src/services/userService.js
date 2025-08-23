const API_BASE_URL = 'https://15.165.7.141:8000';

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

  // 사용자 프로필 수정 (PUT /users/me)
  async updateProfile(updateData) {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('액세스 토큰이 없습니다.');
      }

      console.log('프로필 업데이트 요청 데이터:', updateData);
      console.log('요청 URL:', `${API_BASE_URL}/users/me`);

      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      console.log('프로필 업데이트 응답 상태:', response.status);
      console.log('프로필 업데이트 응답 헤더:', response.headers);

      if (response.status === 401) {
        throw new Error('인증이 만료되었습니다.');
      }

      if (response.status === 500) {
        const errorText = await response.text();
        console.error('서버 500 에러 상세:', errorText);
        throw new Error('서버 오류가 발생했습니다.');
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('프로필 업데이트 실패 응답:', errorText);
        throw new Error('사용자 프로필 수정에 실패했습니다.');
      }

      const result = await response.json();
      console.log('프로필 업데이트 성공 결과:', result);
      return result;
    } catch (error) {
      console.error('사용자 프로필 수정 오류:', error);
      throw error;
    }
  },

  // 사용자 정보 수정 (PUT /users/{user_id})
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
