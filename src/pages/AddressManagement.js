import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import './AddressManagement.css';
import BottomNavigation from '../components/BottomNavigation';
import LeftArrowIcon from '../assets/left_arrow.svg';
import AddressSearchPopup from '../components/AddressSearchPopup';
import AddressTypeModal from '../components/AddressTypeModal';
import { userService } from '../services/userService';
import { geocodingService } from '../services/geocodingService';

const AddressManagement = () => {
  const navigate = useNavigate();
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false);
  const [selectedAddressType, setSelectedAddressType] = useState('home');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 주소 목록 상태
  const [addresses, setAddresses] = useState([]);

  // 주소를 기반으로 위도경도 설정
  const setCoordinatesFromAddress = useCallback(async (address) => {
    if (!address) return null;
    
    try {
      console.log('주소를 좌표로 변환 중:', address);
      
      // 새로운 지오코딩 서비스 사용
      const coordinates = await geocodingService.geocodeAddress(address);
      
      if (coordinates) {
        console.log('좌표 변환 성공:', coordinates);
        return coordinates;
      } else {
        console.warn('주소를 좌표로 변환할 수 없습니다:', address);
        return null;
      }
    } catch (error) {
      console.error('주소 기반 좌표 변환 에러:', error);
      return null;
    }
  }, []);







  // 사용자 정보 로드
  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const userData = await userService.getCurrentUser();
      
      // 주소 목록 구성
      const addressList = [];
      
      if (userData.address && userData.address.trim() !== "") {
        addressList.push({
          id: 'home',
          title: '집',
          address: userData.address,
          type: 'home',
          isDefault: true
        });
      }
      
      if (userData.company_address && userData.company_address.trim() !== "") {
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
      // 편집 모드 설정
      setIsEditMode(true);
      setSelectedAddressType(address.type);
      // 주소 검색 팝업 열기
      setIsSearchPopupOpen(true);
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
      console.log('삭제할 주소:', address);
      
      const updateData = {};
      
      if (address.type === 'home') {
        updateData.address = ""; // null 대신 빈 문자열 사용
        updateData.latitude = 0; // null 대신 0 사용
        updateData.longitude = 0; // null 대신 0 사용
      } else if (address.type === 'company') {
        updateData.company_address = ""; // null 대신 빈 문자열 사용
      }

      console.log('업데이트할 데이터:', updateData);

      // /users/me 엔드포인트를 사용하여 프로필 업데이트
      const result = await userService.updateProfile(updateData);
      console.log('프로필 업데이트 결과:', result);
      
      // 사용자 정보 다시 로드하여 최신 정보 반영
      await loadUserInfo();
      
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

      // 회사 주소를 기본 주소로 설정할 때 위도경도도 함께 설정
      if (address.type === 'company') {
        const coordinates = await setCoordinatesFromAddress(address.address);
        if (coordinates) {
          updateData.latitude = coordinates.latitude;
          updateData.longitude = coordinates.longitude;
        }
      }

      // /users/me 엔드포인트를 사용하여 프로필 업데이트
      await userService.updateProfile(updateData);
      
      // 사용자 정보 다시 로드하여 최신 정보 반영
      await loadUserInfo();
      
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
      if (isEditMode) {
        console.log('주소 편집:', addressData);
        // 편집 모드: 기존 주소를 새 주소로 교체
        const coordinates = await setCoordinatesFromAddress(addressData.address);
        
        const updateData = {};
        
        if (addressData.type === 'home') {
          updateData.address = addressData.address;
          if (coordinates) {
            updateData.latitude = coordinates.latitude;
            updateData.longitude = coordinates.longitude;
          }
        } else if (addressData.type === 'company') {
          updateData.company_address = addressData.address;
        }

        await userService.updateProfile(updateData);
        await loadUserInfo();
        
        if (coordinates) {
          alert('주소와 위치 정보가 성공적으로 수정되었습니다.');
        } else {
          alert('주소가 성공적으로 수정되었습니다. (위치 정보는 설정되지 않았습니다)');
        }
        
        // 편집 모드 해제
        setIsEditMode(false);
      } else {
        console.log('새 주소 추가:', addressData);
        // 추가 모드: 새 주소 추가
        const coordinates = await setCoordinatesFromAddress(addressData.address);
        
        const updateData = {};
        
        if (addressData.type === 'home') {
          updateData.address = addressData.address;
          if (coordinates) {
            updateData.latitude = coordinates.latitude;
            updateData.longitude = coordinates.longitude;
          }
        } else if (addressData.type === 'company') {
          updateData.company_address = addressData.address;
        }

        await userService.updateProfile(updateData);
        await loadUserInfo();
        
        if (coordinates) {
          alert('주소와 위치 정보가 성공적으로 추가되었습니다.');
        } else {
          alert('주소가 성공적으로 추가되었습니다. (위치 정보는 설정되지 않았습니다)');
        }
      }
      
      setIsSearchPopupOpen(false);
    } catch (error) {
      console.error('주소 처리 실패:', error);
      alert('주소 처리에 실패했습니다.');
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
         onClose={() => {
           setIsSearchPopupOpen(false);
           // 편집 모드 초기화
           setIsEditMode(false);
         }}
         onAddressSelect={handleAddressSelect}
         addressType={selectedAddressType}
       />

      <div style={{height: '100px'}}></div>
      <BottomNavigation activeTab="mypage" />
    </div>
  );
};

export default AddressManagement;
