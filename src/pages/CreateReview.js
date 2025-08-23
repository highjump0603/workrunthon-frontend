import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './CreateReview.css';

const CreateReview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const plannerData = location.state?.plannerData;
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    rating: 0,
    restaurant_id: 0,
    user_id: 0
  });
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        console.log('imageData 타입:', typeof imageData);
        
        // 응답이 객체인 경우 URL 추출, 문자열인 경우 그대로 사용
        const extractedUrl = typeof imageData === 'object' ? imageData.url : imageData;
        console.log('추출된 URL:', extractedUrl);
        console.log('추출된 URL 타입:', typeof extractedUrl);
        
        return extractedUrl;
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

      // 사용자 정보 가져오기
      const userResponse = await fetch('https://wrtigloo.duckdns.org:8000/users/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json'
        }
      });

      if (!userResponse.ok) {
        throw new Error('사용자 정보를 가져올 수 없습니다.');
      }

      const userData = await userResponse.json();
      
      // 이미지 업로드 (선택사항)
      let imageUrl = '';
      if (selectedImage) {
        imageUrl = await uploadImage();
        console.log('uploadImage 반환값:', imageUrl);
        console.log('uploadImage 반환값 타입:', typeof imageUrl);
        
        if (!imageUrl) {
          alert('이미지 업로드에 실패했습니다. 이미지 없이 리뷰를 작성하시겠습니까?');
        }
      }

      // 리뷰 데이터 준비 (제목 자동 생성)
      const autoTitle = formData.content.trim().substring(0, 20) + (formData.content.trim().length > 20 ? '...' : '');
      
      // 이미지 URL이 문자열인지 확인
      const finalImageUrl = imageUrl && typeof imageUrl === 'string' ? imageUrl : '';
      console.log('최종 이미지 URL:', finalImageUrl);
      console.log('최종 이미지 URL 타입:', typeof finalImageUrl);
      
      const reviewData = {
        title: autoTitle,
        content: formData.content.trim(),
        rating: formData.rating,
        image: finalImageUrl,
        restaurant_id: formData.restaurant_id || 1, // 기본값 설정 (실제로는 식당 선택 기능 필요)
        user_id: userData.id
      };

      console.log('리뷰 제출 데이터:', reviewData);

      // 리뷰 생성 API 호출
      const response = await fetch('https://wrtigloo.duckdns.org:8000/reviews/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json'
        },
        body: JSON.stringify(reviewData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('리뷰 생성 성공:', result);
        alert('리뷰가 성공적으로 등록되었습니다!');
        navigate('/my-reviews');
      } else {
        const errorData = await response.json();
        console.error('리뷰 생성 실패:', response.status, errorData);
        
        // 상세 에러 메시지 표시
        if (errorData.detail && Array.isArray(errorData.detail)) {
          const errorMessages = errorData.detail.map(err => `${err.loc?.join('.')}: ${err.msg}`).join('\n');
          alert(`리뷰 등록에 실패했습니다:\n${errorMessages}`);
        } else {
          alert('리뷰 등록에 실패했습니다. 다시 시도해주세요.');
        }
      }
    } catch (error) {
      console.error('리뷰 제출 에러:', error);
      alert('리뷰 등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-review-container">
      <div className="create-review-header">
        <button className="create-review-back-btn" onClick={handleBack}>
          &lt; 리뷰작성
        </button>
      </div>

      <div className="create-review-content">
        {plannerData && (
          <div className="create-review-planner-info">
            <div className="create-review-date">
              {new Date(plannerData.plan_date).toLocaleDateString()} {plannerData.type}
            </div>
            <div className="create-review-cost">
              ₩{plannerData.cost?.toLocaleString()}
            </div>
          </div>
        )}

        <div className="create-review-form">
          {/* 별점 */}
          <div className="create-review-section">
            <div className="create-review-restaurant-name">스시아</div>
            <div className="create-review-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`create-review-star ${star <= formData.rating ? 'active' : ''}`}
                  onClick={() => handleRatingClick(star)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          {/* 리뷰 제목 (숨김 처리 - 자동 생성) */}
          <input
            type="hidden"
            name="title"
            value={formData.title}
          />

          {/* 리뷰 내용 */}
          <div className="create-review-section">
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="리뷰를 10자 이상 작성해주세요."
              className="create-review-textarea"
              maxLength={5000}
            />
            <div className="create-review-char-count">
              {formData.content.length}/5,000자
            </div>
          </div>

          {/* 사진 업로드 */}
          <div className="create-review-section">
            <div className="create-review-photo-label">사진 (0/5장)</div>
            <div className="create-review-photo-upload">
              <input
                type="file"
                id="photo-upload"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="photo-upload" className="create-review-photo-btn">
                +
              </label>
              {imagePreview && (
                <div className="create-review-photo-preview">
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
            </div>
          </div>

          {/* 실제 금액 입력 */}
          <div className="create-review-section">
            <input
              type="text"
              placeholder="실제 금액 입력하기"
              className="create-review-amount-input"
              disabled
            />
            <span className="create-review-amount-unit">원</span>
          </div>
        </div>

        <button 
          className="create-review-submit-btn"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? '등록 중...' : '확인'}
        </button>
      </div>
    </div>
  );
};

export default CreateReview;
