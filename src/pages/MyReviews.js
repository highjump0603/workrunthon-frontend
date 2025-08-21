import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyReviews.css';
import BottomNavigation from '../components/BottomNavigation';
import LeftArrowIcon from '../assets/left_arrow.svg';

const MyReviews = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('전체');
  const [showPhotoReviewsOnly, setShowPhotoReviewsOnly] = useState(false);
  const [sortBy] = useState('최신등록순');

  const reviews = [
    {
      id: 1,
      restaurantName: '스시야',
      rating: 4.3,
      content: '스시가 입에서 사르르 녹아요 짱맛있음',
      date: '2024년 3월 17일',
      hasImage: true,
      isPublic: true
    },
    {
      id: 2,
      restaurantName: '이탈리안 비스트로',
      rating: 3.9,
      content: '가격에 비해 양이 너무 적어요. 주차도 불편해요..',
      date: '2024년 2월 18일',
      hasImage: true,
      isPublic: false
    },
    {
      id: 3,
      restaurantName: '고기 굽는 하루',
      rating: 4.4,
      content: '고기 다 구워주셔서 먹기 편하고 볶음밥이 진짜 맛있어요 또 갈게요~',
      date: '2023년 12월 24일',
      hasImage: true,
      isPublic: true
    }
  ];

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= rating ? 'filled' : 'empty'}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  const handleEditReview = (review) => {
    console.log(`${review.restaurantName} 리뷰 수정`);
    // 리뷰 수정 페이지로 이동하는 로직 추가 가능
  };

  const handleDeleteReview = (review) => {
    console.log(`${review.restaurantName} 리뷰 삭제`);
    // 리뷰 삭제 로직 추가 가능
  };

  const handleTogglePublic = (review) => {
    console.log(`${review.restaurantName} 공개/비공개 토글`);
    // 공개/비공개 토글 로직 추가 가능
  };

  const filteredReviews = showPhotoReviewsOnly 
    ? reviews.filter(review => review.hasImage)
    : reviews;

  return (
    <div className="my-reviews-container">
      {/* 헤더 */}
      <div className="my-reviews-header">
        <button className="back-button" onClick={() => navigate('/mypage')}>
          <img src={LeftArrowIcon} alt="back" className="back-arrow" />
        </button>
        <h1 className="my-reviews-title">나의 리뷰</h1>
      </div>

      {/* 탭 섹션 */}
      <div className="tabs-section">
        <div className="tab-buttons">
          <button 
            className={`tab-button ${activeTab === '전체' ? 'active' : ''}`}
            onClick={() => setActiveTab('전체')}
          >
            전체(12)
          </button>
          <button 
            className={`tab-button ${activeTab === '공개' ? 'active' : ''}`}
            onClick={() => setActiveTab('공개')}
          >
            공개
          </button>
          <button 
            className={`tab-button ${activeTab === '비공개' ? 'active' : ''}`}
            onClick={() => setActiveTab('비공개')}
          >
            비공개
          </button>
        </div>
      </div>

      {/* 컨트롤 섹션 */}
      <div className="controls-section">
        <div className="photo-filter">
          <input
            type="checkbox"
            id="photoReviewsOnly"
            checked={showPhotoReviewsOnly}
            onChange={(e) => setShowPhotoReviewsOnly(e.target.checked)}
          />
          <label htmlFor="photoReviewsOnly">사진 리뷰만 보기</label>
        </div>
        <div className="sort-control">
          <button className="sort-button">
            {sortBy}
          </button>
        </div>
      </div>

      {/* 리뷰 목록 */}
      <div className="reviews-list">
        {filteredReviews.map((review, index) => (
          <div key={review.id} className="review-item">
            <div className="review-content">
              <div className="review-left">
                <div className="restaurant-name">{review.restaurantName}</div>
                <div className="review-rating">
                  {renderStars(review.rating)}
                  <span className="rating-number">{review.rating}</span>
                </div>
                <div className="review-text">{review.content}</div>
                <div className="review-date">{review.date}</div>
                <div className="review-actions">
                  {!review.isPublic && (
                    <button 
                      className="action-button private-button"
                      onClick={() => handleTogglePublic(review)}
                    >
                      비공개
                    </button>
                  )}
                  <button 
                    className="action-button edit-button"
                    onClick={() => handleEditReview(review)}
                  >
                    수정
                  </button>
                  <button 
                    className="action-button delete-button"
                    onClick={() => handleDeleteReview(review)}
                  >
                    삭제
                  </button>
                </div>
              </div>
              <div className="review-right">
                <div className="review-image-placeholder">
                  {/* 이미지 플레이스홀더 */}
                </div>
              </div>
            </div>
            {index < filteredReviews.length - 1 && <div className="divider"></div>}
          </div>
        ))}
      </div>

      <div style={{height: '100px'}}></div>
      <BottomNavigation activeTab="mypage" />
    </div>
  );
};

export default MyReviews;
