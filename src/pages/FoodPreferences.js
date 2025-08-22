import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './FoodPreferences.css';
import BottomNavigation from '../components/BottomNavigation';
import LeftArrowIcon from '../assets/left_arrow.svg';
import { userService } from '../services/userService';

const FoodPreferences = () => {
  const navigate = useNavigate();
  const [dislikedFoods, setDislikedFoods] = useState({
    seafood: false,
    sashimi: false,
    fermented: false,
    spicy: false,
    gopchang: false,
    offal: false,
    stronglySpiced: false,
    mushroom: false
  });
  const [isLoading, setIsLoading] = useState(true);

  const handleFoodChange = (id) => {
    setDislikedFoods(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // 비선호 음식 정보를 API 형식으로 변환
  const convertDislikedFoodsToAPI = () => {
    const dislikedList = [];
    Object.entries(dislikedFoods).forEach(([key, value]) => {
      if (value) {
        const foodMap = {
          seafood: 1, // 해산물
          sashimi: 2, // 회
          fermented: 3, // 젓갈
          spicy: 4, // 매운 음식
          gopchang: 5, // 곱창
          offal: 6, // 내장
          stronglySpiced: 7, // 강한 양념
          mushroom: 8 // 버섯
        };
        dislikedList.push(foodMap[key]);
      }
    });
    return dislikedList;
  };

  // API 형식의 비선호 음식 정보를 체크박스 상태로 변환
  const convertAPItoDislikedFoods = (apiDislikedFoods) => {
    const newDislikedFoods = { ...dislikedFoods };
    if (apiDislikedFoods && Array.isArray(apiDislikedFoods)) {
      apiDislikedFoods.forEach(foodId => {
        const key = Object.keys(dislikedFoods).find(k => {
          const foodMap = {
            1: 'seafood',
            2: 'sashimi',
            3: 'fermented',
            4: 'spicy',
            5: 'gopchang',
            6: 'offal',
            7: 'stronglySpiced',
            8: 'mushroom'
          };
          return foodMap[foodId] === k;
        });
        if (key) {
          newDislikedFoods[key] = true;
        }
      });
    }
    return newDislikedFoods;
  };

  // 사용자 비선호 음식 정보 가져오기
  const fetchDislikedFoodsInfo = async () => {
    try {
      setIsLoading(true);
      const userData = await userService.getCurrentUser();
      if (userData.disliked_menus) {
        const convertedDislikedFoods = convertAPItoDislikedFoods(userData.disliked_menus);
        setDislikedFoods(convertedDislikedFoods);
      }
    } catch (error) {
      console.error('비선호 음식 정보 조회 에러:', error);
      // 에러 시 기본값(모두 false) 유지
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 비선호 음식 정보 가져오기
  useEffect(() => {
    fetchDislikedFoodsInfo();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    try {
      const dislikedList = convertDislikedFoodsToAPI();
      await userService.updateProfile({
        disliked_menus: dislikedList
      });
      alert('비선호 음식 설정이 저장되었습니다.');
      navigate('/mypage');
    } catch (error) {
      console.error('비선호 음식 설정 저장 에러:', error);
      alert('비선호 음식 설정 저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="food-preferences-container">
      {/* 헤더 */}
      <div className="food-preferences-header">
        <button className="back-button" onClick={() => navigate('/mypage')}>
          <img src={LeftArrowIcon} alt="back" className="back-arrow" />
        </button>
        <h1 className="food-preferences-title">비선호 음식</h1>
      </div>
      
      {/* 설명 */}
      <p className="food-preferences-description">선호하지 않는 음식을 선택해주세요.</p>

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="food-preferences-loading">
          <p>비선호 음식 정보를 불러오는 중...</p>
        </div>
      )}

      {/* 비선호 음식 체크박스 그리드 */}
      {!isLoading && (
        <div className="food-preferences-checkbox-grid">
        <div className="checkbox-item">
          <input 
            type="checkbox" 
            id="seafood" 
            checked={dislikedFoods.seafood}
            onChange={() => handleFoodChange('seafood')}
          />
          <label htmlFor="seafood">해산물</label>
        </div>
        <div className="checkbox-item">
          <input 
            type="checkbox" 
            id="sashimi" 
            checked={dislikedFoods.sashimi}
            onChange={() => handleFoodChange('sashimi')}
          />
          <label htmlFor="sashimi">회</label>
        </div>
        <div className="checkbox-item">
          <input 
            type="checkbox" 
            id="fermented" 
            checked={dislikedFoods.fermented}
            onChange={() => handleFoodChange('fermented')}
          />
          <label htmlFor="fermented">젓갈</label>
        </div>
        <div className="checkbox-item">
          <input 
            type="checkbox" 
            id="spicy" 
            checked={dislikedFoods.spicy}
            onChange={() => handleFoodChange('spicy')}
          />
          <label htmlFor="spicy">매운 음식</label>
        </div>
        <div className="checkbox-item">
          <input 
            type="checkbox" 
            id="gopchang" 
            checked={dislikedFoods.gopchang}
            onChange={() => handleFoodChange('gopchang')}
          />
          <label htmlFor="gopchang">곱창</label>
        </div>
        <div className="checkbox-item">
          <input 
            type="checkbox" 
            id="offal" 
            checked={dislikedFoods.offal}
            onChange={() => handleFoodChange('offal')}
          />
          <label htmlFor="offal">내장류</label>
        </div>
        <div className="checkbox-item">
          <input 
            type="checkbox" 
            id="stronglySpiced" 
            checked={dislikedFoods.stronglySpiced}
            onChange={() => handleFoodChange('stronglySpiced')}
          />
          <label htmlFor="stronglySpiced">향신료 강한 음식</label>
        </div>
        <div className="checkbox-item">
          <input 
            type="checkbox" 
            id="mushroom" 
            checked={dislikedFoods.mushroom}
            onChange={() => handleFoodChange('mushroom')}
          />
          <label htmlFor="mushroom">버섯</label>
        </div>
      </div>
      )}

      {/* 저장 버튼 */}
      <div className="food-preferences-save-button-container">
        <button className="food-preferences-save-button" onClick={handleSave}>
          저장
        </button>
      </div>

      <div style={{height: '100px'}}></div>
      <BottomNavigation activeTab="mypage" />
    </div>
  );
};

export default FoodPreferences;
