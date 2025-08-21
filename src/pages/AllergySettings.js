import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AllergySettings.css';

const AllergySettings = () => {
  const navigate = useNavigate();
  const [allergies, setAllergies] = useState({
    egg: false,
    milk: false,
    buckwheat: false,
    peanut: false,
    mackerel: false,
    crab: false,
    squid: false,
    nuts: false,
    soybean: false,
    wheat: false,
    peach: false,
    shrimp: false,
    shellfish: false,
    pork: false
  });

  const handleAllergyChange = (id) => {
    setAllergies(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSave = () => {
    console.log('알레르기 설정 저장:', allergies);
    // 여기에 저장 로직을 추가할 수 있습니다
    alert('알레르기 설정이 저장되었습니다.');
    navigate('/mypage');
  };

  return (
    <div className="allergy-settings-container">
      {/* 헤더 */}
      <div className="allergy-header">
        <h1 className="allergy-title">알레르기 선택</h1>
        <p className="allergy-description">선택 할 수 없는 음식 재료를 선택해주세요.</p>
      </div>

      {/* 알레르기 체크박스 그리드 */}
      <div className="allergy-checkbox-grid">
        <div className="checkbox-item">
          <input 
            type="checkbox" 
            id="egg" 
            checked={allergies.egg}
            onChange={() => handleAllergyChange('egg')}
          />
          <label htmlFor="egg">난류 (계란)</label>
        </div>
        <div className="checkbox-item">
          <input 
            type="checkbox" 
            id="milk" 
            checked={allergies.milk}
            onChange={() => handleAllergyChange('milk')}
          />
          <label htmlFor="milk">우유</label>
        </div>
        <div className="checkbox-item">
          <input 
            type="checkbox" 
            id="buckwheat" 
            checked={allergies.buckwheat}
            onChange={() => handleAllergyChange('buckwheat')}
          />
          <label htmlFor="buckwheat">메밀</label>
        </div>
        <div className="checkbox-item">
          <input 
            type="checkbox" 
            id="peanut" 
            checked={allergies.peanut}
            onChange={() => handleAllergyChange('peanut')}
          />
          <label htmlFor="peanut">땅콩</label>
        </div>
        <div className="checkbox-item">
          <input 
            type="checkbox" 
            id="mackerel" 
            checked={allergies.mackerel}
            onChange={() => handleAllergyChange('mackerel')}
          />
          <label htmlFor="mackerel">고등어</label>
        </div>
        <div className="checkbox-item">
          <input 
            type="checkbox" 
            id="crab" 
            checked={allergies.crab}
            onChange={() => handleAllergyChange('crab')}
          />
          <label htmlFor="crab">게</label>
        </div>
        <div className="checkbox-item">
          <input 
            type="checkbox" 
            id="squid" 
            checked={allergies.squid}
            onChange={() => handleAllergyChange('squid')}
          />
          <label htmlFor="squid">오징어</label>
        </div>
        <div className="checkbox-item">
          <input 
            type="checkbox" 
            id="nuts" 
            checked={allergies.nuts}
            onChange={() => handleAllergyChange('nuts')}
          />
          <label htmlFor="nuts">견과류</label>
        </div>
        <div className="checkbox-item">
          <input 
            type="checkbox" 
            id="soybean" 
            checked={allergies.soybean}
            onChange={() => handleAllergyChange('soybean')}
          />
          <label htmlFor="soybean">대두(콩)</label>
        </div>
        <div className="checkbox-item">
          <input 
            type="checkbox" 
            id="wheat" 
            checked={allergies.wheat}
            onChange={() => handleAllergyChange('wheat')}
          />
          <label htmlFor="wheat">밀</label>
        </div>
        <div className="checkbox-item">
          <input 
            type="checkbox" 
            id="peach" 
            checked={allergies.peach}
            onChange={() => handleAllergyChange('peach')}
          />
          <label htmlFor="peach">복숭아</label>
        </div>
        <div className="checkbox-item">
          <input 
            type="checkbox" 
            id="shrimp" 
            checked={allergies.shrimp}
            onChange={() => handleAllergyChange('shrimp')}
          />
          <label htmlFor="shrimp">새우</label>
        </div>
        <div className="checkbox-item">
          <input 
            type="checkbox" 
            id="shellfish" 
            checked={allergies.shellfish}
            onChange={() => handleAllergyChange('shellfish')}
          />
          <label htmlFor="shellfish">조개류</label>
        </div>
        <div className="checkbox-item">
          <input 
            type="checkbox" 
            id="pork" 
            checked={allergies.pork}
            onChange={() => handleAllergyChange('pork')}
          />
          <label htmlFor="pork">돼지고기</label>
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="save-button-container">
        <button className="save-button" onClick={handleSave}>
          저장
        </button>
      </div>
    </div>
  );
};

export default AllergySettings;
