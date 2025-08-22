import React from 'react';
import { useNavigate } from 'react-router-dom';

import './AddressManagement.css';
import BottomNavigation from '../components/BottomNavigation';
import LeftArrowIcon from '../assets/left_arrow.svg';

const AddressManagement = () => {
  const navigate = useNavigate();



  // 주소 검색 결과
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
      <div className="address-management-header">
        <button className="address-management-back-button" onClick={() => navigate('/mypage')}>
          <img src={LeftArrowIcon} alt="back" className="address-management-back-arrow" />
        </button>
        <h1 className="address-management-title">주소 관리</h1>
      </div>





      {/* 저장된 주소 목록 */}
      <div className="address-management-saved-addresses-section">
        <h2 className="address-management-section-title">저장된 주소</h2>
        <div className="address-management-address-list">
          {addresses.map((address) => (
            <div key={address.id} className="address-management-address-card">
              <div className="address-management-address-header-info">
                <div className="address-management-address-title-row">
                  <h3 className="address-management-address-name">{address.title}</h3>
                  {address.isDefault && (
                    <span className="address-management-default-address-tag">현재 설정된 주소</span>
                  )}
                </div>
                <p className="address-management-address-text">{address.address}</p>
              </div>
              <div className="address-management-address-actions">
                <button 
                  className="address-management-action-button address-management-edit-button"
                  onClick={() => handleEditAddress(address)}
                >
                  편집
                </button>
                <button 
                  className="address-management-action-button address-management-delete-button"
                  onClick={() => handleDeleteAddress(address)}
                >
                  삭제
                </button>
                <button 
                  className="address-management-action-button address-management-default-button"
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
      <div className="address-management-add-address-section">
        <button 
          className="address-management-add-address-button"
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
