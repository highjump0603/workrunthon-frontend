import React, { useState, useEffect } from 'react';
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
          remaining_budget: userData.budget || 0, // 현재는 총 예산과 동일하게 설정
          budget_percentage: 0 // 아직 지출 정보가 없어서 0으로 설정
        });
      }
    } catch (error) {
      console.error('사용자 프로필 조회 에러:', error);
    }
  };

  // 컴포넌트 마운트 시 예산 정보 가져오기
  useEffect(() => {
    fetchBudgetInfo();
  }, []);

  // 지출 내역 데이터
  const expenses = [
    {
      id: 1,
      date: '4월 18일',
      restaurant: '중식당',
      menu: '짜장면',
      amount: 7500
    },
    {
      id: 2,
      date: '4월 17일',
      restaurant: '삼겹살',
      menu: '삼겹살',
      amount: 11000
    },
    {
      id: 3,
      date: '4월 16일',
      restaurant: '한식당',
      menu: '비빕밥',
      amount: 10500
    },
    {
      id: 4,
      date: '4월 15일',
      restaurant: '한식당',
      menu: '김치찌개 백반',
      amount: 8500
    }
  ];

  const handleAddDetails = () => {
    navigate('/add-details');
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
        
        <div className="ledger-expenses-list">
          {expenses.map((expense, index) => (
            <div key={expense.id} className="ledger-expense-item">
              <div className="ledger-expense-info">
                <div className="ledger-expense-date">{expense.date}</div>
                <div className="ledger-expense-restaurant">{expense.restaurant}</div>
                <div className="ledger-expense-menu">{expense.menu}</div>
              </div>
                             <div className="ledger-expense-amount">₩{expense.amount.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{height: '100px'}}></div>
      <BottomNavigation activeTab="ledger" />
    </div>
  );
};

export default Ledger;
