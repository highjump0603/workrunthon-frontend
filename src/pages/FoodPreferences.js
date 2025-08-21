import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FoodPreferences.css';
import BottomNavigation from '../components/BottomNavigation';

const FoodPreferences = () => {
  const navigate = useNavigate();
  const [dislikedFoods, setDislikedFoods] = useState({
    seafood: false,
    sashimi: false,
    fermented: false,
    spicy: false,
    gopchang: true, // 기본적으로 체크됨
    offal: false,
    stronglySpiced: false,
    mushroom: false
  });

  const handleFoodChange = (id) => {
    setDislikedFoods(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSave = () => {
    console.log('비선호 음식 설정이 저장되었습니다.');
    // 여기에 저장 로직을 추가할 수 있습니다
    alert('비선호 음식 설정이 저장되었습니다.');
    navigate('/mypage');
  };

  return (
    <div className="food-preferences-container">
      {/* 헤더 */}
      <div className="food-preferences-header">
        <h1 className="food-preferences-title">비선호 음식</h1>
        <p className="food-preferences-description">선호하지 않는 음식을 선택해주세요.</p>
      </div>

      {/* 비선호 음식 체크박스 그리드 */}
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

      {/* 저장 버튼 */}
      <div className="save-button-container">
        <button className="save-button" onClick={handleSave}>
          저장
        </button>
      </div>

      <div style={{height: '100px'}}></div>
      <BottomNavigation activeTab="mypage" />
    </div>
  );
};

export default FoodPreferences;
