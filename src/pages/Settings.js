import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Settings.css';
import BottomNavigation from '../components/BottomNavigation';
import LeftArrowIcon from '../assets/left_arrow.svg';

const Settings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: false,
    locationServices: true,
    darkMode: false,
    autoSave: true,
    dataSync: true
  });

  const handleToggleChange = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleLanguageChange = (language) => {
    console.log('언어 변경:', language);
    // 언어 변경 로직 추가 가능
  };

  const handlePrivacyPolicy = () => {
    console.log('개인정보처리방침');
    // 개인정보처리방침 페이지로 이동하는 로직 추가 가능
  };

  const handleTermsOfService = () => {
    console.log('이용약관');
    // 이용약관 페이지로 이동하는 로직 추가 가능
  };

  const handleAboutApp = () => {
    console.log('앱 정보');
    // 앱 정보 페이지로 이동하는 로직 추가 가능
  };

  const handleLogout = () => {
    if (window.confirm('정말로 로그아웃하시겠습니까?')) {
      console.log('로그아웃');
      alert('로그아웃되었습니다.');
      navigate('/');
    }
  };

  return (
    <div className="settings-container">
      {/* 헤더 */}
      <div className="settings-header">
        <button className="back-button" onClick={() => navigate('/mypage')}>
          <img src={LeftArrowIcon} alt="back" className="back-arrow" />
        </button>
        <h1 className="settings-title">설정</h1>
      </div>

      {/* 알림 설정 */}
      <div className="settings-section">
        <h2 className="section-title">알림 설정</h2>
        
        <div className="setting-item">
          <div className="setting-info">
            <span className="setting-label">푸시 알림</span>
            <span className="setting-description">새로운 메시지 및 업데이트 알림</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.pushNotifications}
              onChange={() => handleToggleChange('pushNotifications')}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <span className="setting-label">이메일 알림</span>
            <span className="setting-description">주요 업데이트를 이메일로 받기</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={() => handleToggleChange('emailNotifications')}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      {/* 앱 설정 */}
      <div className="settings-section">
        <h2 className="section-title">앱 설정</h2>
        
        <div className="setting-item">
          <div className="setting-info">
            <span className="setting-label">위치 서비스</span>
            <span className="setting-description">근처 식당 검색을 위한 위치 정보 사용</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.locationServices}
              onChange={() => handleToggleChange('locationServices')}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <span className="setting-label">다크 모드</span>
            <span className="setting-description">어두운 테마로 앱 사용</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.darkMode}
              onChange={() => handleToggleChange('darkMode')}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <span className="setting-label">자동 저장</span>
            <span className="setting-description">입력한 정보를 자동으로 저장</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.autoSave}
              onChange={() => handleToggleChange('autoSave')}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <span className="setting-label">데이터 동기화</span>
            <span className="setting-description">여러 기기 간 데이터 동기화</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.dataSync}
              onChange={() => handleToggleChange('dataSync')}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      {/* 언어 설정 */}
      <div className="settings-section">
        <h2 className="section-title">언어 설정</h2>
        
        <div className="setting-item">
          <div className="setting-info">
            <span className="setting-label">앱 언어</span>
            <span className="setting-description">한국어</span>
          </div>
          <button className="setting-button" onClick={() => handleLanguageChange('한국어')}>
            변경
          </button>
        </div>
      </div>

      {/* 정보 및 지원 */}
      <div className="settings-section">
        <h2 className="section-title">정보 및 지원</h2>
        
        <div className="setting-item clickable" onClick={handlePrivacyPolicy}>
          <div className="setting-info">
            <span className="setting-label">개인정보처리방침</span>
          </div>
          <span className="arrow">→</span>
        </div>

        <div className="setting-item clickable" onClick={handleTermsOfService}>
          <div className="setting-info">
            <span className="setting-label">이용약관</span>
          </div>
          <span className="arrow">→</span>
        </div>

        <div className="setting-item clickable" onClick={handleAboutApp}>
          <div className="setting-info">
            <span className="setting-label">앱 정보</span>
            <span className="setting-description">버전 1.0.0</span>
          </div>
          <span className="arrow">→</span>
        </div>
      </div>

      {/* 계정 관리 */}
      <div className="settings-section">
        <h2 className="section-title">계정 관리</h2>
        
        <div className="setting-item">
          <div className="setting-info">
            <span className="setting-label">로그아웃</span>
            <span className="setting-description">현재 계정에서 로그아웃</span>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </div>

      <div style={{height: '100px'}}></div>
      <BottomNavigation activeTab="mypage" />
    </div>
  );
};

export default Settings;
