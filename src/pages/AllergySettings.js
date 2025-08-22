import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AllergySettings.css';
import LeftArrowIcon from '../assets/left_arrow.svg';
import { userService } from '../services/userService';

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
  const [isLoading, setIsLoading] = useState(true);

  const handleAllergyChange = (id) => {
    setAllergies(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // 알레르기 정보를 API 형식으로 변환
  const convertAllergiesToAPI = () => {
    const allergyList = [];
    Object.entries(allergies).forEach(([key, value]) => {
      if (value) {
        const allergyMap = {
          egg: '계란',
          milk: '우유',
          buckwheat: '메밀',
          peanut: '땅콩',
          mackerel: '고등어',
          crab: '게',
          squid: '오징어',
          nuts: '견과류',
          soybean: '대두',
          wheat: '밀',
          peach: '복숭아',
          shrimp: '새우',
          shellfish: '조개류',
          pork: '돼지고기'
        };
        allergyList.push(allergyMap[key]);
      }
    });
    return allergyList;
  };

  // API 형식의 알레르기 정보를 체크박스 상태로 변환
  const convertAPItoAllergies = (apiAllergies) => {
    const newAllergies = { ...allergies };
    if (apiAllergies && Array.isArray(apiAllergies)) {
      apiAllergies.forEach(allergy => {
        const key = Object.keys(allergies).find(k => {
          const allergyMap = {
            '계란': 'egg',
            '우유': 'milk',
            '메밀': 'buckwheat',
            '땅콩': 'peanut',
            '고등어': 'mackerel',
            '게': 'crab',
            '오징어': 'squid',
            '견과류': 'nuts',
            '대두': 'soybean',
            '밀': 'wheat',
            '복숭아': 'peach',
            '새우': 'shrimp',
            '조개류': 'shellfish',
            '돼지고기': 'pork'
          };
          return allergyMap[allergy] === k;
        });
        if (key) {
          newAllergies[key] = true;
        }
      });
    }
    return newAllergies;
  };

  // 사용자 알레르기 정보 가져오기
  const fetchAllergyInfo = async () => {
    try {
      setIsLoading(true);
      const userData = await userService.getCurrentUser();
      if (userData.allergies) {
        const convertedAllergies = convertAPItoAllergies(userData.allergies);
        setAllergies(convertedAllergies);
      }
    } catch (error) {
      console.error('알레르기 정보 조회 에러:', error);
      // 에러 시 기본값(모두 false) 유지
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 알레르기 정보 가져오기
  useEffect(() => {
    fetchAllergyInfo();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    try {
      const allergyList = convertAllergiesToAPI();
      await userService.updateProfile({
        allergies: allergyList
      });
      alert('알레르기 설정이 저장되었습니다.');
      navigate('/mypage');
    } catch (error) {
      console.error('알레르기 설정 저장 에러:', error);
      alert('알레르기 설정 저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="allergy-settings-container">
      {/* 헤더 */}
      <div className="allergy-header">
        <button className="back-button" onClick={() => navigate('/mypage')}>
          <img src={LeftArrowIcon} alt="back" className="back-arrow" />
        </button>
        <h1 className="allergy-title">알레르기 선택</h1>
      </div>
      
      {/* 설명 */}
      <p className="allergy-description">선택 할 수 없는 음식 재료를 선택해주세요.</p>

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="allergy-loading">
          <p>알레르기 정보를 불러오는 중...</p>
        </div>
      )}

      {/* 알레르기 체크박스 그리드 */}
      {!isLoading && (
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
      )}

      {/* 저장 버튼 */}
      <div className="save-button-container2">
        <button className="save-button2" onClick={handleSave}>
          저장
        </button>
      </div>
    </div>
  );
};

export default AllergySettings;
