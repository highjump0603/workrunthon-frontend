import React, { useState } from 'react';
import './AddressSearchPopup.css';

const AddressSearchPopup = ({ isOpen, onClose, onAddressSelect, addressType }) => {
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');

  const handleSearch = async () => {
    if (!keyword.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`https://business.juso.go.kr/addrlink/addrLinkApi.do`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          confmKey: 'devU01TX0FVVEgyMDI1MDgyMjE2MTAwODExNjEwMTY=',
          currentPage: currentPage,
          countPerPage: 10,
          keyword: keyword,
          resultType: 'json',
          hstryYn: 'N',
          firstSort: 'none',
          addInfoYn: 'N'
        })
      });

      const data = await response.json();
      
      if (data.results.common.errorCode === '0') {
        setSearchResults(data.results.juso || []);
        setTotalCount(parseInt(data.results.common.totalCount));
      } else {
        alert('주소 검색에 실패했습니다.');
      }
    } catch (error) {
      console.error('주소 검색 오류:', error);
      alert('주소 검색 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address.roadAddr);
    setDetailAddress('');
  };

  const handleSubmit = () => {
    if (!selectedAddress.trim()) {
      alert('주소를 선택해주세요.');
      return;
    }

    const fullAddress = detailAddress.trim() 
      ? `${selectedAddress} ${detailAddress.trim()}`
      : selectedAddress;

    onAddressSelect({
      type: addressType,
      address: fullAddress,
      roadAddress: selectedAddress,
      detailAddress: detailAddress.trim()
    });
    
    onClose();
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setSearchResults([]);
    // 페이지 변경 시 재검색
    setTimeout(() => handleSearch(), 100);
  };

  if (!isOpen) return null;

  return (
    <div className="address-popup-overlay">
      <div className="address-popup">
        <div className="address-popup-header">
          <h3>주소 검색</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="address-popup-content">
          <div className="search-section">
            <div className="search-input-group">
              <input
                type="text"
                placeholder="도로명주소를 입력하세요"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="search-input"
              />
              <button onClick={handleSearch} className="search-button" disabled={isLoading}>
                {isLoading ? '검색중...' : '검색'}
              </button>
            </div>
          </div>

          {searchResults.length > 0 && (
            <div className="results-section">
              <div className="results-header">
                <span>검색 결과 ({totalCount}건)</span>
              </div>
              <div className="results-list">
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    className={`result-item ${selectedAddress === result.roadAddr ? 'selected' : ''}`}
                    onClick={() => handleAddressSelect(result)}
                  >
                    <div className="result-address">{result.roadAddr}</div>
                    <div className="result-jibun">{result.jibunAddr}</div>
                  </div>
                ))}
              </div>
              
              {totalCount > 10 && (
                <div className="pagination">
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="page-button"
                  >
                    이전
                  </button>
                  <span className="page-info">{currentPage} / {Math.ceil(totalCount / 10)}</span>
                  <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= Math.ceil(totalCount / 10)}
                    className="page-button"
                  >
                    다음
                  </button>
                </div>
              )}
            </div>
          )}

          {selectedAddress && (
            <div className="address-confirmation">
              <div className="selected-address">
                <h4>선택된 주소</h4>
                <p>{selectedAddress}</p>
              </div>
              
              <div className="detail-address-input">
                <label>상세주소</label>
                <input
                  type="text"
                  placeholder="상세주소를 입력하세요 (선택사항)"
                  value={detailAddress}
                  onChange={(e) => setDetailAddress(e.target.value)}
                  className="detail-input"
                />
              </div>
            </div>
          )}

          <div className="popup-actions">
            <button onClick={onClose} className="cancel-button">취소</button>
            <button 
              onClick={handleSubmit} 
              className="confirm-button"
              disabled={!selectedAddress}
            >
              주소 추가
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressSearchPopup;
