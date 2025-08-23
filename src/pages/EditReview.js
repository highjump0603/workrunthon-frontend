import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './EditReview.css';

const EditReview = () => {
  const { reviewId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const reviewData = location.state?.reviewData;
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    rating: 0,
    restaurant_id: 0,
    user_id: 0
  });
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (reviewData) {
      setFormData({
        title: reviewData.title || '',
        content: reviewData.content || '',
        rating: reviewData.rating || 0,
        restaurant_id: reviewData.restaurant_id || 0,
        user_id: reviewData.user_id || 0
      });
      setCurrentImage(reviewData.image || '');
    }
  }, [reviewData]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingClick = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating: rating
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      
      // 이미지 미리보기 생성
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!selectedImage) return null;
    
    try {
      const formData = new FormData();
      formData.append('file', selectedImage);
      
      const response = await fetch('https://wrtigloo.duckdns.org:8000/reviews/image', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const imageData = await response.json();
        console.log('이미지 업로드 성공:', imageData);
        return typeof imageData === 'object' ? imageData.url : imageData;
      } else {
        console.error('이미지 업로드 실패:', response.status);
        return null;
      }
    } catch (error) {
      console.error('이미지 업로드 에러:', error);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!formData.content.trim()) {
      alert('리뷰 내용을 입력해주세요.');
      return;
    }
    
    if (formData.content.trim().length < 10) {
      alert('리뷰를 10자 이상 작성해주세요.');
      return;
    }
    
    if (formData.rating === 0) {
      alert('별점을 선택해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('로그인이 필요합니다.');
        navigate('/login');
        return;
      }

      // 이미지 업로드 (새 이미지가 선택된 경우)
      let imageUrl = currentImage;
      if (selectedImage) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          alert('이미지 업로드에 실패했습니다. 기존 이미지로 유지됩니다.');
        }
      }

      // 리뷰 데이터 준비 (제목 자동 생성)
      const autoTitle = formData.content.trim().substring(0, 20) + (formData.content.trim().length > 20 ? '...' : '');
      const updateData = {
        title: autoTitle,
        content: formData.content.trim(),
        rating: formData.rating,
        image: imageUrl || '',
        restaurant_id: formData.restaurant_id,
        user_id: formData.user_id
      };

      console.log('리뷰 수정 데이터:', updateData);

      // 리뷰 수정 API 호출
      const response = await fetch(`https://wrtigloo.duckdns.org:8000/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('리뷰 수정 성공:', result);
        alert('리뷰가 성공적으로 수정되었습니다!');
        navigate(`/review-detail/${reviewId}`);
      } else {
        const errorData = await response.json();
        console.error('리뷰 수정 실패:', response.status, errorData);
        
        if (errorData.detail && Array.isArray(errorData.detail)) {
          const errorMessages = errorData.detail.map(err => `${err.loc?.join('.')}: ${err.msg}`).join('\n');
          alert(`리뷰 수정에 실패했습니다:\n${errorMessages}`);
        } else {
          alert('리뷰 수정에 실패했습니다. 다시 시도해주세요.');
        }
      }
    } catch (error) {
      console.error('리뷰 수정 에러:', error);
      alert('리뷰 수정 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="edit-review-container">
      <div className="edit-review-header">
        <button className="edit-review-back-btn" onClick={handleBack}>
          &lt; 리뷰 수정
        </button>
      </div>

      <div className="edit-review-content">
        <div className="edit-review-form">
          {/* 별점 */}
          <div className="edit-review-section">
            <div className="edit-review-restaurant-name">스시아</div>
            <div className="edit-review-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`edit-review-star ${star <= formData.rating ? 'active' : ''}`}
                  onClick={() => handleRatingClick(star)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          {/* 리뷰 내용 */}
          <div className="edit-review-section">
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="리뷰를 10자 이상 작성해주세요."
              className="edit-review-textarea"
              maxLength={5000}
            />
            <div className="edit-review-char-count">
              {formData.content.length}/5,000자
            </div>
          </div>

          {/* 사진 업로드 */}
          <div className="edit-review-section">
            <div className="edit-review-photo-label">사진</div>
            <div className="edit-review-photo-upload">
              <input
                type="file"
                id="photo-upload"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="photo-upload" className="edit-review-photo-btn">
                +
              </label>
              
              {/* 현재 이미지 표시 */}
              {(imagePreview || currentImage) && (
                <div className="edit-review-photo-preview">
                  <img src={imagePreview || currentImage} alt="Preview" />
                  {imagePreview && (
                    <div className="edit-review-new-image-badge">새 이미지</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <button 
          className="edit-review-submit-btn"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? '수정 중...' : '수정 완료'}
        </button>
      </div>
    </div>
  );
};

export default EditReview;
