import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ReviewDetail.css';

const ReviewDetail = () => {
  const { reviewId } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  // 리뷰 상세 정보 조회
  const fetchReviewDetail = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.log('토큰이 없습니다.');
        navigate('/login');
        return;
      }

      const response = await fetch(`https://wrtigloo.duckdns.org:8000/reviews/${reviewId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('리뷰 상세 데이터:', data);
        setReview(data);

        // 현재 사용자가 리뷰 작성자인지 확인
        const userResponse = await fetch('https://wrtigloo.duckdns.org:8000/users/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': 'application/json'
          }
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setIsOwner(userData.id === data.user_id);
        }
      } else if (response.status === 404) {
        console.error('해당 리뷰를 찾을 수 없습니다.');
        alert('해당 리뷰를 찾을 수 없습니다.');
        navigate('/my-reviews');
      } else {
        console.error('API 응답 오류:', response.status, response.statusText);
        alert('데이터를 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('리뷰 상세 조회 에러:', error);
      alert('데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [reviewId, navigate]);

  useEffect(() => {
    if (reviewId) {
      fetchReviewDetail();
    }
  }, [reviewId, fetchReviewDetail]);

  const handleBack = () => {
    navigate('/my-reviews');
  };

  const handleEdit = () => {
    navigate(`/edit-review/${reviewId}`, { state: { reviewData: review } });
  };

  const handleDelete = async () => {
    if (!window.confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('로그인이 필요합니다.');
        navigate('/login');
        return;
      }

      const response = await fetch(`https://wrtigloo.duckdns.org:8000/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json'
        }
      });

      if (response.status === 204) {
        alert('리뷰가 삭제되었습니다.');
        navigate('/my-reviews');
      } else if (response.status === 404) {
        alert('해당 리뷰를 찾을 수 없습니다.');
        navigate('/my-reviews');
      } else {
        const errorData = await response.json();
        console.error('리뷰 삭제 실패:', response.status, errorData);
        alert('리뷰 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('리뷰 삭제 에러:', error);
      alert('리뷰 삭제 중 오류가 발생했습니다.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`review-detail-star ${index < rating ? 'active' : ''}`}
      >
        ★
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="review-detail-container">
        <div className="review-detail-header">
          <button className="review-detail-back-btn" onClick={handleBack}>
            &lt; 뒤로
          </button>
        </div>
        <div className="review-detail-loading">로딩 중...</div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="review-detail-container">
        <div className="review-detail-header">
          <button className="review-detail-back-btn" onClick={handleBack}>
            &lt; 뒤로
          </button>
        </div>
        <div className="review-detail-error">리뷰를 불러올 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="review-detail-container">
      <div className="review-detail-header">
        <button className="review-detail-back-btn" onClick={handleBack}>
          &lt; 리뷰 상세
        </button>
        {isOwner && (
          <div className="review-detail-actions">
            <button className="review-detail-edit-btn" onClick={handleEdit}>
              수정
            </button>
            <button className="review-detail-delete-btn" onClick={handleDelete}>
              삭제
            </button>
          </div>
        )}
      </div>

      <div className="review-detail-content">
        <div className="review-detail-info">
          <h2 className="review-detail-title">{review.title}</h2>
          
          <div className="review-detail-rating">
            {renderStars(review.rating)}
            <span className="review-detail-rating-text">({review.rating}/5)</span>
          </div>

          <div className="review-detail-meta">
            <div className="review-detail-date">
              {formatDate(review.created_datetime)}
            </div>
            {review.modified_datetime && review.modified_datetime !== review.created_datetime && (
              <div className="review-detail-modified">
                (수정됨: {formatDate(review.modified_datetime)})
              </div>
            )}
          </div>
        </div>

        {review.image && (
          <div className="review-detail-image">
            <img src={review.image} alt="리뷰 이미지" />
          </div>
        )}

        <div className="review-detail-text">
          <p>{review.content}</p>
        </div>

        <div className="review-detail-restaurant-info">
          <div className="review-detail-restaurant-label">식당 ID</div>
          <div className="review-detail-restaurant-value">{review.restaurant_id}</div>
        </div>

        <div className="review-detail-system-info">
          <div className="review-detail-system-row">
            <span className="review-detail-system-label">리뷰 ID</span>
            <span className="review-detail-system-value">{review.id}</span>
          </div>
          <div className="review-detail-system-row">
            <span className="review-detail-system-label">작성자 ID</span>
            <span className="review-detail-system-value">{review.user_id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetail;
