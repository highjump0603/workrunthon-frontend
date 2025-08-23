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
     amount: '',
     mealType: '점심' // 기본값으로 점심 설정
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
      // restaurantId 유효성 검사
      if (!restaurantId || restaurantId <= 0) {
        console.warn('유효하지 않은 restaurantId:', restaurantId);
        setMenus([]);
        return;
      }

      setIsLoadingMenus(true);
             const params = {
         restaurant_id: restaurantId,
         size: 100,
         categories: [] // 빈 배열로 설정하여 백엔드 validation 오류 방지
       };
      
      if (searchTerm) {
        params.name = searchTerm;
      }
      
      const data = await menuService.getMenus(params);
      setMenus(data.items || []);
         } catch (error) {
       console.error('메뉴 조회 실패:', error);
       console.error('에러 상세 정보:', {
         message: error.message,
         restaurantId: restaurantId
       });
       
       // 메뉴 조회 실패 시에도 사용자가 계속 진행할 수 있도록 처리
       setMenus([]);
       
       // 사용자에게 친화적인 메시지 표시 (선택사항)
       if (error.message.includes('500')) {
         console.warn('메뉴 목록을 불러올 수 없습니다. 수동으로 메뉴를 입력해주세요.');
       }
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

  const handleSave = async () => {
    try {
      // 필수 필드 검증
      if (!formData.restaurant || !formData.menu || !formData.amount) {
        alert('음식점, 메뉴, 금액을 모두 입력해주세요.');
        return;
      }

      // 금액에서 ₩ 제거하고 숫자만 추출
      const cost = parseInt(formData.amount.replace(/[^\d]/g, ''));
      if (isNaN(cost) || cost <= 0) {
        alert('유효한 금액을 입력해주세요.');
        return;
      }

      // 현재 사용자 ID 가져오기
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('로그인이 필요합니다.');
        navigate('/login');
        return;
      }

      // 사용자 정보 조회
      const userResponse = await fetch('https://wrtigloo.duckdns.org:8000/users/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json'
        }
      });

      if (!userResponse.ok) {
        throw new Error('사용자 정보를 가져올 수 없습니다.');
      }

      const userData = await userResponse.json();
      const userId = userData.id;

             // 선택된 메뉴의 ID 찾기 (메뉴가 선택된 경우)
       let menuId = null;
       if (selectedMenu && menus.length > 0) {
         const selectedMenuObj = menus.find(m => m.name === formData.menu);
         if (selectedMenuObj && selectedMenuObj.id > 0) {
           menuId = selectedMenuObj.id;
         }
       }

       // menu_id가 유효하지 않으면 null로 설정
       if (!menuId || menuId <= 0) {
         menuId = null;
       }

       // 식사 계획 생성 데이터
       const planData = {
         user_id: userId,
         menu_id: menuId || null, // 메뉴가 선택되지 않았으면 null
         plan_date: formData.date,
         cost: cost,
         memo: formData.menu, // 메뉴명을 메모로 저장
         type: formData.mealType // 사용자가 선택한 식사 타입
       };

             console.log('전송할 데이터:', {
         ...planData,
         menu_id_type: typeof planData.menu_id,
         menu_id_value: planData.menu_id,
         selected_menu: selectedMenu,
         menus_count: menus.length
       });

      // 식사 계획 생성 API 호출
      const response = await fetch('https://wrtigloo.duckdns.org:8000/planners/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify(planData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('식사 계획 생성 성공:', result);
        alert('내역이 성공적으로 추가되었습니다!');
        navigate('/ledger');
      } else {
        const errorData = await response.json();
        console.error('식사 계획 생성 실패:', errorData);
        
                 let errorMessage = '내역 추가에 실패했습니다.';
         if (errorData.detail) {
           if (Array.isArray(errorData.detail)) {
             errorMessage = errorData.detail.map(err => err.msg).join('\n');
           } else {
             // 외래키 제약조건 오류인 경우 사용자 친화적인 메시지
             if (errorData.detail.includes('foreign key constraint fails')) {
               errorMessage = '메뉴 정보가 올바르지 않습니다. 메뉴를 다시 선택해주세요.';
             } else {
               errorMessage = errorData.detail;
             }
           }
         }
         
         alert(errorMessage);
      }
    } catch (error) {
      console.error('내역 추가 에러:', error);
      alert('내역 추가 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
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
           <label className="field-label">식사 타입</label>
           <select
             className="field-input"
             value={formData.mealType || '점심'}
             onChange={(e) => handleInputChange('mealType', e.target.value)}
           >
             <option value="아침">아침</option>
             <option value="점심">점심</option>
             <option value="저녁">저녁</option>
             <option value="간식">간식</option>
           </select>
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
