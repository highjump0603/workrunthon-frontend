import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileEdit.css';
import BottomNavigation from '../components/BottomNavigation';
import LeftArrowIcon from '../assets/left_arrow.svg';

const ProfileEdit = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: '홍길동',
    email: 'hong@example.com',
    phone: '010-1234-5678',
    birthDate: '1990-01-01',
    gender: '남성'
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    console.log('회원 정보 저장:', profileData);
    alert('회원 정보가 저장되었습니다.');
    setIsEditing(false);
  };

  const handleCancel = () => {
    // 원래 데이터로 되돌리기
    setProfileData({
      name: '홍길동',
      email: 'hong@example.com',
      phone: '010-1234-5678',
      birthDate: '1990-01-01',
      gender: '남성'
    });
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

      {/* 프로필 정보 */}
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
          <label className="profile-edit-profile-label">전화번호</label>
          <input
            type="tel"
            value={profileData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
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
            <option value="남성">남성</option>
            <option value="여성">여성</option>
            <option value="기타">기타</option>
          </select>
        </div>
      </div>

      {/* 계정 보안 */}
      <div className="profile-edit-security-section">
        <h2 className="profile-edit-section-title">계정 보안</h2>
        
        <div className="profile-edit-security-item">
          <div className="profile-edit-security-info">
            <span className="profile-edit-security-label">비밀번호 변경</span>
            <span className="profile-edit-security-description">마지막 변경: 3개월 전</span>
          </div>
          <button className="profile-edit-security-button">변경</button>
        </div>

        <div className="profile-edit-security-item">
          <div className="profile-edit-security-info">
            <span className="profile-edit-security-label">2단계 인증</span>
            <span className="profile-edit-security-description">SMS 인증</span>
          </div>
          <button className="profile-edit-security-button">설정</button>
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
