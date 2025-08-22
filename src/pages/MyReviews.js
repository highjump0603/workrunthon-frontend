import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyReviews.css';
import LeftArrowIcon from '../assets/left_arrow.svg';
import { reviewService } from '../services/reviewService';

const MyReviews = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [searchTitle, setSearchTitle] = useState('');
  const [selectedRating, setSelectedRating] = useState('');

  const pageSize = 10;

  // 리뷰 목록 조회
  const fetchReviews = async (page = 1, title = '', rating = '') => {
    try {
      setIsLoading(true);
      const params = {
        page,
        size: pageSize
      };

      if (title) params.title = title;
      if (rating) params.rating = parseInt(rating);

      const data = await reviewService.getMyReviews(params);
      setReviews(data.items || []);
      setTotalPages(Math.ceil(data.total / pageSize));
      setTotalReviews(data.total);
      setCurrentPage(page);
    } catch (error) {
      console.error('리뷰 조회 에러:', error);
      // API 에러 시 빈 배열로 설정 (리뷰가 없는 것처럼 표시)
      setReviews([]);
      setTotalPages(0);
      setTotalReviews(0);
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 리뷰 조회
  useEffect(() => {
    fetchReviews();
  }, []);

  // 검색 처리
  const handleSearch = () => {
    fetchReviews(1, searchTitle, selectedRating);
  };

  // 검색 조건 초기화
  const handleResetSearch = () => {
    setSearchTitle('');
    setSelectedRating('');
    fetchReviews(1, '', '');
  };

  // 페이지 변경
  const handlePageChange = (page) => {
    fetchReviews(page, searchTitle, selectedRating);
  };

  // 리뷰 삭제
  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
      try {
        await reviewService.deleteReview(reviewId);
        alert('리뷰가 삭제되었습니다.');
        // 현재 페이지 다시 조회
        fetchReviews(currentPage, searchTitle, selectedRating);
      } catch (error) {
        console.error('리뷰 삭제 에러:', error);
        alert('리뷰 삭제에 실패했습니다.');
      }
    }
  };

  // 별점 표시
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= rating ? 'filled' : ''}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="myreviews-container">
      {/* 헤더 */}
      <div className="myreviews-header">
        <button className="back-button" onClick={() => navigate('/mypage')}>
          <img src={LeftArrowIcon} alt="back" className="back-arrow" />
        </button>
        <h1 className="myreviews-title">내 리뷰</h1>
      </div>

      {/* 검색 및 필터 */}
      <div className="myreviews-search-section">
        <div className="search-input-group">
          <input
            type="text"
            placeholder="리뷰 제목으로 검색"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            className="search-input"
          />
          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            className="rating-select"
          >
            <option value="">전체 별점</option>
            <option value="5">5점</option>
            <option value="4">4점</option>
            <option value="3">3점</option>
            <option value="2">2점</option>
            <option value="1">1점</option>
          </select>
        </div>
        <div className="search-buttons">
          <button className="search-button" onClick={handleSearch}>
            검색
          </button>
          <button className="reset-button" onClick={handleResetSearch}>
            초기화
          </button>
        </div>
      </div>

      {/* 리뷰 개수 표시 */}
      <div className="reviews-count">
        총 {totalReviews}개의 리뷰
      </div>

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="reviews-loading">
          <p>리뷰를 불러오는 중...</p>
        </div>
      )}

      {/* 리뷰 목록 */}
      {!isLoading && (
        <>
          {reviews.length > 0 ? (
            <div className="reviews-list">
              {reviews.map((review) => (
                <div key={review.id} className="review-item">
                  <div className="review-header">
                    <div className="review-rating">
                      {renderStars(review.rating)}
                    </div>
                    <div className="review-date">
                      {formatDate(review.created_datetime)}
                    </div>
                  </div>
                  <div className="review-title">{review.title}</div>
                  <div className="review-content">{review.content}</div>
                  {review.image && (
                    <div className="review-image">
                      <img src={review.image} alt="리뷰 이미지" />
                    </div>
                  )}
                  <div className="review-actions">
                    <button 
                      className="edit-button"
                      onClick={() => navigate(`/edit-review/${review.id}`)}
                    >
                      수정
                    </button>
                    <button 
                      className="delete-button"
                      onClick={() => handleDeleteReview(review.id)}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-reviews">
              <p>작성한 리뷰가 없습니다.</p>
            </div>
          )}

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                이전
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`page-button ${page === currentPage ? 'active' : ''}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}
              
              <button
                className="page-button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                다음
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyReviews;
