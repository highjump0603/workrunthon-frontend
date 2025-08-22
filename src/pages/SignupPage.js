import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignupPage.css';
import LeftArrowIcon from '../assets/left_arrow.svg';

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user_id: '',
    password: '',
    confirmPassword: '',
    name: '',
    oauth: 'None',
    address: '',
    zipCode: ''
  });
  const [agreements, setAgreements] = useState({
    personalInfo: false,
    locationService: false
  });

  const [addressSearch, setAddressSearch] = useState('');
  const [addressResults, setAddressResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAgreementChange = (name) => {
    setAgreements(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 필수 동의 항목 확인
    if (!agreements.personalInfo || !agreements.locationService) {
      alert('필수 동의 항목에 동의해주세요.');
      return;
    }

    // 비밀번호 확인
    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
             // API 스펙에 맞게 데이터 준비
       const signupData = {
         user_id: formData.user_id,
         password: formData.password,
         name: formData.name,
         oauth: formData.oauth || '',
         address: formData.address,
         budget: 0
       };

      // 실제 회원가입 API 호출
      const response = await fetch('http://15.165.7.141:8000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify(signupData)
      });

             if (response.ok) {
         const result = await response.json();
         console.log('회원가입 성공:', result);
         alert('회원가입이 완료되었습니다!');
         navigate('/onboarding');
       } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      console.error('회원가입 에러:', error);
      alert(error.message || '회원가입에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleBackClick = () => {
    navigate('/');
  };

  const handleAddressSearch = async () => {
    if (!addressSearch.trim()) {
      alert('검색어를 입력해주세요.');
      return;
    }

    setIsSearching(true);
    try {
      // 행안부 주소 검색 API 호출 (새로운 API 키 사용)
      const response = await fetch(`https://business.juso.go.kr/addrlink/addrLinkApi.do?currentPage=1&countPerPage=10&keyword=${encodeURIComponent(addressSearch)}&confmKey=devU01TX0FVVEgyMDI1MDgyMjE2MTAwODExNjEwMTY=&resultType=json&hstryYn=N&firstSort=none&addInfoYn=N`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.juso) {
          setAddressResults(data.results.juso);
        } else {
          setAddressResults([]);
        }
      } else {
        throw new Error('주소 검색에 실패했습니다.');
      }
    } catch (error) {
      console.error('주소 검색 에러:', error);
      alert('주소 검색에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddressSelect = (address, zipCode) => {
    setFormData(prev => ({
      ...prev,
      address: address,
      zipCode: zipCode
    }));
    setAddressResults([]);
    setAddressSearch('');
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        {/* 헤더 */}
        <div className="signup-header">
          <button className="signup-back-button" onClick={handleBackClick}>
            <img src={LeftArrowIcon} alt="back" className="signup-back-arrow" />
          </button>
          <h1 className="signup-title">회원가입</h1>
          <div></div>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          {/* 기본 정보 */}
          <div className="form-section">
            <h3 className="section-title">기본 정보</h3>
            
            <div className="form-group">
              <input
                type="text"
                name="user_id"
                placeholder="아이디"
                value={formData.user_id}
                onChange={handleInputChange}
                autoComplete="username"
                required
              />
            </div>

                         <div className="form-group">
               <input
                 type="password"
                 name="password"
                 placeholder="비밀번호"
                 value={formData.password}
                 onChange={handleInputChange}
                 autoComplete="new-password"
                 required
               />
             </div>

             <div className="form-group">
               <input
                 type="password"
                 name="confirmPassword"
                 placeholder="비밀번호 확인"
                 value={formData.confirmPassword}
                 onChange={handleInputChange}
                 autoComplete="new-password"
                 required
               />
             </div>

            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="이름"
                value={formData.name}
                onChange={handleInputChange}
                autoComplete="name"
                required
              />
            </div>



                         <div className="form-group address-group">
               <div className="address-search-container">
                 <input
                   type="text"
                   placeholder="주소를 검색하세요"
                   value={addressSearch}
                   onChange={(e) => setAddressSearch(e.target.value)}
                   onKeyPress={(e) => e.key === 'Enter' && handleAddressSearch()}
                   className="address-search-input"
                 />
                 <button 
                   type="button" 
                   className="search-button"
                   onClick={handleAddressSearch}
                   disabled={isSearching}
                 >
                   {isSearching ? '검색중...' : '검색'}
                 </button>
               </div>
               
                               {formData.address && (
                  <div className="selected-address">
                    <span className="address-label">선택된 주소:</span>
                    <span className="address-value">{formData.address}</span>
                    {formData.zipCode && (
                      <span className="zip-code">({formData.zipCode})</span>
                    )}
                  </div>
                )}
               
                               {addressResults.length > 0 && (
                  <div className="address-results">
                    {addressResults.map((result, index) => (
                      <div 
                        key={index} 
                        className="address-result-item"
                        onClick={() => handleAddressSelect(result.roadAddr || result.jibunAddr, result.zipNo)}
                      >
                        <div className="address-main">{result.roadAddr || result.jibunAddr}</div>
                        <div className="address-sub">
                          {result.jibunAddr} • {result.zipNo} • {result.siNm} {result.sggNm} {result.emdNm}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
             </div>
          </div>



          {/* 약관 동의 */}
          <div className="form-section">
            <h3 className="section-title">약관 동의</h3>
            
            <div className="agreement-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={agreements.personalInfo}
                  onChange={() => handleAgreementChange('personalInfo')}
                />
                <span className="checkmark"></span>
                개인 정보 수집 및 이용 약관 동의 (필수)
              </label>
            </div>

            <div className="agreement-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={agreements.locationService}
                  onChange={() => handleAgreementChange('locationService')}
                />
                <span className="checkmark"></span>
                위치 기반 서비스 이용 약관 동의 (필수)
              </label>
            </div>
          </div>

          {/* 가입 완료 버튼 */}
          <button type="submit" className="submit-button">
            가입 완료
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
