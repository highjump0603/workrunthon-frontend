import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AddDetails.css';
import leftArrow from '../assets/left_arrow.svg';
import { menuService } from '../services/menuService';

const AddDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0], // 오늘 날짜를 기본값으로
    restaurant: '',
    menu: '',
    amount: ''
  });

  const [selectedRestaurant, setSelectedRestaurant] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(false);
  const [restaurantId, setRestaurantId] = useState(null);
  const [menus, setMenus] = useState([]);
  const [isLoadingMenus, setIsLoadingMenus] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [menuSearchTerm, setMenuSearchTerm] = useState('');

  // 식당 선택 페이지에서 돌아온 경우 선택된 식당 정보 처리
  useEffect(() => {
    if (location.state?.fromRestaurantSelection && location.state?.selectedRestaurant) {
      const restaurant = location.state.selectedRestaurant;
      setFormData(prev => ({
        ...prev,
        restaurant: restaurant.name
      }));
      setRestaurantId(restaurant.id);
      setSelectedRestaurant(true);
      
      // 해당 식당의 메뉴 조회
      loadMenus(restaurant.id);
    }
  }, [location.state]);

  // 메뉴 조회 함수
  const loadMenus = async (restaurantId, searchTerm = '') => {
    try {
      setIsLoadingMenus(true);
      const params = {
        restaurant_id: restaurantId,
        size: 100
      };
      
      if (searchTerm) {
        params.name = searchTerm;
      }
      
      const data = await menuService.getMenus(params);
      setMenus(data.items || []);
    } catch (error) {
      console.error('메뉴 조회 실패:', error);
      setMenus([]);
    } finally {
      setIsLoadingMenus(false);
    }
  };

  // 메뉴 검색
  const handleMenuSearch = (searchTerm) => {
    setMenuSearchTerm(searchTerm);
    if (restaurantId) {
      loadMenus(restaurantId, searchTerm);
    }
  };

  // 메뉴 선택
  const handleMenuSelect = (menu) => {
    setFormData(prev => ({
      ...prev,
      menu: menu.name,
      amount: `₩${menu.cost.toLocaleString()}`
    }));
    setSelectedMenu(true);
    setShowMenuModal(false);
  };

  const handleInputChange = (field, value) => {
    // 금액 입력 시 숫자만 허용
    if (field === 'amount') {
      const numericValue = value.replace(/[^\d]/g, '');
      if (numericValue === '') {
        setFormData(prev => ({ ...prev, [field]: '' }));
      } else {
        setFormData(prev => ({ ...prev, [field]: `₩${parseInt(numericValue).toLocaleString()}` }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    // 음식점과 메뉴 선택 상태 업데이트
    if (field === 'restaurant') {
      setSelectedRestaurant(value.trim() !== '');
      // 수동 입력 시 restaurantId 초기화
      if (value.trim() === '') {
        setRestaurantId(null);
      }
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
            type="date"
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
              placeholder="음식점명을 입력하거나 선택하세요"
              value={formData.restaurant}
              onChange={(e) => handleInputChange('restaurant', e.target.value)}
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
          <div className="menu-input-container">
            <input
              type="text"
              className={`field-input ${selectedMenu ? 'selected' : ''}`}
              placeholder="메뉴명을 입력하거나 선택하세요"
              value={formData.menu}
              onChange={(e) => handleInputChange('menu', e.target.value)}
            />
            {restaurantId && (
              <button 
                className="menu-select-button"
                onClick={() => setShowMenuModal(true)}
              >
                메뉴 선택
              </button>
            )}
          </div>
        </div>

        <div className="form-field">
          <label className="field-label">금액</label>
          <input
            type="text"
            className="field-input amount-input"
            placeholder="금액을 입력하세요 (숫자만)"
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

      {/* 메뉴 선택 모달 */}
      {showMenuModal && (
        <div className="modal-overlay" onClick={() => setShowMenuModal(false)}>
          <div className="menu-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>메뉴 선택</h3>
              <button className="close-button" onClick={() => setShowMenuModal(false)}>×</button>
            </div>
            
            <div className="modal-search">
              <input
                type="text"
                placeholder="메뉴 검색..."
                value={menuSearchTerm}
                onChange={(e) => handleMenuSearch(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="menu-list">
              {isLoadingMenus ? (
                <div className="loading">메뉴를 불러오는 중...</div>
              ) : menus.length > 0 ? (
                menus.map((menu) => (
                  <div
                    key={menu.id}
                    className="menu-item"
                    onClick={() => handleMenuSelect(menu)}
                  >
                    <div className="menu-name">{menu.name}</div>
                    <div className="menu-price">₩{menu.cost.toLocaleString()}</div>
                  </div>
                ))
              ) : (
                <div className="no-menus">메뉴가 없습니다.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddDetails;
