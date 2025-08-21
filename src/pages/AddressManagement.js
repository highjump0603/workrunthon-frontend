import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddressManagement.css';
import BottomNavigation from '../components/BottomNavigation';
import LeftArrowIcon from '../assets/left_arrow.svg';

const AddressManagement = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const addresses = [
    {
      id: 1,
      title: '집',
      address: '서울시 강남구 테헤란로 123 101동 1001호',
      isDefault: true
    },
    {
      id: 2,
      title: '회사',
      address: '서울시 강남구 테헤란로 123 101동 1001호',
      isDefault: false
    }
  ];

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCurrentLocation = () => {
    console.log('현재 위치로 찾기');
    // 현재 위치 찾기 로직 추가 가능
  };

  const handleEditAddress = (address) => {
    console.log(`${address.title} 주소 편집`);
    // 주소 편집 페이지로 이동하는 로직 추가 가능
  };

  const handleDeleteAddress = (address) => {
    console.log(`${address.title} 주소 삭제`);
    // 주소 삭제 로직 추가 가능
  };

  const handleSetDefault = (address) => {
    console.log(`${address.title} 기본 주소로 등록`);
    // 기본 주소 설정 로직 추가 가능
  };

  const handleAddNewAddress = () => {
    console.log('새 주소 추가');
    // 새 주소 추가 페이지로 이동하는 로직 추가 가능
  };

  return (
    <div className="address-management-container">
      {/* 헤더 */}
      <div className="address-header">
        <button className="back-button" onClick={() => navigate('/mypage')}>
          <img src={LeftArrowIcon} alt="back" className="back-arrow" />
        </button>
        <h1 className="address-title">주소 관리</h1>
      </div>

      {/* 주소 검색 및 현재 위치 찾기 */}
      <div className="search-location-section">
        <input
          type="text"
          placeholder="지번, 도로명, 건물명으로 검색"
          value={searchQuery}
          onChange={handleSearch}
          className="address-search-input"
        />
        <button 
          className="current-location-button"
          onClick={handleCurrentLocation}
        >
          현재 위치로 찾기
        </button>
      </div>

      {/* 저장된 주소 목록 */}
      <div className="saved-addresses-section">
        <h2 className="section-title">저장된 주소</h2>
        <div className="address-list">
          {addresses.map((address) => (
            <div key={address.id} className="address-card">
              <div className="address-header-info">
                <div className="address-title-row">
                  <h3 className="address-name">{address.title}</h3>
                  {address.isDefault && (
                    <span className="default-address-tag">현재 설정된 주소</span>
                  )}
                </div>
                <p className="address-text">{address.address}</p>
              </div>
              <div className="address-actions">
                <button 
                  className="action-button edit-button"
                  onClick={() => handleEditAddress(address)}
                >
                  편집
                </button>
                <button 
                  className="action-button delete-button"
                  onClick={() => handleDeleteAddress(address)}
                >
                  삭제
                </button>
                <button 
                  className="action-button default-button"
                  onClick={() => handleSetDefault(address)}
                >
                  기본 주소로 등록
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 새 주소 추가 버튼 */}
      <div className="add-address-section">
        <button 
          className="add-address-button"
          onClick={handleAddNewAddress}
        >
          새 주소 추가
        </button>
      </div>

      <div style={{height: '100px'}}></div>
      <BottomNavigation activeTab="mypage" />
    </div>
  );
};

export default AddressManagement;
