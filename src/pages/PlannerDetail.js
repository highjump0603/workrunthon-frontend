import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PlannerDetail.css';

const PlannerDetail = () => {
  const { plannerId } = useParams();
  const navigate = useNavigate();
  const [plannerDetail, setPlannerDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  // 식사 계획 상세 정보 조회
  const fetchPlannerDetail = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.log('토큰이 없습니다.');
        navigate('/login');
        return;
      }

      const response = await fetch(`https://wrtigloo.duckdns.org:8000/planners/${plannerId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('플래너 상세 데이터:', data);
        setPlannerDetail(data);
      } else if (response.status === 404) {
        console.error('해당 식사 계획을 찾을 수 없습니다.');
        alert('해당 식사 계획을 찾을 수 없습니다.');
        navigate('/ledger');
      } else {
        console.error('API 응답 오류:', response.status, response.statusText);
        alert('데이터를 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('플래너 상세 조회 에러:', error);
      alert('데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [plannerId, navigate]);

  useEffect(() => {
    if (plannerId) {
      fetchPlannerDetail();
    }
  }, [plannerId, fetchPlannerDetail]);

  const handleBack = () => {
    navigate('/ledger');
  };

  const handleCreateReview = () => {
    if (plannerDetail) {
      // 리뷰 작성 페이지로 이동 (플래너 정보 전달)
      navigate('/create-review', { 
        state: { 
          plannerData: plannerDetail 
        } 
      });
    }
  };

  if (loading) {
    return (
      <div className="planner-detail-container">
        <div className="planner-detail-header">
          <button className="planner-detail-back-btn" onClick={handleBack}>
            &lt; 뒤로
          </button>
        </div>
        <div className="planner-detail-loading">로딩 중...</div>
      </div>
    );
  }

  if (!plannerDetail) {
    return (
      <div className="planner-detail-container">
        <div className="planner-detail-header">
          <button className="planner-detail-back-btn" onClick={handleBack}>
            &lt; 뒤로
          </button>
        </div>
        <div className="planner-detail-error">데이터를 불러올 수 없습니다.</div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[date.getDay()];
    
    return `${year}년 ${month}월 ${day}일(${weekday})`;
  };

  const getMealTypeColor = (type) => {
    switch (type) {
      case '아침':
        return '#FF6B6B';
      case '점심':
        return '#4ECDC4';
      case '저녁':
        return '#45B7D1';
      default:
        return '#95a5a6';
    }
  };

  return (
    <div className="planner-detail-container">
      <div className="planner-detail-header">
        <button className="planner-detail-back-btn" onClick={handleBack}>
          &lt; 내역
        </button>
      </div>

      <div className="planner-detail-content">
        <div className="planner-detail-date">
          {formatDate(plannerDetail.plan_date)}, {plannerDetail.type}
        </div>

        <div className="planner-detail-amount">
          <div className="planner-detail-label">지출 금액</div>
          <div className="planner-detail-cost">₩{plannerDetail.cost?.toLocaleString() || 0}</div>
        </div>

        <div className="planner-detail-memo">
          <div className="planner-detail-label">메모</div>
          <div className="planner-detail-memo-content">
            {plannerDetail.memo || '메모를 입력하세요'}
          </div>
        </div>

        <div className="planner-detail-info">
          <div className="planner-detail-info-row">
            <span className="planner-detail-info-label">식사 타입</span>
            <span 
              className="planner-detail-meal-type"
              style={{ color: getMealTypeColor(plannerDetail.type) }}
            >
              {plannerDetail.type}
            </span>
          </div>
          
          {plannerDetail.menu_id && (
            <div className="planner-detail-info-row">
              <span className="planner-detail-info-label">메뉴 ID</span>
              <span className="planner-detail-info-value">{plannerDetail.menu_id}</span>
            </div>
          )}
          
          <div className="planner-detail-info-row">
            <span className="planner-detail-info-label">생성일시</span>
            <span className="planner-detail-info-value">
              {new Date(plannerDetail.created_datetime).toLocaleString()}
            </span>
          </div>
          
          {plannerDetail.modified_datetime && (
            <div className="planner-detail-info-row">
              <span className="planner-detail-info-label">수정일시</span>
              <span className="planner-detail-info-value">
                {new Date(plannerDetail.modified_datetime).toLocaleString()}
              </span>
            </div>
          )}
        </div>

        <button className="planner-detail-review-btn" onClick={handleCreateReview}>
          리뷰 작성하기
        </button>
      </div>
    </div>
  );
};

export default PlannerDetail;
