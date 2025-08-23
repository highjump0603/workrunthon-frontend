import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileEdit.css';
import BottomNavigation from '../components/BottomNavigation';
import LeftArrowIcon from '../assets/left_arrow.svg';
import { userService } from '../services/userService';

const ProfileEdit = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    birthDate: '',
    gender: 'prefer_not_to_say'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [originalData, setOriginalData] = useState(null);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  // 사용자 프로필 정보 가져오기
  const fetchProfileInfo = async () => {
    try {
      setIsLoading(true);
      // 먼저 현재 사용자 정보를 가져와서 user_id를 얻습니다
      const currentUser = await userService.getCurrentUser();
      if (!currentUser || !currentUser.id) {
        throw new Error('사용자 ID를 찾을 수 없습니다.');
      }

      // 현재 사용자 정보를 사용합니다 (이미 getCurrentUser에서 가져온 정보)
      const userData = currentUser;
      
      // API 데이터를 UI 형식으로 변환
      const convertedData = {
        name: userData.name || '',
        email: userData.email || '',
        birthDate: userData.birth_date || '',
        gender: userData.gender || 'prefer_not_to_say'
      };
      
      setProfileData(convertedData);
      setOriginalData(convertedData);
    } catch (error) {
      console.error('프로필 정보 조회 에러:', error);
      // 에러 시 마이페이지로 리다이렉트
      alert('사용자 정보를 불러올 수 없습니다. 마이페이지로 이동합니다.');
      navigate('/mypage');
      return;
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 프로필 정보 가져오기
  useEffect(() => {
    fetchProfileInfo();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    try {
      // 현재 사용자 ID를 가져옵니다
      const currentUser = await userService.getCurrentUser();
      if (!currentUser || !currentUser.id) {
        throw new Error('사용자 ID를 찾을 수 없습니다.');
      }

      // UI 데이터를 API 형식으로 변환
      const updateData = {
        name: profileData.name,
        email: profileData.email,
        birth_date: profileData.birthDate,
        gender: profileData.gender
      };

      // 특정 사용자 ID로 프로필 정보를 업데이트합니다
      await userService.updateUser(currentUser.id, updateData);
      
      alert('회원 정보가 저장되었습니다.');
      setIsEditing(false);
      // 업데이트된 정보를 다시 가져옵니다
      await fetchProfileInfo();
    } catch (error) {
      console.error('프로필 저장 에러:', error);
      alert('회원 정보 저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleCancel = () => {
    // 원래 데이터로 되돌리기
    if (originalData) {
      setProfileData(originalData);
    }
    setIsEditing(false);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      console.log('계정 삭제');
      alert('계정이 삭제되었습니다.');
      navigate('/');
    }
  };

  return (
    <div className="profile-edit-container">
      {/* 헤더 */}
      <div className="profile-edit-header">
        <button className="profile-edit-back-button" onClick={() => navigate('/mypage')}>
          <img src={LeftArrowIcon} alt="back" className="profile-edit-back-arrow" />
        </button>
        <h1 className="profile-edit-title">회원 정보 수정</h1>
      </div>

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="profile-edit-loading">
          <p>프로필 정보를 불러오는 중...</p>
        </div>
      )}

      {/* 프로필 정보 */}
      {!isLoading && (
        <div className="profile-edit-profile-section">
          <h2 className="profile-edit-section-title">기본 정보</h2>
        
        <div className="profile-edit-profile-item">
          <label className="profile-edit-profile-label">이름</label>
          <input
            type="text"
            value={profileData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            disabled={!isEditing}
            className="profile-edit-profile-input"
          />
        </div>

        <div className="profile-edit-profile-item">
          <label className="profile-edit-profile-label">이메일</label>
          <input
            type="email"
            value={profileData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            disabled={!isEditing}
            className="profile-edit-profile-input"
          />
        </div>

        <div className="profile-edit-profile-item">
          <label className="profile-edit-profile-label">생년월일</label>
          <input
            type="date"
            value={profileData.birthDate}
            onChange={(e) => handleInputChange('birthDate', e.target.value)}
            disabled={!isEditing}
            className="profile-edit-profile-input"
          />
        </div>

        <div className="profile-edit-profile-item">
          <label className="profile-edit-profile-label">성별</label>
          <select
            value={profileData.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
            disabled={!isEditing}
            className="profile-edit-profile-select"
          >
            <option value="male">남성</option>
            <option value="female">여성</option>
            <option value="prefer_not_to_say">선택하지 않음</option>
          </select>
        </div>
      </div>
      )}

      {/* 계정 보안 */}
      <div className="profile-edit-security-section">
        <h2 className="profile-edit-section-title">계정 보안</h2>
        
        <div className="profile-edit-security-item">
          <div className="profile-edit-security-info">
            <span className="profile-edit-security-label">비밀번호 변경</span>
          </div>
          <button className="profile-edit-security-button">변경</button>
        </div>
      </div>

      {/* 액션 버튼들 */}
      <div className="profile-edit-action-buttons">
        {!isEditing ? (
          <button className="profile-edit-edit-button" onClick={handleEditToggle}>
            수정하기
          </button>
        ) : (
          <div className="profile-edit-edit-actions">
            <button className="profile-edit-save-button" onClick={handleSave}>
              저장
            </button>
            <button className="profile-edit-cancel-button" onClick={handleCancel}>
              취소
            </button>
          </div>
        )}
      </div>

      {/* 계정 삭제 */}
      <div className="profile-edit-delete-account-section">
        <button className="profile-edit-delete-account-button" onClick={handleDeleteAccount}>
          계정 삭제
        </button>
      </div>

      <div style={{height: '100px'}}></div>
      <BottomNavigation activeTab="mypage" />
    </div>
  );
};

export default ProfileEdit;
