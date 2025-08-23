import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './SignupPage.css';
import LeftArrowIcon from '../assets/left_arrow.svg';
import { geocodingService } from '../services/geocodingService';

const SignupPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // BudgetSetupPage에서 전달받은 예산 정보 사용
  const budgetFromSetup = location.state?.budget || 0;
  
  const [formData, setFormData] = useState({
    user_id: '',
    password: '',
    password_confirm: '',
    name: '',
    email: '',
    address: '',
    zipCode: '',
    company_address: '',
            budget: budgetFromSetup,
        gender: 'prefer_not_to_say',
        activity_radius: 10,
        meal_pattern: '3_meals',
        latitude: null,
        longitude: null,
    preferred_menus: [],
    disliked_menus: [],
    allergies: [],
    
  });




  const [addressSearch, setAddressSearch] = useState('');
  const [addressResults, setAddressResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const [companyAddressSearch, setCompanyAddressSearch] = useState('');
  const [companyAddressResults, setCompanyAddressResults] = useState([]);
  const [isCompanySearching, setIsCompanySearching] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 필수 동의 항목 확인 (간단한 체크박스로 변경)
    const personalInfoAgreed = document.querySelector('input[name="personalInfo"]')?.checked;
    const locationServiceAgreed = document.querySelector('input[name="locationService"]')?.checked;
    
    if (!personalInfoAgreed || !locationServiceAgreed) {
      alert('필수 동의 항목에 동의해주세요.');
      return;
    }

    // 비밀번호 확인
    if (formData.password !== formData.password_confirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 비밀번호 길이 확인
    if (formData.password.length < 6) {
      alert('비밀번호는 6자 이상이어야 합니다.');
      return;
    }

    try {
            // password_confirm 필드를 포함한 필수 필드 + 위도/경도 정보
      const signupData = {
        user_id: formData.user_id,
        password: formData.password,
        password_confirm: formData.password_confirm,
        name: formData.name,
        email: formData.email,
        address: formData.address || '',
        company_address: formData.company_address || '',
        latitude: formData.latitude,
        longitude: formData.longitude,
        budget: formData.budget,
        gender: formData.gender,
        activity_radius: formData.activity_radius,
        meal_pattern: formData.meal_pattern,
        onboarding_completed: true // 회원가입 시 온보딩 완료로 설정
      };

      // 실제 회원가입 API 호출
      console.log('전송할 데이터:', signupData);
      console.log('password_confirm 값:', formData.password_confirm);
      const response = await fetch('https://wrtigloo.duckdns.org:8000/users/signup', {
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
          alert('회원가입이 완료되었습니다! 이제 로그인해주세요.');
          // 회원가입 완료 후 로그인 페이지로 이동
          navigate('/login', { 
            state: { 
              message: '회원가입이 완료되었습니다. 로그인해주세요.',
              newUser: true 
            } 
          });
                } else {
          const errorData = await response.json();
          console.error('회원가입 실패 응답:', errorData);
          console.error('에러 데이터 타입:', typeof errorData);
          console.error('에러 데이터 키:', Object.keys(errorData));
          
          // 422 에러의 경우 상세한 validation 에러 정보 표시
          if (response.status === 422 && errorData.detail) {
            let errorMessage = '입력 데이터가 유효하지 않습니다:\n';
            
            if (Array.isArray(errorData.detail)) {
              errorData.detail.forEach((error, index) => {
                const field = error.loc ? error.loc.join('.') : `필드${index + 1}`;
                const message = error.msg || '알 수 없는 오류';
                errorMessage += `• ${field}: ${message}\n`;
              });
            } else if (typeof errorData.detail === 'string') {
              errorMessage = errorData.detail;
            } else {
              errorMessage = JSON.stringify(errorData.detail, null, 2);
            }
            
            throw new Error(errorMessage);
          }
          
          // 백엔드 에러 메시지가 있는 경우 사용
          if (errorData.detail) {
            throw new Error(JSON.stringify(errorData.detail));
          }
          
          // HTTP 상태 코드별 에러 메시지
          switch (response.status) {
            case 400:
              throw new Error('잘못된 요청입니다. 입력 정보를 확인해주세요.');
            case 401:
              throw new Error('인증이 필요합니다.');
            case 403:
              throw new Error('접근이 거부되었습니다.');
            case 409:
              throw new Error('이미 존재하는 사용자입니다.');
            case 422:
              throw new Error('입력 데이터가 유효하지 않습니다.');
            case 500:
              throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
            default:
              throw new Error(`회원가입에 실패했습니다. (${response.status})`);
          }
        }
    } catch (error) {
      console.error('회원가입 에러:', error);
      
      // 에러 메시지가 너무 길면 줄바꿈으로 가독성 향상
      let errorMessage = error.message || '회원가입에 실패했습니다. 다시 시도해주세요.';
      
      // 줄바꿈이 포함된 메시지의 경우 alert에서 가독성 향상
      if (errorMessage.includes('\n')) {
        errorMessage = errorMessage.replace(/\n/g, '\n');
      }
      
      alert(errorMessage);
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

  const handleAddressSelect = async (address, zipCode) => {
    try {
      // 주소를 위도/경도로 변환
      console.log('주소를 좌표로 변환 중:', address);
      const coordinates = await geocodingService.geocodeAddress(address);
      
      setFormData(prev => ({
        ...prev,
        address: address,
        zipCode: zipCode,
        latitude: coordinates ? coordinates.latitude : null,
        longitude: coordinates ? coordinates.longitude : null
      }));
      
      if (coordinates) {
        console.log('주소 좌표 변환 성공:', coordinates);
      } else {
        console.warn('주소 좌표 변환 실패:', address);
      }
    } catch (error) {
      console.error('주소 좌표 변환 에러:', error);
      // 에러가 발생해도 주소는 저장
      setFormData(prev => ({
        ...prev,
        address: address,
        zipCode: zipCode,
        latitude: null,
        longitude: null
      }));
    }
    
    setAddressResults([]);
    setAddressSearch('');
  };

  const handleCompanyAddressSearch = async () => {
    if (!companyAddressSearch.trim()) {
      alert('검색어를 입력해주세요.');
      return;
    }

    setIsCompanySearching(true);
    try {
      // 행안부 주소 검색 API 호출 (회사 주소용)
      const response = await fetch(`https://business.juso.go.kr/addrlink/addrLinkApi.do?currentPage=1&countPerPage=10&keyword=${encodeURIComponent(companyAddressSearch)}&confmKey=devU01TX0FVVEgyMDI1MDgyMjE2MTAwODExNjEwMTY=&resultType=json&hstryYn=N&firstSort=none&addInfoYn=N`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.juso) {
          setCompanyAddressResults(data.results.juso);
        } else {
          setCompanyAddressResults([]);
        }
      } else {
        throw new Error('회사 주소 검색에 실패했습니다.');
      }
    } catch (error) {
      console.error('회사 주소 검색 에러:', error);
      alert('회사 주소 검색에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsCompanySearching(false);
    }
  };

  const handleCompanyAddressSelect = async (address) => {
    try {
      // 회사 주소를 위도/경도로 변환 (참고용, 집 주소가 메인)
      console.log('회사 주소를 좌표로 변환 중:', address);
      const coordinates = await geocodingService.geocodeAddress(address);
      
      setFormData(prev => ({
        ...prev,
        company_address: address
      }));
      
      if (coordinates) {
        console.log('회사 주소 좌표 변환 성공:', coordinates);
      } else {
        console.warn('회사 주소 좌표 변환 실패:', address);
      }
    } catch (error) {
      console.error('회사 주소 좌표 변환 에러:', error);
      // 에러가 발생해도 주소는 저장
      setFormData(prev => ({
        ...prev,
        company_address: address
      }));
    }
    
    setCompanyAddressResults([]);
    setCompanyAddressSearch('');
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
                 name="password_confirm"
                 placeholder="비밀번호 확인"
                 value={formData.password_confirm}
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

            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="이메일"
                value={formData.email}
                onChange={handleInputChange}
                autoComplete="email"
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
                  {formData.latitude && formData.longitude && (
                    <div className="coordinates-info">
                      <small>위도: {formData.latitude.toFixed(6)}, 경도: {formData.longitude.toFixed(6)}</small>
                    </div>
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

            <div className="form-group company-address-group">
              <div className="address-search-container">
                <input
                  type="text"
                  placeholder="회사 주소를 검색하세요 (선택사항)"
                  value={companyAddressSearch}
                  onChange={(e) => setCompanyAddressSearch(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCompanyAddressSearch()}
                  className="address-search-input"
                />
                <button 
                  type="button" 
                  className="search-button"
                  onClick={handleCompanyAddressSearch}
                  disabled={isCompanySearching}
                >
                  {isCompanySearching ? '검색중...' : '검색'}
                </button>
              </div>
              
              {formData.company_address && (
                <div className="selected-address">
                  <span className="address-label">선택된 회사 주소:</span>
                  <span className="address-value">{formData.company_address}</span>
                </div>
              )}
              
              {companyAddressResults.length > 0 && (
                <div className="address-results">
                  {companyAddressResults.map((result, index) => (
                    <div 
                      key={index} 
                      className="address-result-item"
                      onClick={() => handleCompanyAddressSelect(result.roadAddr || result.jibunAddr)}
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

            <div className="form-group">
              <label className="form-label">성별 (선택사항)</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="prefer_not_to_say">선택하지 않음</option>
                <option value="male">남성</option>
                <option value="female">여성</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">활동 반경 (분, 선택사항)</label>
              <input
                type="number"
                name="activity_radius"
                placeholder="10"
                value={formData.activity_radius}
                onChange={handleInputChange}
                min="1"
                max="60"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">식사 패턴 (선택사항)</label>
              <select
                name="meal_pattern"
                value={formData.meal_pattern}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="2_meals">하루 2끼</option>
                <option value="3_meals">하루 3끼</option>
                <option value="eat_out_mostly">외식 위주</option>
              </select>
            </div>
          </div>



          {/* 약관 동의 */}
          <div className="form-section">
            <h3 className="section-title">약관 동의</h3>
            
            <div className="agreement-group">
                             <label className="checkbox-label">
                 <input
                   type="checkbox"
                   name="personalInfo"
                 />
                 <span className="checkmark"></span>
                 개인 정보 수집 및 이용 약관 동의 (필수)
               </label>
            </div>

            <div className="agreement-group">
                             <label className="checkbox-label">
                 <input
                   type="checkbox"
                   name="locationService"
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
