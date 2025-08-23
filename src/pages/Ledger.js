import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Ledger.css';
import BottomNavigation from '../components/BottomNavigation';

const Ledger = () => {
  const navigate = useNavigate();
  
  // 예산 정보 state 추가
  const [budgetInfo, setBudgetInfo] = useState({
    total_budget: 0,
    remaining_budget: 0,
    budget_percentage: 0
  });

  // 식사 계획 이력 데이터 state 추가
  const [mealHistory, setMealHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // 사용자 프로필에서 예산 정보 가져오기
  const fetchBudgetInfo = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;
      
      const response = await fetch('https://wrtigloo.duckdns.org:8000/users/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        // 사용자 프로필에서 예산 정보 추출
        setBudgetInfo({
          total_budget: userData.budget || 0,
          remaining_budget: userData.budget || 0, // 초기값은 총 예산과 동일
          budget_percentage: 0 // 초기값
        });
      }
    } catch (error) {
      console.error('사용자 프로필 조회 에러:', error);
    }
  };

  // 사용자의 최근 식사 계획 거래 이력 가져오기
  const fetchMealHistory = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.log('토큰이 없습니다.');
        setMealHistory([]);
        setLoading(false);
        return;
      }

      console.log('식사 계획 이력 조회 시작...');

      // 사용자 ID를 가져오기 위해 users/me API 호출
      const userResponse = await fetch('https://wrtigloo.duckdns.org:8000/users/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json'
        }
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        const userId = userData.id;
        console.log('사용자 ID:', userId);

        // /planners/history API 호출
        const response = await fetch(`https://wrtigloo.duckdns.org:8000/planners/history?user_id=${userId}&limit=50`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log('API 응답 데이터:', data);
          
          if (Array.isArray(data)) {
            // 모든 계획을 표시 (필터링 제거)
            console.log('전체 계획 데이터:', data);
            setMealHistory(data);

            // 예산 계산 업데이트
            const totalSpent = data.reduce((sum, plan) => sum + (plan.cost || 0), 0);
            const remainingBudget = Math.max(0, budgetInfo.total_budget - totalSpent);
            const budgetPercentage = budgetInfo.total_budget > 0 ? (totalSpent / budgetInfo.total_budget) * 100 : 0;

            console.log('예산 계산 결과:', { totalSpent, remainingBudget, budgetPercentage });

            setBudgetInfo(prev => ({
              ...prev,
              remaining_budget: remainingBudget,
              budget_percentage: budgetPercentage
            }));
          } else {
            console.log('API 응답이 배열이 아닙니다:', typeof data);
            setMealHistory([]);
          }
        } else {
          console.error('API 응답 오류:', response.status, response.statusText);
          setMealHistory([]);
        }
      } else {
        console.error('사용자 정보 조회 실패:', userResponse.status);
        setMealHistory([]);
      }
    } catch (error) {
      console.error('식사 계획 이력 조회 에러:', error);
      setMealHistory([]);
    } finally {
      setLoading(false);
    }
  }, [budgetInfo.total_budget]);

  // 컴포넌트 마운트 시 데이터 가져오기
  useEffect(() => {
    fetchBudgetInfo();
  }, []);

  // 예산 정보가 로드된 후 식사 계획 이력 데이터 가져오기
  useEffect(() => {
    if (budgetInfo.total_budget > 0) {
      fetchMealHistory();
    }
  }, [budgetInfo.total_budget, fetchMealHistory]);

  const handleAddDetails = () => {
    navigate('/add-details');
  };

  // 식사 계획 삭제 함수
  const handleDeletePlan = async (planId) => {
    // 첫 번째 확인: 삭제 의도 확인
    if (!window.confirm('이 식사 계획을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }

      console.log('=== 식사 계획 삭제 시작 ===');
      console.log('삭제할 계획 ID:', planId);
      console.log('사용할 토큰:', token.substring(0, 20) + '...');

      const deleteUrl = `https://wrtigloo.duckdns.org:8000/planners/${planId}/hard`;
      console.log('삭제 요청 URL:', deleteUrl);

      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json'
        }
      });

      console.log('삭제 응답 상태:', response.status);
      console.log('삭제 응답 헤더:', response.headers);
      console.log('삭제 응답 URL:', response.url);

      if (response.status === 204) {
        console.log('✅ 식사 계획 삭제 성공');
        alert('식사 계획이 삭제되었습니다.');
        
        // 삭제된 계획을 목록에서 제거
        setMealHistory(prev => {
          const updated = prev.filter(plan => plan.id !== planId);
          console.log('삭제 후 남은 계획 수:', updated.length);
          return updated;
        });
        
        // 예산 정보 다시 계산
        const updatedHistory = mealHistory.filter(plan => plan.id !== planId);
        const totalSpent = updatedHistory.reduce((sum, plan) => sum + (plan.cost || 0), 0);
        const remainingBudget = Math.max(0, budgetInfo.total_budget - totalSpent);
        const budgetPercentage = budgetInfo.total_budget > 0 ? (totalSpent / budgetInfo.total_budget) * 100 : 0;

        console.log('예산 재계산 결과:', { totalSpent, remainingBudget, budgetPercentage });

        setBudgetInfo(prev => ({
          ...prev,
          remaining_budget: remainingBudget,
          budget_percentage: budgetPercentage
        }));
      } else if (response.status === 404) {
        console.log('❌ 해당 식사 계획을 찾을 수 없음');
        alert('해당 식사 계획을 찾을 수 없습니다.');
      } else {
        console.error('❌ 삭제 실패:', response.status, response.statusText);
        
        // 응답 본문이 있는 경우 읽어보기
        try {
          const errorText = await response.text();
          console.error('에러 응답 본문:', errorText);
        } catch (e) {
          console.error('응답 본문 읽기 실패:', e);
        }
        
        alert(`삭제에 실패했습니다. (${response.status})`);
      }
    } catch (error) {
      console.error('❌ 식사 계획 삭제 에러:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  // 날짜를 한국어 형식으로 변환
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}월 ${day}일`;
  };

  return (
    <div className="ledger-page">
      {/* 예산 요약 섹션 */}
      <div className="ledger-budget-summary">
        <div className="ledger-budget-row">
          <span className="ledger-budget-label">월 예산</span>
          <span className="ledger-budget-amount">₩{budgetInfo?.total_budget?.toLocaleString() || 0}</span>
        </div>
        
        {/* 진행률 바 */}
        <div className="ledger-progress-bar">
          <div 
            className="ledger-progress-fill" 
            style={{ width: `${Math.min(budgetInfo?.budget_percentage || 0, 100)}%` }}
          ></div>
        </div>
        
        <div className="ledger-budget-row">
          <span className="ledger-budget-label">남은 금액</span>
          <span className="ledger-budget-remaining">₩{budgetInfo?.remaining_budget?.toLocaleString() || 0}</span>
        </div>
        
        <div className="ledger-budget-row">
          <span className="ledger-budget-label">지출 금액</span>
          <span className="ledger-budget-spent">₩{(budgetInfo?.total_budget - budgetInfo?.remaining_budget)?.toLocaleString() || 0}</span>
        </div>
      </div>

      {/* 내역 추가 버튼 */}
      <button className="ledger-add-details-btn font-bold" onClick={handleAddDetails}>
        내역 추가
      </button>

      {/* 지출 내역 섹션 */}
      <div className="ledger-expenses-section">
        <div className="ledger-section-title">내역</div>
        
        {console.log('렌더링 상태:', { loading, mealHistoryLength: mealHistory.length, mealHistory })}
        
        {loading ? (
          <div className="ledger-loading">내역을 불러오는 중...</div>
        ) : mealHistory.length > 0 ? (
          <div className="ledger-expenses-list">
            {mealHistory.map((plan) => (
              <div key={plan.id} className="ledger-expense-item">
                <div className="ledger-expense-info">
                  <div className="ledger-expense-date">{formatDate(plan.plan_date)}</div>
                  <div className="ledger-expense-type">{plan.type}</div>
                  <div className="ledger-expense-memo">
                    {plan.memo || '메모 없음'}
                  </div>
                  {plan.menu && (
                    <div className="ledger-expense-menu">
                      메뉴: {plan.menu.name}
                      {plan.menu.restaurant && (
                        <span className="ledger-expense-restaurant">
                          ({plan.menu.restaurant.name})
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="ledger-expense-actions">
                  <div className="ledger-expense-amount">₩{(plan.cost || 0).toLocaleString()}</div>
                  <button 
                    className="ledger-delete-btn"
                    onClick={() => handleDeletePlan(plan.id)}
                    title="삭제"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="ledger-no-expenses">아직 지출 내역이 없습니다.</div>
        )}
      </div>

      <div style={{height: '100px'}}></div>
      <BottomNavigation activeTab="ledger" />
    </div>
  );
};

export default Ledger;
