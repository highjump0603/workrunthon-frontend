import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import './AddressManagement.css';
import BottomNavigation from '../components/BottomNavigation';
import LeftArrowIcon from '../assets/left_arrow.svg';
import AddressSearchPopup from '../components/AddressSearchPopup';
import AddressTypeModal from '../components/AddressTypeModal';
import { userService } from '../services/userService';

const AddressManagement = () => {
  const navigate = useNavigate();
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false);
  const [selectedAddressType, setSelectedAddressType] = useState('home');
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);



  // 주소 목록 상태
  const [addresses, setAddresses] = useState([]);







  // 사용자 정보 로드
  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const userData = await userService.getCurrentUser();
      setUserInfo(userData);
      
      // 주소 목록 구성
      const addressList = [];
      
      if (userData.address) {
        addressList.push({
          id: 'home',
          title: '집',
          address: userData.address,
          type: 'home',
          isDefault: true
        });
      }
      
      if (userData.company_address) {
        addressList.push({
          id: 'company',
          title: '회사',
          address: userData.company_address,
          type: 'company',
          isDefault: false
        });
      }
      
      setAddresses(addressList);
    } catch (error) {
      console.error('사용자 정보 로드 실패:', error);
      setError(error.message);
      setAddresses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAddress = async (address) => {
    try {
      // 주소 편집을 위한 팝업 열기 (구현 필요)
      console.log(`${address.title} 주소 편집`);
    } catch (error) {
      console.error('주소 편집 실패:', error);
      alert('주소 편집에 실패했습니다.');
    }
  };

  const handleDeleteAddress = async (address) => {
    if (!window.confirm(`${address.title} 주소를 삭제하시겠습니까?`)) {
      return;
    }

    try {
      const updateData = {};
      
      if (address.type === 'home') {
        updateData.address = null;
        updateData.latitude = null;
        updateData.longitude = null;
      } else if (address.type === 'company') {
        updateData.company_address = null;
      }

      await userService.updateUser(userInfo.id, updateData);
      
      // 주소 목록에서 제거
      setAddresses(prev => prev.filter(addr => addr.id !== address.id));
      
      alert('주소가 삭제되었습니다.');
    } catch (error) {
      console.error('주소 삭제 실패:', error);
      alert('주소 삭제에 실패했습니다.');
    }
  };

  const handleSetDefault = async (address) => {
    try {
      // 기본 주소 설정 (집 주소를 기본으로 설정)
      if (address.type === 'home') {
        alert('집 주소는 이미 기본 주소입니다.');
        return;
      }

      // 회사 주소를 기본 주소로 설정하려면 기존 집 주소를 회사 주소로 이동
      const updateData = {
        address: address.address,
        company_address: null
      };

      await userService.updateUser(userInfo.id, updateData);
      
      // 주소 목록 업데이트
      setAddresses(prev => prev.map(addr => ({
        ...addr,
        isDefault: addr.id === address.id
      })));
      
      alert('기본 주소가 설정되었습니다.');
    } catch (error) {
      console.error('기본 주소 설정 실패:', error);
      alert('기본 주소 설정에 실패했습니다.');
    }
  };

  const handleOpenAddressTypeSelection = () => {
    // 이미 집과 회사 주소가 모두 있는지 확인
    if (addresses.length >= 2) {
      alert('집과 회사 주소가 모두 설정되어 있습니다. 새 주소를 추가하려면 기존 주소를 삭제해주세요.');
      return;
    }
    setIsTypeModalOpen(true);
  };

  const handleAddressTypeSelect = (addressType) => {
    // 이미 해당 타입의 주소가 있는지 확인
    const existingAddress = addresses.find(addr => addr.type === addressType);
    if (existingAddress) {
      alert(`${existingAddress.title} 주소가 이미 설정되어 있습니다.`);
      return;
    }
    
    setSelectedAddressType(addressType);
    setIsTypeModalOpen(false);
    setIsSearchPopupOpen(true);
  };

  const handleAddressSelect = async (addressData) => {
    try {
      console.log('새 주소 추가:', addressData);
      
      // API를 통해 주소 저장
      const updateData = {};
      
      if (addressData.type === 'home') {
        updateData.address = addressData.address;
      } else if (addressData.type === 'company') {
        updateData.company_address = addressData.address;
      }

      await userService.updateUser(userInfo.id, updateData);
      
      // 새 주소를 주소 목록에 추가
      const newAddress = {
        id: addressData.type,
        title: addressData.type === 'home' ? '집' : '회사',
        address: addressData.address,
        type: addressData.type,
        isDefault: addressData.type === 'home'
      };
      
      setAddresses(prevAddresses => [...prevAddresses, newAddress]);
      console.log('추가된 주소:', newAddress);
      
      alert('주소가 성공적으로 추가되었습니다.');
      setIsSearchPopupOpen(false);
    } catch (error) {
      console.error('주소 추가 실패:', error);
      alert('주소 추가에 실패했습니다.');
    }
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
        
        {isLoading ? (
          <div className="address-management-loading">
            <p>주소 정보를 불러오는 중...</p>
          </div>
        ) : error ? (
          <div className="address-management-error">
            <p>주소 정보를 불러올 수 없습니다: {error}</p>
          </div>
        ) : addresses.length === 0 ? (
          <div className="address-management-empty">
            <p>저장된 주소가 없습니다.</p>
          </div>
        ) : (
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
                  {!address.isDefault && (
                    <button 
                      className="address-management-action-button address-management-default-button"
                      onClick={() => handleSetDefault(address)}
                    >
                      기본 주소로 등록
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 새 주소 추가 버튼 */}
      {!isLoading && addresses.length < 2 && (
        <div className="address-management-add-address-section">
          <button 
            className="address-management-add-address-button"
            onClick={handleOpenAddressTypeSelection}
          >
            새 주소 추가
          </button>
        </div>
      )}

      {/* 주소 타입 선택 모달 */}
      <AddressTypeModal
        isOpen={isTypeModalOpen}
        onClose={() => setIsTypeModalOpen(false)}
        onAddressTypeSelect={handleAddressTypeSelect}
      />

      {/* 주소 검색 팝업 */}
      <AddressSearchPopup
        isOpen={isSearchPopupOpen}
        onClose={() => setIsSearchPopupOpen(false)}
        onAddressSelect={handleAddressSelect}
        addressType={selectedAddressType}
      />

      <div style={{height: '100px'}}></div>
      <BottomNavigation activeTab="mypage" />
    </div>
  );
};

export default AddressManagement;
