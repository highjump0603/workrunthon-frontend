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
      
      const response = await fetch('http://15.165.7.141:8000/users/me', {
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
        setMealHistory([]);
        setLoading(false);
        return;
      }

      // 사용자 ID를 가져오기 위해 users/me API 호출
      const userResponse = await fetch('http://15.165.7.141:8000/users/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json'
        }
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        const userId = userData.id;

        // /planners/history API 호출
        const response = await fetch(`http://15.165.7.141:8000/planners/history?user_id=${userId}&limit=50`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          
          if (Array.isArray(data)) {
            // 과거 날짜의 계획만 필터링 (지출 내역으로 표시)
            const pastPlans = data.filter(plan => {
              const planDate = new Date(plan.plan_date);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return planDate < today;
            });

            setMealHistory(pastPlans);

            // 예산 계산 업데이트
            const totalSpent = pastPlans.reduce((sum, plan) => sum + (plan.cost || 0), 0);
            const remainingBudget = Math.max(0, budgetInfo.total_budget - totalSpent);
            const budgetPercentage = budgetInfo.total_budget > 0 ? (totalSpent / budgetInfo.total_budget) * 100 : 0;

            setBudgetInfo(prev => ({
              ...prev,
              remaining_budget: remainingBudget,
              budget_percentage: budgetPercentage
            }));
          } else {
            setMealHistory([]);
          }
        } else {
          setMealHistory([]);
        }
      } else {
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
        
        {loading ? (
          <div className="ledger-loading">내역을 불러오는 중...</div>
        ) : mealHistory.length > 0 ? (
          <div className="ledger-expenses-list">
            {mealHistory.map((plan) => (
              <div key={plan.id} className="ledger-expense-item">
                <div className="ledger-expense-info">
                  <div className="ledger-expense-date">{formatDate(plan.plan_date)}</div>
                  <div className="ledger-expense-restaurant">
                    {plan.menu?.restaurant?.name || plan.memo || '식사'}
                  </div>
                  <div className="ledger-expense-menu">
                    {plan.menu?.name || plan.type || '일반'}
                  </div>
                </div>
                <div className="ledger-expense-amount">₩{(plan.cost || 0).toLocaleString()}</div>
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
