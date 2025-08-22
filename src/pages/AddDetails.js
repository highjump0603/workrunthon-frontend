import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AddDetails.css';
import leftArrow from '../assets/left_arrow.svg';

const AddDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    date: '2025.7.1',
    restaurant: '',
    menu: '',
    amount: '₩34,500'
  });

  const [selectedRestaurant, setSelectedRestaurant] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(false);

  // 식당 선택 페이지에서 돌아온 경우 선택된 식당 정보 처리
  useEffect(() => {
    if (location.state?.fromRestaurantSelection && location.state?.selectedRestaurant) {
      const restaurant = location.state.selectedRestaurant;
      setFormData(prev => ({
        ...prev,
        restaurant: restaurant.name
      }));
      setSelectedRestaurant(true);
    }
  }, [location.state]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 음식점과 메뉴 선택 상태 업데이트
    if (field === 'restaurant') {
      setSelectedRestaurant(value.trim() !== '');
    } else if (field === 'menu') {
      setSelectedMenu(value.trim() !== '');
    }
  };

  const handleCancel = () => {
    navigate('/ledger');
  };

  const handleSave = () => {
    // 여기에 저장 로직 구현
    console.log('저장된 데이터:', formData);
    navigate('/ledger');
  };

  return (
    <div className="add-details-page">
      <div className="add-details-header">
        <button className="back-btn" onClick={() => navigate('/ledger')}>
          <img src={leftArrow} alt="뒤로가기" />
        </button>
        <h1 className="add-details-title">내역 추가</h1>
      </div>

      <div className="add-details-form">
        <div className="form-field">
          <label className="field-label">날짜</label>
          <input
            type="text"
            className="field-input"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
          />
        </div>

                 <div className="form-field">
           <label className="field-label">음식점</label>
           <div className="restaurant-input-container">
             <input
               type="text"
               className={`field-input ${selectedRestaurant ? 'selected' : ''}`}
               placeholder="음식점"
               value={formData.restaurant}
               onChange={(e) => handleInputChange('restaurant', e.target.value)}
               readOnly
             />
             <button 
               className="restaurant-select-button"
               onClick={() => navigate('/restaurant-selection')}
             >
               음식점 선택
             </button>
           </div>
         </div>

         <div className="form-field">
           <label className="field-label">메뉴</label>
           <input
             type="text"
             className={`field-input ${selectedMenu ? 'selected' : ''}`}
             placeholder="예: 비빔밥"
             value={formData.menu}
             onChange={(e) => handleInputChange('menu', e.target.value)}
           />
         </div>

        <div className="form-field">
          <label className="field-label">금액</label>
          <input
            type="text"
            className="field-input amount-input"
            value={formData.amount}
            onChange={(e) => handleInputChange('amount', e.target.value)}
          />
        </div>
      </div>

      <div className="add-details-actions">
        <button className="cancel-btn" onClick={handleCancel}>
          취소
        </button>
        <button className="save-btn" onClick={handleSave}>
          저장
        </button>
      </div>
    </div>
  );
};

export default AddDetails;
