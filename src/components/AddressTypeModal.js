import React from 'react';
import './AddressTypeModal.css';

const AddressTypeModal = ({ isOpen, onClose, onAddressTypeSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="address-type-modal-overlay">
      <div className="address-type-modal">
        <div className="address-type-modal-header">
          <h3>주소 타입 선택</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="address-type-modal-content">
          <p>어떤 주소를 추가하시나요?</p>
          
          <div className="address-type-buttons">
            <button 
              className="address-type-button home-button"
              onClick={() => onAddressTypeSelect('home')}
            >
              <div className="button-icon">🏠</div>
              <span>집</span>
            </button>
            
            <button 
              className="address-type-button company-button"
              onClick={() => onAddressTypeSelect('company')}
            >
              <div className="button-icon">🏢</div>
              <span>회사</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressTypeModal;
